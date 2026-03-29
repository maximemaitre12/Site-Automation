import express from 'express'
import cors from 'cors'
import path from 'path'
import { getDb } from './db'
import jobsRouter from './routes/jobs'
import candidatesRouter from './routes/candidates'
import messagesRouter from './routes/messages'
import settingsRouter from './routes/settings'
import analyticsRouter from './routes/analytics'
import scraperRouter from './routes/scraper'
import aiRouter from './routes/ai'
import interviewsRouter from './routes/interviews'
import cvRouter from './routes/cv'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3001'] }))
app.use(express.json({ strict: false, limit: '50mb' }))
app.use((_req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  next()
})

app.use('/api/jobs', jobsRouter)
app.use('/api/candidates', candidatesRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/scraper', scraperRouter)
app.use('/api/ai', aiRouter)
app.use('/api/interviews', interviewsRouter)
app.use('/api/cv', cvRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist')))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'))
  })
}

const db = getDb()

// Purge candidates older than 6 months (data retention policy)
function purgeExpiredCandidates() {
  const result = db.prepare(
    `DELETE FROM candidates WHERE created_at < datetime('now', '-6 months')`
  ).run()
  if ((result.changes as number) > 0) {
    console.log(`[retention] ${result.changes} candidate(s) purged (> 6 months)`)
  }
}

purgeExpiredCandidates()
setInterval(purgeExpiredCandidates, 24 * 60 * 60 * 1000)

// Remove candidates saved with a search-page URL (contains '?') instead of an individual profile URL
const stale = db.prepare(
  `DELETE FROM candidates WHERE profile_url LIKE '%?%' OR (profile_url IS NOT NULL AND profile_url != '' AND profile_url NOT LIKE '%work.ua%' AND profile_url NOT LIKE '%robota.ua%' AND profile_url NOT LIKE '%hh.ua%' AND source_type = 'scraped')`
).run()
if ((stale.changes as number) > 0) {
  console.log(`[cleanup] ${stale.changes} candidate(s) with invalid profile URL removed`)
}

app.listen(PORT, () => {
  console.log(`Farmasoft RH server running on http://localhost:${PORT}`)
})
