import Database from 'better-sqlite3'
import path from 'path'
import { app, IpcMain } from 'electron'

let db: Database.Database

export function initDatabase(): Database.Database {
  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'farmasoft-rh.db')

  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      location TEXT,
      salary_min INTEGER,
      salary_max INTEGER,
      salary_currency TEXT DEFAULT 'UAH',
      experience_years INTEGER,
      skills TEXT,
      description TEXT,
      requirements TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER REFERENCES jobs(id),
      initials TEXT,
      role TEXT,
      location TEXT,
      experience_years INTEGER,
      salary_expectation INTEGER,
      source_platform TEXT,
      profile_url TEXT,
      tags TEXT,
      status TEXT DEFAULT 'new',
      viewed_at DATETIME,
      contacted_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER REFERENCES jobs(id),
      location TEXT,
      radius_km INTEGER,
      salary_min INTEGER,
      platforms TEXT,
      candidates_found INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER REFERENCES jobs(id),
      name TEXT,
      subject TEXT,
      body TEXT,
      language TEXT DEFAULT 'uk',
      ai_generated INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      job_id INTEGER,
      candidate_id INTEGER,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `)

  return db
}

export function registerDbHandlers(ipcMain: IpcMain, database: Database.Database) {
  // --- JOBS ---
  ipcMain.handle('db:getJobs', () => {
    try {
      return { data: database.prepare('SELECT * FROM jobs ORDER BY created_at DESC').all() }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })

  ipcMain.handle('db:createJob', (_event, job: Record<string, unknown>) => {
    try {
      const stmt = database.prepare(`
        INSERT INTO jobs (title, location, salary_min, salary_max, salary_currency, experience_years, skills, description, requirements, is_active)
        VALUES (@title, @location, @salary_min, @salary_max, @salary_currency, @experience_years, @skills, @description, @requirements, @is_active)
      `)
      const result = stmt.run({
        title: job.title || '',
        location: job.location || 'Kyiv',
        salary_min: job.salary_min || 0,
        salary_max: job.salary_max || 0,
        salary_currency: job.salary_currency || 'UAH',
        experience_years: job.experience_years || 0,
        skills: Array.isArray(job.skills) ? JSON.stringify(job.skills) : (job.skills || '[]'),
        description: job.description || '',
        requirements: job.requirements || '',
        is_active: job.is_active !== undefined ? job.is_active : 1,
      })
      return { data: database.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid) }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })

  ipcMain.handle('db:updateJob', (_event, id: number, job: Record<string, unknown>) => {
    try {
      const fields: string[] = []
      const values: Record<string, unknown> = { id }
      const allowed = ['title', 'location', 'salary_min', 'salary_max', 'experience_years', 'skills', 'description', 'requirements', 'is_active']

      for (const key of allowed) {
        if (key in job) {
          fields.push(`${key} = @${key}`)
          values[key] = key === 'skills' && Array.isArray(job[key]) ? JSON.stringify(job[key]) : job[key]
        }
      }
      if (!fields.length) return { data: null }
      fields.push("updated_at = CURRENT_TIMESTAMP")

      database.prepare(`UPDATE jobs SET ${fields.join(', ')} WHERE id = @id`).run(values)
      return { data: database.prepare('SELECT * FROM jobs WHERE id = ?').get(id) }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })

  ipcMain.handle('db:deleteJob', (_event, id: number) => {
    try {
      database.prepare('UPDATE jobs SET is_active = 0 WHERE id = ?').run(id)
      return { data: { success: true } }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })

  // --- CANDIDATES ---
  ipcMain.handle('db:getCandidates', (_event, jobId?: number) => {
    try {
      const query = jobId
        ? 'SELECT * FROM candidates WHERE job_id = ? ORDER BY created_at DESC'
        : 'SELECT * FROM candidates ORDER BY created_at DESC'
      const rows = jobId
        ? database.prepare(query).all(jobId)
        : database.prepare(query).all()
      return { data: rows }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })

  ipcMain.handle('db:updateCandidateStatus', (_event, id: number, status: string) => {
    try {
      const validStatuses = ['new', 'viewed', 'contacted', 'rejected']
      if (!validStatuses.includes(status)) return { error: 'Statut invalide' }

      const extra = status === 'viewed' ? ', viewed_at = CURRENT_TIMESTAMP' : status === 'contacted' ? ', contacted_at = CURRENT_TIMESTAMP' : ''
      database.prepare(`UPDATE candidates SET status = ?${extra} WHERE id = ?`).run(status, id)
      return { data: { success: true } }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })

  // --- MESSAGES ---
  ipcMain.handle('db:getMessages', (_event, jobId?: number) => {
    try {
      const rows = jobId
        ? database.prepare('SELECT * FROM messages WHERE job_id = ? ORDER BY created_at DESC').all(jobId)
        : database.prepare('SELECT * FROM messages ORDER BY created_at DESC').all()
      return { data: rows }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })

  ipcMain.handle('db:createMessage', (_event, msg: Record<string, unknown>) => {
    try {
      const result = database.prepare(`
        INSERT INTO messages (job_id, name, subject, body, language, ai_generated)
        VALUES (@job_id, @name, @subject, @body, @language, @ai_generated)
      `).run({
        job_id: msg.job_id || null,
        name: msg.name || 'Message',
        subject: msg.subject || '',
        body: msg.body || '',
        language: msg.language || 'uk',
        ai_generated: msg.ai_generated !== undefined ? msg.ai_generated : 1,
      })
      return { data: database.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid) }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })

  ipcMain.handle('db:updateMessage', (_event, id: number, msg: Record<string, unknown>) => {
    try {
      const fields: string[] = []
      const values: Record<string, unknown> = { id }
      for (const key of ['name', 'subject', 'body', 'language']) {
        if (key in msg) { fields.push(`${key} = @${key}`); values[key] = msg[key] }
      }
      if (!fields.length) return { data: null }
      fields.push("updated_at = CURRENT_TIMESTAMP")
      database.prepare(`UPDATE messages SET ${fields.join(', ')} WHERE id = @id`).run(values)
      return { data: database.prepare('SELECT * FROM messages WHERE id = ?').get(id) }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })

  ipcMain.handle('db:deleteMessage', (_event, id: number) => {
    try {
      database.prepare('DELETE FROM messages WHERE id = ?').run(id)
      return { data: { success: true } }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })

  // --- SETTINGS ---
  ipcMain.handle('db:getSetting', (_event, key: string) => {
    try {
      const row = database.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined
      return { data: row?.value || null }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })

  ipcMain.handle('db:setSetting', (_event, key: string, value: string) => {
    try {
      database.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value)
      return { data: { success: true } }
    } catch (err: unknown) {
      return { error: (err as Error).message }
    }
  })
}
