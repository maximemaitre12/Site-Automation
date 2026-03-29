import { Router, Request, Response } from 'express'
import { getDb } from '../db'

const router = Router()

router.get('/:key', (req: Request, res: Response) => {
  try {
    const db = getDb()
    const { key } = req.params
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined
    if (!row) return res.json({ error: 'Clé introuvable' })
    res.json({ data: row.value })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.put('/:key', (req: Request, res: Response) => {
  try {
    const db = getDb()
    const { key } = req.params
    const { value } = req.body
    if (value === undefined || value === null) return res.json({ error: 'La valeur est requise' })
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, String(value))
    res.json({ data: { key, value: String(value) } })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

export default router
