import { Router, Request, Response } from 'express'
import axios from 'axios'
import * as cheerio from 'cheerio'
import https from 'https'
import { getDb } from '../db'
import { callLLM } from '../lib/llm'

const router = Router()

// Disable SSL verification for corporate/Windows certificate issues
const httpsAgent = new https.Agent({ rejectUnauthorized: false })

// Google CSE — fallback if work.ua HTTP fails (requires billing active)
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID
const GOOGLE_CSE_URL = 'https://www.googleapis.com/customsearch/v1'

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'uk-UA,uk;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
}

const CITY_MAP_WORK: Record<string, string> = {
  'Kyiv': '1', 'Kharkiv': '2', 'Lviv': '3', 'Odesa': '4',
  'Dnipro': '7', 'Zaporizhzhia': '8', 'Vinnytsia': '10',
  'Poltava': '16', 'Cherkasy': '18', 'Zhytomyr': '24',
}

interface ScrapedCandidate {
  role: string
  salary_text: string
  salary_expectation: number
  location_text: string
  experience_text: string
  experience_years: number
  profile_url: string
  source_platform: string
  initials: string
  tags: string[]
  profile_data?: { education?: string; skills?: string[]; employment?: string } | null
  age?: number
  education?: string
}

// ─── Enrich a work.ua profile with data from its individual page ──────────────
async function enrichWorkUaProfile(candidate: ScrapedCandidate): Promise<ScrapedCandidate> {
  try {
    const { data: html } = await axios.get(candidate.profile_url, {
      headers: BROWSER_HEADERS,
      timeout: 8000,
      httpsAgent,
    })
    const $ = cheerio.load(html)

    // dt/dd fields: employment type, age, city
    const fields: Record<string, string> = {}
    $('dl dt').each((_, dt) => {
      const key = $(dt).text().replace(/\u00a0/g, ' ').trim()
      const val = $(dt).next('dd').text().replace(/\u00a0/g, ' ').trim()
      if (key && val) fields[key] = val
    })

    const city = fields['Місто:'] || candidate.location_text
    const employment = fields['Вид зайнятості:'] || ''
    const age = fields['Вік:'] ? parseInt(fields['Вік:']) : undefined

    // Map h2 headings to indices for section boundaries
    const allH2s = $('h2').toArray()
    const sectionIdx = (re: RegExp) => allH2s.findIndex(h => re.test($(h).text().trim()))
    const expStart   = sectionIdx(/досвід роботи/i)
    const skillsIdx  = sectionIdx(/навичк/i)
    const eduIdx     = sectionIdx(/^Освіта$/i)
    const addIdx     = sectionIdx(/додаткова/i)

    // ── Experience: parse durations from job-entry h2 paragraphs ──────────────
    let totalMonths = candidate.experience_years > 0 ? candidate.experience_years * 12 : 0
    if (totalMonths === 0 && expStart > -1) {
      const endCandidates = [skillsIdx, eduIdx, addIdx].filter(i => i > expStart && i > -1)
      const expEnd = endCandidates.length ? Math.min(...endCandidates) : allH2s.length
      for (let i = expStart + 1; i < expEnd; i++) {
        const pText = $(allH2s[i]).next('p').text().replace(/\u00a0/g, ' ')
        const dur = pText.match(/\((\d+)\s*(?:рік|роки|років)(?:[^\d]*(\d+)\s*місяц[ьів]+)?\)/)
        if (dur) totalMonths += parseInt(dur[1]) * 12 + (dur[2] ? parseInt(dur[2]) : 0)
      }
    }
    const experienceYears = totalMonths > 0 ? Math.round(totalMonths / 12) : candidate.experience_years

    // ── Skills: collect individual span items in "Знання і навички" section ───
    let skills: string[] = []
    if (skillsIdx > -1) {
      let el = $(allH2s[skillsIdx]).next()
      while (el.length && el.prop('tagName') !== undefined) {
        if (el.prop('tagName') === 'H2') break
        const spans = el.find('span').map((_, s) => $(s).text().replace(/\u00a0/g, ' ').trim()).get()
          .filter(t => t.length > 2 && t.length < 60)
        if (spans.length) {
          skills = skills.concat(spans)
        } else {
          const raw = el.text().replace(/\u00a0/g, ' ').trim()
          if (raw) skills = skills.concat(raw.split(/[,\n]+/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 50))
        }
        el = el.next()
      }
      skills = [...new Set(skills)].slice(0, 8)
    }

    // ── Education: school name + level — only within the same card as "Освіта" ──
    let education = ''
    if (eduIdx > -1) {
      const eduH2El = $(allH2s[eduIdx])
      const eduParent = eduH2El.parent()
      const parts: string[] = []
      // Only walk siblings after "Освіта" within the same parent container
      let sibling = eduH2El.next()
      while (sibling.length) {
        const tag = sibling.prop('tagName')
        if (tag === 'H2') {
          // Stop if this h2 is a known non-education section or not in same parent
          const sibText = sibling.text().replace(/\u00a0/g, ' ').trim()
          if (/Схожі|Інші|Кандидат|Додаткова|Знання|Контакт/i.test(sibText)) break
          // Check parent matches
          if (sibling.parent().attr('class') !== eduParent.attr('class')) break
          const pText = sibling.next('p').text().replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
          const levelMatch = pText.match(/Вища|Середня спец[іа]+льна|Середня|Бакалавр|Магістр|PhD/i)
          if (sibText) parts.push(levelMatch ? levelMatch[0] + ' – ' + sibText : sibText)
        }
        sibling = sibling.next()
      }
      education = parts.join(', ')
    }

    const tags = skills.length > 0 ? skills : candidate.tags
    const experienceParts = [employment].filter(Boolean)

    return {
      ...candidate,
      location_text: city,
      experience_text: experienceParts.join(' | ').slice(0, 300),
      experience_years: experienceYears,
      education: education || undefined,
      age,
      tags,
      profile_data: {
        employment: employment || undefined,
        skills: skills.length > 0 ? skills : undefined,
        education: education || undefined,
      },
    }
  } catch {
    return candidate
  }
}

