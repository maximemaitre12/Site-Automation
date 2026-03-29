import { DatabaseSync } from 'node:sqlite'
import path from 'path'
import fs from 'fs'

const DATA_DIR = path.join(process.cwd(), 'data')
fs.mkdirSync(DATA_DIR, { recursive: true })
const DB_PATH = path.join(DATA_DIR, 'farmasoft.db')

let db: DatabaseSync

export function getDb(): DatabaseSync {
  if (db) return db
  db = new DatabaseSync(DB_PATH)
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')

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

  try { db.exec('ALTER TABLE candidates ADD COLUMN profile_data TEXT') } catch { /* already exists */ }
  try { db.exec('ALTER TABLE candidates ADD COLUMN experience_text TEXT') } catch { /* already exists */ }
  try { db.exec("ALTER TABLE candidates ADD COLUMN source_type TEXT DEFAULT 'scraped'") } catch { /* already exists */ }
  try { db.exec("ALTER TABLE candidates ADD COLUMN stage TEXT DEFAULT 'new'") } catch { /* already exists */ }
  try { db.exec('ALTER TABLE candidates ADD COLUMN qualification_score INTEGER') } catch { /* already exists */ }
  try { db.exec('ALTER TABLE candidates ADD COLUMN qualification_notes TEXT') } catch { /* already exists */ }
  try { db.exec('ALTER TABLE candidates ADD COLUMN cv_filename TEXT') } catch { /* already exists */ }
  try { db.exec('ALTER TABLE candidates ADD COLUMN cv_text TEXT') } catch { /* already exists */ }
  try { db.exec('ALTER TABLE candidates ADD COLUMN rejection_reason TEXT') } catch { /* already exists */ }
  try { db.exec("ALTER TABLE candidates ADD COLUMN decision TEXT DEFAULT 'pending'") } catch { /* already exists */ }

  db.exec(`
    CREATE TABLE IF NOT EXISTS interviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
      job_id INTEGER REFERENCES jobs(id),
      scheduled_at DATETIME NOT NULL,
      type TEXT DEFAULT 'phone',
      interviewer TEXT,
      notes TEXT,
      decision TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  return db
}
