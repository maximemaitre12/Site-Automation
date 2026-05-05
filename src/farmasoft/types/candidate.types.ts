export type CandidateStatus = 'new' | 'viewed' | 'contacted' | 'rejected'
export type SourcePlatform = 'work.ua' | 'robota.ua' | 'djinni.co' | 'hh.ua'

export interface Candidate {
  id: number
  job_id: number | null
  initials: string
  role: string
  location: string
  experience_years: number
  salary_expectation: number
  salary_text?: string
  source_platform: SourcePlatform
  profile_url: string
  tags: string | string[]
  status: CandidateStatus
  viewed_at: string | null
  contacted_at: string | null
  created_at: string
}

export interface SearchParams {
  query: string
  location: string
  count: number
  platforms: SourcePlatform[]
  jobId?: number
  salaryMin?: number
}

export function parseTags(candidate: Candidate): string[] {
  if (Array.isArray(candidate.tags)) return candidate.tags
  try {
    return JSON.parse(candidate.tags as string)
  } catch {
    return []
  }
}

export const PLATFORM_COLORS: Record<SourcePlatform, { bg: string; text: string; border: string }> = {
  'work.ua': { bg: '#1a3a1a', text: '#4ade80', border: '#22c55e' },
  'robota.ua': { bg: '#1a2a4a', text: '#60a5fa', border: '#3b82f6' },
  'djinni.co': { bg: '#2a1a3a', text: '#c084fc', border: '#a855f7' },
  'hh.ua': { bg: '#3a1a1a', text: '#fb923c', border: '#f97316' },
}

export const PLATFORM_LABELS: Record<SourcePlatform, string> = {
  'work.ua': 'Work.ua',
  'robota.ua': 'Robota.ua',
  'djinni.co': 'Djinni.co',
  'hh.ua': 'HH.ua',
}
