import { Router, Request, Response } from 'express'
import { getDb } from '../db'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  try {
    const db = getDb()
    const jobs = db.prepare('SELECT * FROM jobs WHERE is_active = 1 ORDER BY created_at DESC').all()
    res.json({ data: jobs })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.get('/with-counts', (_req: Request, res: Response) => {
  try {
    const db = getDb()
    const jobs = db.prepare(`
      SELECT j.*, COUNT(c.id) as candidate_count
      FROM jobs j
      LEFT JOIN candidates c ON c.job_id = j.id
      WHERE j.is_active = 1
      GROUP BY j.id
      ORDER BY j.created_at DESC
    `).all()
    res.json({ data: jobs })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.post('/', (req: Request, res: Response) => {
  try {
    const db = getDb()
    const { title, location, salary_min, salary_max, salary_currency, experience_years, skills, description, requirements } = req.body
    if (!title) return res.json({ error: 'Le titre est requis' })

    const result = db.prepare(`
      INSERT INTO jobs (title, location, salary_min, salary_max, salary_currency, experience_years, skills, description, requirements)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      location || null,
      salary_min || null,
      salary_max || null,
      salary_currency || 'UAH',
      experience_years || null,
      typeof skills === 'object' ? JSON.stringify(skills) : (skills || null),
      description || null,
      requirements || null,
    )

    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid)
    res.json({ data: job })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.put('/:id', (req: Request, res: Response) => {
  try {
    const db = getDb()
    const { id } = req.params
    const { title, location, salary_min, salary_max, salary_currency, experience_years, skills, description, requirements } = req.body

    db.prepare(`
      UPDATE jobs
      SET title = ?, location = ?, salary_min = ?, salary_max = ?, salary_currency = ?,
          experience_years = ?, skills = ?, description = ?, requirements = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND is_active = 1
    `).run(
      title,
      location || null,
      salary_min || null,
      salary_max || null,
      salary_currency || 'UAH',
      experience_years || null,
      typeof skills === 'object' ? JSON.stringify(skills) : (skills || null),
      description || null,
      requirements || null,
      id,
    )

    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id)
    res.json({ data: job })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const db = getDb()
    const { id } = req.params
    db.prepare('UPDATE jobs SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id)
    res.json({ data: { success: true } })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

export default router
