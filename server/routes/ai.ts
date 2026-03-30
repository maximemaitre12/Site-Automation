import { Router, Request, Response } from 'express'
import axios from 'axios'

const router = Router()

const GEMINI_KEY = process.env.GEMINI_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`

const FARMASOFT_CONTEXT = `
Tu travailles pour Farmasoft UA, entreprise ukrainienne spécialisée dans les logiciels
pour les secteurs pharmaceutique et agricole. L'entreprise est basée en Ukraine.
Les salaires sont en hryvnias ukrainiennes (UAH). Adapte toujours tes réponses
au contexte ukrainien : marché du travail local, plateformes Work.ua/Robota.ua,
culture professionnelle ukrainienne.
`

async function callGemini(prompt: string): Promise<string> {
  const response = await axios.post(
    GEMINI_URL,
    { contents: [{ parts: [{ text: prompt }] }] },
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 },
  )
  return response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

router.post('/generate-job', async (req: Request, res: Response) => {
  try {
    const { title } = req.body
    if (!title) return res.json({ error: 'Le titre est requis' })

    const prompt = `${FARMASOFT_CONTEXT}

Génère une fiche de poste complète pour le poste : "${title}"

IMPORTANT : Tout le contenu (title, skills, description, requirements) doit être OBLIGATOIREMENT rédigé en ukrainien (мова: українська), quelle que soit la langue du titre fourni.

Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, avec cette structure exacte :
{
  "title": "назва посади українською",
  "location": "українське місто",
  "salary_min": nombre en UAH,
  "salary_max": nombre en UAH,
  "experience_years": nombre d'années minimum,
  "skills": ["навичка1", "навичка2", "навичка3", "навичка4", "навичка5"],
  "description": "опис посади українською (3-4 конкретні речення)",
  "requirements": "детальні вимоги українською (список з • )"
}

Salaires de référence marché Ukraine 2025 :
- Chauffeur PL/SPL : 22 000–35 000 UAH/mois
- Développeur junior : 30 000–50 000 UAH/mois
- Développeur senior : 60 000–120 000 UAH/mois
- Responsable RH : 28 000–45 000 UAH/mois
- Comptable : 20 000–35 000 UAH/mois
- Logisticien : 22 000–38 000 UAH/mois
- Technicien maintenance : 18 000–30 000 UAH/mois
- Commercial / Business Dev : 25 000–50 000 UAH/mois`

    const text = await callGemini(prompt)
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    res.json({ data: parsed })
  } catch (err: unknown) {
    const msg = (err as Error).message
    if (msg.includes('JSON')) return res.json({ error: 'Réponse IA invalide. Réessayez.' })
    res.json({ error: `Erreur IA : ${msg}` })
  }
})

router.post('/generate-message', async (req: Request, res: Response) => {
  try {
    const { job, candidate, language = 'uk' } = req.body as {
      job: Record<string, unknown>
      candidate: Record<string, unknown>
      language?: string
    }

    if (!job || !candidate) {
      return res.json({ error: 'job and candidate are required' })
    }

    const platform = (candidate.source_platform as string) || 'the platform'
    const candidateRole = (candidate.role as string) || ''
    const experienceYears = candidate.experience_years as number
    const candidateLocation = (candidate.location as string) || (job.location as string)

    let profileDetails = ''
    try {
      const profile = typeof candidate.profile_data === 'string'
        ? JSON.parse(candidate.profile_data as string)
        : candidate.profile_data
      if (profile?.skills?.length) {
        profileDetails += `\nKey skills: ${(profile.skills as string[]).slice(0, 4).join(', ')}`
      }
      if (profile?.languages?.length) {
        profileDetails += `\nLanguages: ${(profile.languages as string[]).join(', ')}`
      }
    } catch { /* ignore */ }

    const langInstruction = language === 'uk'
      ? 'Write the message ONLY in Ukrainian (мова: українська). Start with "Вітаю!".'
      : 'Write the message in English. Start with "Hello,".'

    const prompt = `You work for Farmasoft UA, a Ukrainian company specializing in software for pharmaceutical and agricultural sectors, based in Ukraine.

${langInstruction}

Write a short, warm, professional outreach message to a candidate found on ${platform}.

CANDIDATE INFORMATION:
- Role/profile: ${candidateRole}
- Experience: ${experienceYears > 0 ? `${experienceYears} years` : 'not specified'}
- Location: ${candidateLocation}${profileDetails}

JOB OFFER:
- Position: ${job.title}
- Location: ${job.location}
- Salary: ${job.salary_min}–${job.salary_max} UAH/month

STRICT RULES:
- NEVER use square brackets [] or angle brackets <> or any placeholder — write every detail directly
- Sign off as "Команда Farmasoft UA" — never leave the sender name blank
- Keep it under 8 lines
- Mention Farmasoft UA by name
- Reference the candidate's specific role/profile to show it's personalised
- End with an invitation for a short phone call this week
- Sound natural and human, not robotic

Reply with ONLY the message text, nothing else.`

    const text = await callGemini(prompt)
    res.json({ data: text.trim() })
  } catch (err: unknown) {
    res.json({ error: `AI error: ${(err as Error).message}` })
  }
})

export default router