function generateInitials(): string {
  const a = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  const b = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  return `${a}.${b}.`
}

function parseSalary(text: string): number {
  const nums = text.replace(/\s/g, '').match(/\d+/g)
  if (!nums) return 0
  return parseInt(nums[0], 10)
}

function parseExperienceYears(text: string): number {
  // "5 років 3 місяці" → 5, "1 рік" → 1, "3 роки" → 3, "Менше року" → 0
  const match = text.match(/(\d+)\s*(?:рік|роки|років|р\.)/i)
  return match ? parseInt(match[1]) : 0
}

// Ukrainian transliteration for work.ua slug
const UA_TRANSLIT: Record<string, string> = {
  'а':'a','б':'b','в':'v','г':'g','ґ':'g','д':'d','е':'e','є':'ye','ж':'zh',
  'з':'z','и':'y','і':'i','ї':'yi','й':'j','к':'k','л':'l','м':'m','н':'n',
  'о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c',
  'ч':'ch','ш':'sh','щ':'shch','ь':'','ю':'yu','я':'ya',' ':'-',
}

function ukrainianToSlug(text: string): string {
  return text.toLowerCase().split('').map(c => UA_TRANSLIT[c] ?? '').join('')
    .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

// Translate query to Ukrainian via LLM
async function translateToUkrainian(query: string): Promise<string> {
  try {
    const text = await callLLM(
      `Translate to Ukrainian (1-4 words, nominative case, no explanation): "${query}". Reply ONLY with Ukrainian. Examples: "driver"→"водій", "truck driver"→"водій вантажного автомобіля", "pharmacist"→"фармацевт"`,
      { timeoutMs: 8000, maxTokens: 30 },
    )
    return text.trim() || query
  } catch {
    return query
  }
}

function extractRoleFromTitle(title: string): string {
  // "Водій вантажного автомобіля, резюме від 29 березня 2026" → "Водій вантажного автомобіля"
  return title.replace(/,?\s*резюме від .*/i, '').trim()
}

// ─── PRIMARY: work.ua via plain HTTP — paginated until count reached ──────────
async function scrapeWorkUa(queryUk: string, location: string, count: number): Promise<ScrapedCandidate[]> {
  const cityId = CITY_MAP_WORK[location] || '1'
  const seen = new Set<string>()
  const results: ScrapedCandidate[] = []
  let page = 1

  while (results.length < count) {
    const url = `https://www.work.ua/resumes/?search=${encodeURIComponent(queryUk)}&city=${cityId}&page=${page}`
    console.log(`[work.ua] GET ${url}`)

    try {
      const { data: html } = await axios.get(url, {
        headers: BROWSER_HEADERS,
        timeout: 15000,
        httpsAgent,
      })

      const $ = cheerio.load(html)
      let addedThisPage = 0

      $('.resume-link').each((_, card) => {
        if (results.length >= count) return false

        const link = $(card).find('h2 a').first()
        const href = link.attr('href') || ''
        if (!/\/resumes\/\d+\/?$/.test(href)) return

        const title = link.text().trim()
        if (!title) return

        const profileUrl = `https://www.work.ua${href.replace(/\/$/, '')}/`
        if (seen.has(profileUrl)) return
        seen.add(profileUrl)

        const role = extractRoleFromTitle(title)

        let totalMonths = 0
        const expItems: string[] = []
        $(card).find('ul li').each((_, li) => {
          const liText = $(li).text().replace(/\u00a0/g, ' ').trim()
          const durMatch = liText.match(/(\d+)\s*(?:рік|роки|років)(?:[^\d]*(\d+)\s*місяц[ьів]+)?/)
          if (durMatch) {
            totalMonths += parseInt(durMatch[1]) * 12 + (durMatch[2] ? parseInt(durMatch[2]) : 0)
            expItems.push(liText.slice(0, 60))
          }
        })

        results.push({
          role,
          salary_text: '',
          salary_expectation: 0,
          location_text: location,
          experience_text: expItems.join(' | ').slice(0, 300),
          experience_years: Math.round(totalMonths / 12),
          profile_url: profileUrl,
          source_platform: 'work.ua',
          initials: generateInitials(),
          tags: [],
        })
        addedThisPage++
      })

      // No more pages if nothing new found or no next-page link
      const hasNextPage = $('a[href*="page=' + (page + 1) + '"]').length > 0
      if (addedThisPage === 0 || !hasNextPage) break

      page++
      await new Promise(r => setTimeout(r, 500))
    } catch (err: unknown) {
      console.error('[work.ua] HTTP error:', (err as Error).message)
      break
    }
  }

  console.log(`[work.ua] Found ${results.length} profiles across ${page} page(s), enriching...`)

  const enriched: ScrapedCandidate[] = []
  for (const c of results) {
    const rich = await enrichWorkUaProfile(c)
    enriched.push(rich)
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`[work.ua] Enrichment done`)
  return enriched
}

// ─── SECONDARY: Google CSE (requires billing — activates within hours) ────────
async function searchViaGoogle(queryUk: string, location: string, count: number, siteFilter: string, platform: string): Promise<ScrapedCandidate[]> {
  try {
    const { data } = await axios.get(GOOGLE_CSE_URL, {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_CSE_ID,
        q: `${queryUk} ${location}`,
        siteSearch: siteFilter,
        siteSearchFilter: 'i',
        num: Math.min(count, 10),
        hl: 'uk',
      },
      timeout: 12000,
    })

    if (!data.items) return []

    const results: ScrapedCandidate[] = []
    for (const item of data.items as { link: string; title: string; snippet?: string }[]) {
      const url = item.link
      const profilePattern: Record<string, RegExp> = {
        'work.ua':   /work\.ua\/resumes\/\d+/,
        'robota.ua': /robota\.ua\/candidates\/\d+/,
        'hh.ua':     /hh\.ua\/resume\/[a-zA-Z0-9_-]+/,
      }
      if (!profilePattern[platform]?.test(url)) continue

      const role = item.title
        .replace(/\s*[–\-|]\s*(Work\.ua|robota\.ua|hh\.ua).*/i, '')
        .replace(/^(Резюме|CV)[:\s]*/i, '').trim()

      results.push({
        role,
        salary_text: '',
        salary_expectation: 0,
        location_text: location,
        experience_text: (item.snippet || '').replace(/\n/g, ' ').trim(),
        experience_years: 0,
        profile_url: url,
        source_platform: platform,
        initials: generateInitials(),
        tags: [],
      })
    }

    console.log(`[${platform}] Google CSE found ${results.length} profiles`)
    return results
  } catch (err: unknown) {
    const status = (err as { response?: { status: number } }).response?.status
    if (status === 403) {
      console.log(`[${platform}] Google CSE billing not active yet — skipped`)
    } else {
      console.error(`[${platform}] Google CSE error:`, (err as Error).message)
    }
    return []
  }
}

