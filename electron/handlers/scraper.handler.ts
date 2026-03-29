import { IpcMain } from 'electron'
import axios from 'axios'
import * as cheerio from 'cheerio'
import Database from 'better-sqlite3'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'uk-UA,uk;q=0.9,ru;q=0.8',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

const CITY_MAP_WORK: Record<string, string> = {
  'Kyiv': '1', 'Kharkiv': '2', 'Lviv': '3', 'Odesa': '4',
  'Dnipro': '7', 'Zaporizhzhia': '8', 'Vinnytsia': '10',
  'Poltava': '16', 'Cherkasy': '18', 'Zhytomyr': '24',
}

const CITY_MAP_ROBOTA: Record<string, number> = {
  'Kyiv': 1, 'Kharkiv': 2, 'Lviv': 4, 'Odesa': 7, 'Dnipro': 10,
  'Zaporizhzhia': 12, 'Vinnytsia': 14, 'Poltava': 20,
}

function generateInitials(): string {
  const first = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  const last = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  return `${first}.${last}.`
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function parseSalary(text: string): number {
  const nums = text.replace(/\s/g, '').match(/\d+/g)
  if (!nums) return 0
  return parseInt(nums[0], 10)
}

async function scrapeWorkUa(query: string, location: string, count: number) {
  const results: ScrapedCandidate[] = []
  const cityId = CITY_MAP_WORK[location] || '1'
  const slug = encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))
  const url = `https://www.work.ua/resumes-${slug}/?city=${cityId}&page=1`

  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 12000 })
    const $ = cheerio.load(data)

    $('[id^="resume"]').each((i, el) => {
      if (i >= count) return false
      const $el = $(el)
      const titleEl = $el.find('h2 a').first()
      const title = titleEl.text().trim()
      const href = titleEl.attr('href')
      const salary = $el.find('.salary').text().trim()
      const loc = $el.find('li:contains("місто"), .location').first().text().trim()
      const expText = $el.find('li').filter((_i, e) => $(e).text().includes('досвід')).first().text().trim()

      if (title && href) {
        results.push({
          role: title,
          salary_text: salary,
          salary_expectation: parseSalary(salary),
          location_text: loc || location,
          experience_text: expText,
          profile_url: `https://www.work.ua${href}`,
          source_platform: 'work.ua',
          initials: generateInitials(),
          tags: [],
        })
      }
    })
  } catch (err: unknown) {
    console.error('Work.ua scrape error:', (err as Error).message)
  }

  await sleep(1500)
  return results
}

async function scrapeRobotaUa(query: string, location: string, count: number) {
  const cityId = CITY_MAP_ROBOTA[location] || 1
  try {
    const { data } = await axios.get('https://api.robota.ua/cvdb/resumes', {
      headers: { ...HEADERS, 'Content-Type': 'application/json' },
      params: { keyWords: query, cityId, page: 0, period: 3 },
      timeout: 12000,
    })

    return ((data.documents || []) as Record<string, unknown>[]).slice(0, count).map(doc => ({
      role: (doc.speciality as string) || query,
      salary_text: doc.salary ? `${doc.salary} UAH` : 'Non précisé',
      salary_expectation: typeof doc.salary === 'number' ? doc.salary : 0,
      location_text: (doc.cityName as string) || location,
      experience_text: doc.experience ? `${doc.experience} ans` : '',
      profile_url: `https://robota.ua/candidates/cv/${doc.id}`,
      source_platform: 'robota.ua',
      initials: generateInitials(),
      tags: [],
    })) as ScrapedCandidate[]
  } catch (err: unknown) {
    console.error('Robota.ua scrape error:', (err as Error).message)
    return []
  }
}

