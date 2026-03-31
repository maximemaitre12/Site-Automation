import { Router, Request, Response } from 'express'
import { getDb } from '../db'

const router = Router()

const VALID_TYPES = ['search_launched', 'profile_viewed', 'message_copied', 'profile_opened', 'job_created']

router.post('/log', (req: Request, res: Response) => {
  try {
    const db = getDb()
    const { type, metadata } = req.body

    if (!VALID_TYPES.includes(type)) {
      return res.json({ error: 'Type événement invalide' })
    }

    const meta = (metadata as Record<string, unknown>) || {}
    db.prepare(`
      INSERT INTO events (type, job_id, candidate_id, metadata)
      VALUES (?, ?, ?, ?)
    `).run(
      type,
      meta.jobId || null,
      meta.candidateId || null,
      JSON.stringify(metadata),
    )

    res.json({ data: { success: true } })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.get('/kpis', (_req: Request, res: Response) => {
  try {
    const db = getDb()
    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const totalSearches = (db.prepare(`SELECT COUNT(*) as count FROM events WHERE type = 'search_launched'`).get() as { count: number }).count
    const weekSearches = (db.prepare(`SELECT COUNT(*) as count FROM events WHERE type = 'search_launched' AND created_at >= ?`).get(weekAgo) as { count: number }).count
    const totalViewed = (db.prepare(`SELECT COUNT(*) as count FROM candidates WHERE status != 'new'`).get() as { count: number }).count
    const todayViewed = (db.prepare(`SELECT COUNT(*) as count FROM candidates WHERE status != 'new' AND date(viewed_at) = ?`).get(today) as { count: number }).count
    const totalContacted = (db.prepare(`SELECT COUNT(*) as count FROM candidates WHERE status = 'contacted'`).get() as { count: number }).count
    const totalCandidates = (db.prepare(`SELECT COUNT(*) as count FROM candidates`).get() as { count: number }).count
    const contactRate = totalCandidates > 0 ? Math.round((totalContacted / totalCandidates) * 100) : 0
    const activeJobs = (db.prepare(`SELECT COUNT(*) as count FROM jobs WHERE is_active = 1`).get() as { count: number }).count

    const byJob = db.prepare(`
      SELECT j.title, COUNT(c.id) as count
      FROM jobs j
      LEFT JOIN candidates c ON c.job_id = j.id
      WHERE j.is_active = 1
      GROUP BY j.id, j.title
      ORDER BY count DESC
      LIMIT 6
    `).all()

    res.json({
      data: {
        totalSearches,
        weekSearches,
        totalViewed,
        todayViewed,
        totalContacted,
        contactRate,
        activeJobs,
        byJob,
      }
    })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.get('/weekly', (_req: Request, res: Response) => {
  try {
    const db = getDb()
    const rows = db.prepare(`
      SELECT
        strftime('%W-%Y', created_at) as week,
        strftime('%d/%m', MIN(created_at)) as week_start,
        COUNT(*) as count
      FROM events
      WHERE type = 'profile_viewed'
        AND created_at >= datetime('now', '-56 days')
      GROUP BY week
      ORDER BY week ASC
    `).all()
    res.json({ data: rows })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.get('/recent', (_req: Request, res: Response) => {
  try {
    const db = getDb()
    const rows = db.prepare(`
      SELECT
        e.id,
        e.type,
        e.candidate_id,
        e.job_id,
        e.metadata,
        e.created_at,
        c.initials,
        c.role,
        c.source_platform,
        j.title as job_title
      FROM events e
      LEFT JOIN candidates c ON e.candidate_id = c.id
      LEFT JOIN jobs j ON e.job_id = j.id
      WHERE e.type IN ('profile_viewed', 'message_copied', 'search_launched')
      ORDER BY e.created_at DESC
      LIMIT 15
    `).all()
    res.json({ data: rows })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.get('/searches', (_req: Request, res: Response) => {
  try {
    const db = getDb()
    // Scraper writes to events table (type='search_launched'), not searches table
    const rows = db.prepare(`
      SELECT e.id, e.job_id, e.metadata, e.created_at, j.title as job_title
      FROM events e
      LEFT JOIN jobs j ON j.id = e.job_id
      WHERE e.type = 'search_launched'
      ORDER BY e.created_at DESC
      LIMIT 20
    `).all() as { id: number; job_id: number|null; metadata: string; created_at: string; job_title: string|null }[]

    const mapped = rows.map(r => {
      let meta: Record<string, unknown> = {}
      try { meta = JSON.parse(r.metadata) } catch { /* ignore */ }
      return {
        id: r.id,
        job_id: r.job_id,
        job_title: r.job_title,
        location: (meta.location as string) || '',
        platforms: Array.isArray(meta.platforms) ? meta.platforms : [meta.platforms].filter(Boolean),
        candidates_found: (meta.count as number) || 0,
        created_at: r.created_at,
      }
    })
    res.json({ data: mapped })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

router.get('/candidate-messages/:candidateId', (req: Request, res: Response) => {
  try {
    const db = getDb()
    const rows = db.prepare(`
      SELECT id, metadata, created_at
      FROM events
      WHERE type = 'message_copied' AND candidate_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `).all(req.params.candidateId)
    res.json({ data: rows })
  } catch (err: unknown) {
    res.json({ error: (err as Error).message })
  }
})

export default router
