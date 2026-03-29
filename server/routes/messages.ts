import { Router, Request, Response } from 'express'
import { getDb } from '../db'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  try {
    const db = getDb()
    const { jobId } = req.query

    const messages = jobId
      ? db.prepare('SELECT * FROM messages WHERE job_id = ? ORDER BY created_at DESC').all(jobId)
      : db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all()

    res.json({ data: messages })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.post('/', (req: Request, res: Response) => {
  try {
    const db = getDb()
    const { job_id, name, subject, body, language, ai_generated } = req.body

    const result = db.prepare(`
      INSERT INTO messages (job_id, name, subject, body, language, ai_generated)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      job_id || null,
      name || null,
      subject || null,
      body || null,
      language || 'uk',
      ai_generated !== undefined ? (ai_generated ? 1 : 0) : 1,
    )

    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid)
    res.json({ data: message })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.put('/:id', (req: Request, res: Response) => {
  try {
    const db = getDb()
    const { id } = req.params
    const { name, subject, body, language } = req.body

    db.prepare(`
      UPDATE messages
      SET name = ?, subject = ?, body = ?, language = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name || null, subject || null, body || null, language || 'uk', id)

    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(id)
    res.json({ data: message })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const db = getDb()
    const { id } = req.params
    db.prepare('DELETE FROM messages WHERE id = ?').run(id)
    res.json({ data: { success: true } })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

export default router
