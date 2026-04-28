import { Router, Request, Response } from 'express'
import axios from 'axios'
import { getDb } from '../db'
import { callLLM } from '../lib/llm'

const router = Router()

// Parse a CV (PDF or text) and create a candidate record
router.post('/parse', async (req: Request, res: Response) => {
  try {
    const { filename, content, mimeType, jobId } = req.body as {
      filename?: string
      content: string   // base64 for PDF, plain text for .txt
      mimeType: string  // 'application/pdf' | 'text/plain'
      jobId?: number
    }

    if (!content || !mimeType) return res.json({ error: 'content et mimeType requis' })

    const prompt = `Tu es un expert RH. Analyse ce CV et extrait les informations structurées.
Contexte : recrutement en Ukraine pour Farmasoft UA.

Réponds UNIQUEMENT en JSON valide sans markdown ni backticks :
{
  "role": "intitulé du poste principal du candidat",
  "location": "ville de résidence (Ukraine de préférence)",
  "experience_years": nombre entier d'années d'expérience totale,
  "experience_text": "résumé de l'expérience en 1 phrase courte",
  "salary_expectation": salaire attendu estimé en UAH (entier, 0 si non mentionné),
  "initials": "initiales du candidat en majuscules (ex: AB)",
  "tags": ["tag1", "tag2", "tag3"],
  "profile_data": {
    "skills": ["compétence1", "compétence2", "compétence3"],
    "education": "formation principale et établissement",
    "languages": ["Ukrainien", "Anglais", ...],
    "availability": "Immédiate / préavis X semaines / date",
    "summary": "résumé du profil en 2-3 phrases"
  }
}`

    if (mimeType === 'application/pdf') {
      return res.json({ error: 'PDF non supporté avec OpenAI — convertissez en .txt avant import (ou installez pdf-parse pour extraction automatique).' })
    }

    const fullPrompt = `${prompt}\n\nContenu du CV :\n${content}`
    const text = await callLLM(fullPrompt, { jsonMode: true, timeoutMs: 60000 })

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(text)
    } catch {
      return res.json({ error: 'Réponse IA invalide, réessayez.' })
    }

    const profileData = parsed.profile_data as Record<string, unknown> | undefined

    const db = getDb()
    const result = db.prepare(`
      INSERT INTO candidates (
        job_id, initials, role, location, experience_years, experience_text,
        salary_expectation, source_platform, profile_url, tags, profile_data,
        status, source_type, cv_filename, cv_text, stage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'cv_import', '', ?, ?, 'new', 'upload', ?, ?, 'new')
    `).run(
      jobId || null,
      (parsed.initials as string) || 'CV',
      (parsed.role as string) || 'Candidat',
      (parsed.location as string) || '',
      (parsed.experience_years as number) || 0,
      (parsed.experience_text as string) || '',
      (parsed.salary_expectation as number) || 0,
      JSON.stringify(parsed.tags || []),
      JSON.stringify(profileData || {}),
      filename || 'cv.pdf',
      mimeType === 'text/plain' ? content : null,
    )

    const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(result.lastInsertRowid)
    res.json({ data: candidate })

    // Trigger async AI qualification (non-blocking — response already sent)
    if (jobId) {
      const PORT = process.env.PORT || 3001
      const API_KEY = process.env.API_SECRET || ''
      const candidateId = result.lastInsertRowid
      axios.post(
        `http://localhost:${PORT}/api/candidates/${candidateId}/qualify`,
        {},
        { headers: { 'Content-Type': 'application/json', ...(API_KEY ? { 'x-api-key': API_KEY } : {}) } },
      ).catch(() => {})
    }
  } catch (err: unknown) {
    const msg = (err as Error).message
    if (msg.includes('JSON')) return res.json({ error: 'Réponse IA invalide. Réessayez.' })
    res.json({ error: `Erreur analyse CV : ${msg}` })
  }
})

export default router
