const BASE = '/api'
const API_KEY = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_SECRET

async function req<T>(url: string, options?: RequestInit): Promise<{ data?: T; error?: string }> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (API_KEY) headers['x-api-key'] = API_KEY
    const res = await fetch(`${BASE}${url}`, {
      headers,
      ...options,
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error || `HTTP ${res.status}` }
    return json
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const body = (data: any) => ({ body: JSON.stringify(data) })

export const api = {
  jobs: {
    list: () => req<Job[]>('/jobs'),
    create: (job: Partial<Job>) => req<Job>('/jobs', { method: 'POST', ...body(job) }),
    update: (id: number, job: Partial<Job>) => req<Job>(`/jobs/${id}`, { method: 'PUT', ...body(job) }),
    remove: (id: number) => req<{ success: boolean }>(`/jobs/${id}`, { method: 'DELETE' }),
  },
  candidates: {
    list: (jobId?: number) => req<Candidate[]>(`/candidates${jobId ? `?jobId=${jobId}` : ''}`),
    updateStatus: (id: number, status: string) =>
      req<Candidate>(`/candidates/${id}/status`, { method: 'PUT', ...body({ status }) }),
    updateStage: (id: number, stage: string) =>
      req<Candidate>(`/candidates/${id}/stage`, { method: 'PUT', ...body({ stage }) }),
    qualify: (id: number) =>
      req<Candidate>(`/candidates/${id}/qualify`, { method: 'POST' }),
    remove: (id: number) => req<{ success: boolean }>(`/candidates/${id}`, { method: 'DELETE' }),
  },
  interviews: {
    list: (jobId?: number) => req<Interview[]>(`/interviews${jobId ? `?jobId=${jobId}` : ''}`),
    create: (interview: Partial<Interview>) => req<Interview>('/interviews', { method: 'POST', ...body(interview) }),
    update: (id: number, interview: Partial<Interview>) =>
      req<Interview>(`/interviews/${id}`, { method: 'PUT', ...body(interview) }),
    remove: (id: number) => req<{ success: boolean }>(`/interviews/${id}`, { method: 'DELETE' }),
  },
  messages: {
    list: (jobId?: number) => req<Message[]>(`/messages${jobId ? `?jobId=${jobId}` : ''}`),
    create: (msg: Partial<Message>) => req<Message>('/messages', { method: 'POST', ...body(msg) }),
    update: (id: number, msg: Partial<Message>) => req<Message>(`/messages/${id}`, { method: 'PUT', ...body(msg) }),
    remove: (id: number) => req<{ success: boolean }>(`/messages/${id}`, { method: 'DELETE' }),
  },
  cv: {
    parse: (filename: string, content: string, mimeType: string, jobId?: number) =>
      req<Candidate>('/cv/parse', { method: 'POST', ...body({ filename, content, mimeType, jobId }) }),
  },
  scraper: {
    search: (params: SearchParams) =>
      req<Candidate[]>('/scraper/search', { method: 'POST', ...body(params) }),
  },
  ai: {
    generateJob: (title: string) =>
      req<Partial<Job>>('/ai/generate-job', { method: 'POST', ...body({ title }) }),
    generateMessage: (job: Partial<Job>, candidate: Candidate, language: string) =>
      req<string>('/ai/generate-message', { method: 'POST', ...body({ job, candidate, language }) }),
  },
  analytics: {
    kpis: () => req<KPIs>('/analytics/kpis'),
    weekly: () => req<WeeklyData[]>('/analytics/weekly'),
    recent: () => req<RecentEvent[]>('/analytics/recent'),
    log: (type: string, metadata?: Record<string, unknown>) =>
      req<{ success: boolean }>('/analytics/log', { method: 'POST', ...body({ type, metadata }) }),
  },
  settings: {
    get: (key: string) => req<string>(`/settings/${key}`),
    set: (key: string, value: string) =>
      req<{ success: boolean }>(`/settings/${key}`, { method: 'PUT', ...body({ value }) }),
  },
}

// Shared types
export interface Job {
  id: number
  title: string
  location: string
  salary_min: number
  salary_max: number
  salary_currency: string
  experience_years: number
  skills: string
  description: string
  requirements: string
  is_active: number
  created_at: string
  updated_at: string
}

export interface Candidate {
  id: number
  job_id: number | null
  initials: string
  role: string
  location: string
  experience_years: number
  experience_text: string
  salary_expectation: number
  source_platform: string
  profile_url: string
  tags: string
  profile_data: string | null
  status: 'new' | 'viewed' | 'contacted' | 'rejected'
  source_type: 'scraped' | 'upload'
  stage: 'new' | 'prequalification' | 'interview' | 'decision'
  qualification_score: number | null
  qualification_notes: string | null
  cv_filename: string | null
  cv_text: string | null
  rejection_reason: string | null
  decision: 'pending' | 'hire' | 'reject' | null
  viewed_at: string | null
  contacted_at: string | null
  created_at: string
}

export interface Interview {
  id: number
  candidate_id: number
  job_id: number | null
  scheduled_at: string
  type: 'phone' | 'video' | 'on-site'
  interviewer: string
  notes: string
  decision: 'pending' | 'hire' | 'reject'
  created_at: string
  updated_at: string
  // Joined fields
  initials?: string
  role?: string
  source_platform?: string
  job_title?: string
}

export interface Message {
  id: number
  job_id: number | null
  name: string
  subject: string
  body: string
  language: string
  ai_generated: number
  created_at: string
  updated_at: string
}

export interface SearchParams {
  query: string
  location: string
  count: number
  platforms: string[]
  jobId?: number
  salaryMin?: number
  salaryMax?: number
  experienceMin?: number
  skills?: string
}

export interface KPIs {
  totalSearches: number
  weekSearches: number
  totalViewed: number
  todayViewed: number
  totalContacted: number
  contactRate: number
  activeJobs: number
  byJob: { title: string; count: number }[]
}

export interface WeeklyData {
  week: string
  week_start: string
  count: number
}

export interface RecentEvent {
  id: number
  type: string
  candidate_id: number | null
  job_id: number | null
  metadata: string
  created_at: string
  initials: string | null
  role: string | null
  source_platform: string | null
  job_title: string | null
}