// ─── Auto-qualify candidates after search ─────────────────────────────────────
async function autoQualifyCandidates(candidateIds: number[], jobId: number, db: ReturnType<typeof import('../db').getDb>): Promise<void> {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId) as Record<string, unknown> | null
  if (!job) return

  async function qualifyOne(id: number): Promise<void> {
    try {
      const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id) as Record<string, unknown> | undefined
      if (!candidate) return

      const profile = (() => { try { return candidate.profile_data ? JSON.parse(candidate.profile_data as string) : null } catch { return null } })()
      const expLine = [candidate.experience_years != null ? `${candidate.experience_years} ans` : null, candidate.experience_text].filter(Boolean).join(' — ') || 'Non précisée'

      const candidateLines = [
        `- Titre du profil : ${candidate.role || 'Non précisé'}`,
        `- Expérience : ${expLine}`,
        `- Localisation : ${candidate.location || 'Non précisée'}`,
        profile?.skills?.length    ? `- Compétences : ${(profile.skills as string[]).join(', ')}` : null,
        profile?.education         ? `- Formation : ${profile.education}` : null,
        candidate.cv_text          ? `- Extrait CV : ${String(candidate.cv_text).substring(0, 2000)}` : null,
      ].filter(Boolean).join('\n')

      const prompt = `Tu es un expert RH chez Farmasoft UA. Évalue ce candidat par rapport au poste et donne un score de 0 à 100.
RÈGLE CRITIQUE : tu DOIS toujours répondre avec le JSON demandé, même si les informations sont limitées. Fais une estimation basée sur ce qui est disponible.

POSTE RECHERCHÉ : ${job!.title ?? 'Non spécifié'}
Compétences requises : ${job!.skills ?? 'Non spécifiées'}
Expérience requise : ${job!.experience_years ?? 0} ans minimum
Description : ${job!.description ?? ''}
Exigences : ${job!.requirements ?? ''}

CANDIDAT :
${candidateLines}

Réponds UNIQUEMENT en JSON valide sans markdown : {"score": <entier 0-100>, "notes": "<2-3 points clés concis sur l'adéquation au poste>"}`

      const text = await callLLM(prompt, { jsonMode: true, timeoutMs: 30000, maxTokens: 200 })
      const parsed = JSON.parse(text) as { score: number; notes: string }
      if (typeof parsed.score !== 'number') return

      db.prepare('UPDATE candidates SET qualification_score = ?, qualification_notes = ? WHERE id = ?')
        .run(parsed.score, parsed.notes, id)

      console.log(`[qualify] Candidate ${id} scored ${parsed.score}/100`)
    } catch {
      console.error(`[qualify] Failed for candidate ${id}`)
    }
  }

  // Run in parallel batches of 5 to stay within Gemini rate limits
  const BATCH = 5
  for (let i = 0; i < candidateIds.length; i += BATCH) {
    await Promise.all(candidateIds.slice(i, i + BATCH).map(qualifyOne))
  }
}

