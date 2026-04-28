import { Job } from '../../api/client'

export const EMPTY_JOB: Partial<Job> = {
  title: '', location: 'Kyiv', salary_min: 0, salary_max: 0,
  salary_currency: 'UAH', experience_years: 0, skills: '[]',
  description: '', requirements: '', is_active: 1,
}

export const PLATFORMS = ['work.ua', 'robota.ua', 'hh.ua']
export const CITIES = ['Kyiv', 'Kharkiv', 'Lviv', 'Odesa', 'Dnipro', 'Zaporizhzhia', 'Vinnytsia', 'Poltava', 'Remote']

export const PLATFORM_COLOR: Record<string, string> = {
  'work.ua': '#1a6b3c',
  'robota.ua': '#1a4a8a',
  'djinni.co': '#6b3a8a',
  'hh.ua': '#c0392b',
  'cv_import': '#6b4a1a',
}

export const STAGE_LABELS: Record<string, string> = {
  new: 'Nouveau',
  interview: 'Entretien',
  decision: 'Décision',
}
export const STAGES = ['new', 'interview', 'decision'] as const
export type Stage = typeof STAGES[number]

export const STAGE_COLORS: Record<Stage, string> = {
  new: 'var(--text-3)',
  interview: '#d97706',
  decision: '#16a34a',
}

export const INTERVIEW_TYPES = [
  { value: 'phone', label: 'Téléphone' },
  { value: 'video', label: 'Visio' },
  { value: 'on-site', label: 'Présentiel' },
]
