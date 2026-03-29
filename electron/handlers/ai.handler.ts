import { IpcMain } from 'electron'
import Anthropic from '@anthropic-ai/sdk'
import Database from 'better-sqlite3'

const FARMASOFT_CONTEXT = `
Tu travailles pour Farmasoft UA, entreprise ukrainienne spécialisée dans les logiciels
pour les secteurs pharmaceutique et agricole. L'entreprise est basée en Ukraine.
Les salaires sont en hryvnias ukrainiennes (UAH). Adapte toujours tes réponses
au contexte ukrainien : marché du travail local, plateformes Work.ua/Robota.ua,
culture professionnelle ukrainienne.
`

function getClient(db: Database.Database): Anthropic {
  const keyRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('anthropicApiKey') as { value: string } | undefined
  const apiKey = keyRow?.value || process.env.ANTHROPIC_API_KEY

  if (!apiKey) throw new Error('Clé API Anthropic non configurée. Allez dans Paramètres.')

  return new Anthropic({ apiKey })
}

export function registerAiHandlers(ipcMain: IpcMain, db: Database.Database) {
  ipcMain.handle('ai:generateJob', async (_event, title: string) => {
    try {
      const client = getClient(db)

      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: `${FARMASOFT_CONTEXT}

Génère une fiche de poste complète pour le poste : "${title}"

Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, avec cette structure exacte :
{
  "title": "titre exact du poste",
  "location": "ville ukrainienne la plus appropriée",
  "salary_min": nombre en UAH,
  "salary_max": nombre en UAH,
  "experience_years": nombre d'années minimum,
  "skills": ["compétence1", "compétence2", "compétence3", "compétence4", "compétence5"],
  "description": "description du poste en français (3-4 phrases concrètes)",
  "requirements": "exigences détaillées en français (liste à puces avec • )"
}

Salaires de référence marché Ukraine 2025 :
- Chauffeur PL/SPL : 22 000–35 000 UAH/mois
- Développeur junior : 30 000–50 000 UAH/mois
- Développeur senior : 60 000–120 000 UAH/mois
- Responsable RH : 28 000–45 000 UAH/mois
- Comptable : 20 000–35 000 UAH/mois
- Logisticien : 22 000–38 000 UAH/mois
- Technicien maintenance : 18 000–30 000 UAH/mois
- Commercial / Business Dev : 25 000–50 000 UAH/mois`,
        }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      const cleaned = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned)
      return { data: parsed }
    } catch (err: unknown) {
      const msg = (err as Error).message
      if (msg.includes('Clé API')) return { error: msg }
      if (msg.includes('JSON')) return { error: 'Réponse IA invalide. Réessayez.' }
      return { error: `Erreur IA : ${msg}` }
    }
  })

  ipcMain.handle('ai:generateMessage', async (
    _event,
    job: Record<string, unknown>,
    candidateRole: string,
    platform: string,
    language: string = 'uk'
  ) => {
    try {
      const client = getClient(db)

      const langInstruction = language === 'uk'
        ? 'Écris le message UNIQUEMENT en ukrainien (мова: українська). Utilise "Вітаю" pour saluer.'
        : language === 'fr'
          ? 'Écris le message en français. Commence par "Bonjour,".'
          : 'Write the message in English. Start with "Hello,".'

      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 700,
        messages: [{
          role: 'user',
          content: `${FARMASOFT_CONTEXT}

${langInstruction}

Rédige un message de contact professionnel et chaleureux pour un candidat sur ${platform}.

Poste recherché : ${job.title}
Profil du candidat : ${candidateRole}
Salaire proposé : ${job.salary_min}–${job.salary_max} UAH/mois
Localisation : ${job.location}

Le message doit :
- Être court (5-8 lignes max)
- Mentionner que c'est Farmasoft UA qui contacte
- Personnaliser selon le profil candidat
- Terminer par une invitation à un appel téléphonique cette semaine
- Être naturel, pas robotique

Réponds UNIQUEMENT avec le texte du message, rien d'autre.`,
        }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      return { data: text.trim() }
    } catch (err: unknown) {
      const msg = (err as Error).message
      if (msg.includes('Clé API')) return { error: msg }
      return { error: `Erreur IA : ${msg}` }
    }
  })
}