async function scrapeDjinni(query: string, count: number) {
  const url = `https://djinni.co/jobs/?primary_keyword=${encodeURIComponent(query)}&employment=fulltime`
  const results: ScrapedCandidate[] = []
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 12000 })
    const $ = cheerio.load(data)

    $('.list-jobs__item, .job-list-item').each((i, el) => {
      if (i >= count) return false
      const $el = $(el)
      const title = $el.find('.job-list-item__title, h3 a').first().text().trim()
      const href = $el.find('a.job-list-item__link, h3 a').first().attr('href')
      const salary = $el.find('.public-salary-item').text().trim()
      const loc = $el.find('.location-text').text().trim()

      if (title) {
        results.push({
          role: title,
          salary_text: salary,
          salary_expectation: parseSalary(salary),
          location_text: loc || 'Remote Ukraine',
          experience_text: '',
          profile_url: href ? `https://djinni.co${href}` : 'https://djinni.co',
          source_platform: 'djinni.co',
          initials: generateInitials(),
          tags: [],
        })
      }
    })
  } catch (err: unknown) {
    console.error('Djinni scrape error:', (err as Error).message)
  }
  return results
}

async function scrapeHhUa(query: string, location: string, count: number) {
  const areaMap: Record<string, string> = {
    'Kyiv': '115', 'Kharkiv': '116', 'Lviv': '118', 'Odesa': '123', 'Dnipro': '120',
  }
  const area = areaMap[location] || '115'
  const url = `https://hh.ua/search/resume?text=${encodeURIComponent(query)}&area=${area}&page=0`
  const results: ScrapedCandidate[] = []
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 12000 })
    const $ = cheerio.load(data)

    $('[data-qa="resume-serp__resume"]').each((i, el) => {
      if (i >= count) return false
      const $el = $(el)
      const title = $el.find('[data-qa="resume-serp__resume-title"]').text().trim()
      const href = $el.find('a[data-qa="resume-serp__resume-title"]').attr('href')
      const salary = $el.find('[data-qa="resume-serp__resume-compensation"]').text().trim()
      const loc = $el.find('[data-qa="resume-serp__resume-location"]').text().trim()
      const exp = $el.find('[data-qa="resume-serp__resume-excpirience"]').text().trim()

      if (title) {
        results.push({
          role: title,
          salary_text: salary,
          salary_expectation: parseSalary(salary),
          location_text: loc || location,
          experience_text: exp,
          profile_url: href ? `https://hh.ua${href}` : 'https://hh.ua',
          source_platform: 'hh.ua',
          initials: generateInitials(),
          tags: [],
        })
      }
    })
  } catch (err: unknown) {
    console.error('HH.ua scrape error:', (err as Error).message)
  }
  await sleep(1500)
  return results
}

interface ScrapedCandidate {
  role: string
  salary_text: string
  salary_expectation: number
  location_text: string
  experience_text: string
  profile_url: string
  source_platform: string
  initials: string
  tags: string[]
}

interface SearchParams {
  query: string
  location: string
  count: number
  platforms: string[]
  jobId?: number
  salaryMin?: number
}

export function registerScraperHandlers(ipcMain: IpcMain) {
  ipcMain.handle('scraper:search', async (_event, params: SearchParams) => {
    const { query, location, count, platforms, jobId } = params
    const perPlatform = Math.ceil(count / Math.max(platforms.length, 1))
    let allResults: ScrapedCandidate[] = []
    const errors: string[] = []

    for (const platform of platforms) {
      try {
        let results: ScrapedCandidate[] = []
        if (platform === 'work.ua') results = await scrapeWorkUa(query, location, perPlatform)
        if (platform === 'robota.ua') results = await scrapeRobotaUa(query, location, perPlatform)
        if (platform === 'djinni.co') results = await scrapeDjinni(query, perPlatform)
        if (platform === 'hh.ua') results = await scrapeHhUa(query, location, perPlatform)
        allResults = [...allResults, ...results]
      } catch {
        errors.push(platform)
      }
      await sleep(800 + Math.random() * 700)
    }

    const finalResults = allResults.slice(0, count)

    // Save candidates to DB
    if (jobId) {
      try {
        // We need to save to DB — db ref not available here, return data for renderer to persist
      } catch { /* ignore */ }
    }

    return {
      data: finalResults.map((c, i) => ({ ...c, id: Date.now() + i, job_id: jobId || null, status: 'new', tags: JSON.stringify(c.tags) })),
      errors: errors.length ? errors : null,
    }
  })
}