// ─── Route handler ─────────────────────────────────────────────────────────────
router.post('/search', async (req: Request, res: Response) => {
  try {
    const db = getDb()
    const { query, location, count, platforms, jobId, salaryMin, salaryMax, experienceMin, skills } = req.body as {
      query: string
      location: string
      count: number
      platforms: string[]
      jobId?: number
      salaryMin?: number
      salaryMax?: number
      experienceMin?: number
      skills?: string
    }

    if (!query || !platforms || !Array.isArray(platforms)) {
      return res.json({ error: 'query et platforms sont requis' })
    }

    // If query already contains Cyrillic, skip translation
    const hasCyrillic = /[\u0400-\u04FF]/.test(query)
    const queryUk = hasCyrillic ? query : await translateToUkrainian(query)
    console.log(`[search] "${query}" → UA: "${queryUk}" (${hasCyrillic ? 'already UA' : 'translated'})`)
    // Use only the translated job title for the search (adding skills makes queries too specific → 0 results)
    const searchTerm = queryUk

    const perPlatform = Math.ceil(count / Math.max(platforms.length, 1))
    let allResults: ScrapedCandidate[] = []

    for (const platform of platforms) {
      let results: ScrapedCandidate[] = []

      if (platform === 'work.ua') {
        // Primary: plain HTTP scraping (always works)
        results = await scrapeWorkUa(searchTerm, location, perPlatform)
      } else if (platform === 'robota.ua') {
        // Google CSE (activates when billing propagates)
        results = await searchViaGoogle(searchTerm, location, perPlatform, 'robota.ua/candidates', 'robota.ua')
      } else if (platform === 'hh.ua') {
        results = await searchViaGoogle(searchTerm, location, perPlatform, 'hh.ua/resume', 'hh.ua')
      }

      allResults = [...allResults, ...results]
      await new Promise(r => setTimeout(r, 300))
    }

    // Salary filter
    if (salaryMin && salaryMin > 0)
      allResults = allResults.filter(c => c.salary_expectation === 0 || c.salary_expectation >= salaryMin)
    if (salaryMax && salaryMax > 0)
      allResults = allResults.filter(c => c.salary_expectation === 0 || c.salary_expectation <= salaryMax)

    const finalResults = allResults.slice(0, count)

    const insertedIds: number[] = []
    let toInsert = finalResults

    if (jobId && finalResults.length > 0) {
      // Dedup: skip candidates whose profile_url already exists for this job
      const existingUrls = new Set(
        (db.prepare('SELECT profile_url FROM candidates WHERE job_id = ? AND profile_url != ""').all(jobId) as { profile_url: string }[])
          .map(r => r.profile_url),
      )
      toInsert = finalResults.filter(c => !c.profile_url || !existingUrls.has(c.profile_url))

      if (toInsert.length > 0) {
        const stmt = db.prepare(`
          INSERT INTO candidates (job_id, initials, role, location, salary_expectation, experience_years, source_platform, profile_url, tags, status, experience_text, profile_data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)
        `)
        db.exec('BEGIN')
        try {
          for (const c of toInsert) {
            const result = stmt.run(jobId, c.initials, c.role, c.location_text, c.salary_expectation,
              c.experience_years || 0, c.source_platform, c.profile_url, JSON.stringify(c.tags), c.experience_text || null,
              c.profile_data ? JSON.stringify(c.profile_data) : null)
            insertedIds.push(result.lastInsertRowid as number)
          }
          db.exec('COMMIT')
        } catch { db.exec('ROLLBACK') }
      }
    }

    db.prepare(`INSERT INTO events (type, job_id, metadata) VALUES ('search_launched', ?, ?)`)
      .run(jobId || null, JSON.stringify({ jobId, platforms, count: finalResults.length, searchTerm, location }))

    res.json({
      data: toInsert.map((c, i) => ({
        ...c,
        location: c.location_text,
        experience_years: c.experience_years || 0,
        id: insertedIds[i] ?? (Date.now() + i),
        job_id: jobId || null,
        status: 'new',
        tags: JSON.stringify(c.tags),
        profile_data: null,
      })),
    })

    // Auto-qualify all inserted candidates in background (fire and forget)
    if (jobId && insertedIds.length > 0) {
      autoQualifyCandidates(insertedIds, jobId, db).catch(() => {})
    }
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

export default router
