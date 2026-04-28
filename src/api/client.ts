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
    withCounts: () => req<(Job & { candidate_count: number })[]>('/jobs/with-counts'),
    get: (id: number) => req<Job>(`/jobs/${id}`),
    create: (job: Partial<Job>) => req<Job>('/jobs', { method: 'POST', ...body(job) }),
    update: (id: number, job: Partial<Job>) => req<Job>(`/jobs/${id}`, { method: 'PUT', ...body(job) }),
    remove: (id: number) => req<{ success: boolean }>(`/jobs/${id}`, { method: 'DELETE' }),
  },
  candidates: {
    list: (jobId?: number) => req<Candidate[]>(`/candidates${jobId ? `?jobId=${jobId}` : ''}`),
    get: (id: number) => req<Candidate>(`/candidates/${id}`),
    updateStatus: (id: number, status: string) =>
      req<Candidate>(`/candidates/${id}/status`, { method: 'PUT', ...body({ status }) }),
    updateStage: (id: number, stage: string) =>
      req<Candidate>(`/candidates/${id}/stage`, { method: 'PUT', ...body({ stage }) }),
    updateRejectionReason: (id: number, rejection_reason: string) =>
      req<Candidate>(`/candidates/${id}/rejection-reason`, { method: 'PUT', ...body({ rejection_reason }) }),
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
    searches: () => req<SearchHistory[]>('/analytics/searches'),
    candidateMessages: (candidateId: number) => req<CandidateMessageEvent[]>(`/analytics/candidate-messages/${candidateId}`),
    log: (type: string, metadata?: Record<string, unknown>) =>
      req<{ success: boolean }>('/analytics/log', { method: 'POST', ...body({ type, metadata }) }),
  },
  settings: {
    get: (key: string) => req<string>(`/settings/${key}`),
    set: (key: string, value: string) =>
      req<{ success: boolean }>(`/settings/${key}`, { method: 'PUT', ...body({ value }) }),
  },
  robota: {
    config: () => req<RobotaConfig>('/robota/config'),
    saveConfig: (cfg: { turbosms_token?: string; turbosms_sender?: string; calendly_url?: string; auto_outreach?: string; outreach_score_threshold?: number | string; followup_days?: number | string }) =>
      req<{ success: boolean }>('/robota/config', { method: 'POST', ...body(cfg) }),
    auth: (email: string, password: string) =>
      req<{ success: boolean }>('/robota/auth', { method: 'POST', ...body({ email, password }) }),
    disconnect: () =>
      req<{ success: boolean }>('/robota/disconnect', { method: 'POST' }),
    smtpConfig: (cfg: SmtpConfig) =>
      req<{ success: boolean }>('/robota/smtp-config', { method: 'POST', ...body(cfg) }),
    sync: (jobId: number, params: { robota_vacancy_id?: number; auto_qualify?: boolean }) =>
      req<{ imported: number; outreached: number }>(`/robota/sync/${jobId}`, { method: 'POST', ...body(params) }),
    outreach: (candidateId: number, isFollowUp?: boolean) =>
      req<{ smsSent: boolean; emailSent: boolean }>(`/robota/outreach/${candidateId}`, { method: 'POST', ...body({ is_follow_up: isFollowUp }) }),
    sendEmail: (candidateId: number, subject: string, emailBody: string) =>
      req<Candidate>(`/robota/send-email/${candidateId}`, { method: 'POST', ...body({ subject, body: emailBody }) }),
    publishVacancy: (jobId: number, params: { publish_type?: string; contact_email?: string; work_types?: string[]; employment_types?: string[] }) =>
      req<{ success: boolean; robota_vacancy_id: number }>(`/robota/publish-vacancy/${jobId}`, { method: 'POST', ...body(params) }),
    myVacancies: () => req<VacancyStatus[]>('/robota/my-vacancies'),
    vacancyState: (robotaVacancyId: number, state: string) =>
      req<{ success: boolean; state: string }>(`/robota/vacancy-state/${robotaVacancyId}`, { method: 'POST', ...body({ state }) }),
    updateVacancy: (jobId: number) =>
      req<{ success: boolean; robota_vacancy_id: number }>(`/robota/vacancy/${jobId}`, { method: 'PUT' }),
    deleteVacancy: (robotaVacancyId: number) =>
      req<{ success: boolean }>(`/robota/vacancy/${robotaVacancyId}`, { method: 'DELETE' }),
    employerVacancies: () => req<EmployerVacancy[]>('/robota/employer-vacancies'),
    fullSync: () => req<{ started: boolean }>('/robota/full-sync', { method: 'POST' }),
    fullSyncStatus: () => req<FullSyncProgress>('/robota/full-sync/status'),
    cvdbSearch: (params: { keywords: string; cityId?: number; salaryFrom?: number; salaryTo?: number; experienceId?: number; page?: number; count?: number; jobId?: number }) =>
      req<{ data: Candidate[]; total: number }>('/robota/cvdb/search', { method: 'POST', ...body(params) }),
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
  full_name: string | null
  photo_url: string | null
  birth_date: string | null
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
  stage: 'new' | 'interview' | 'decision'
  qualification_score: number | null
  qualification_notes: string | null
  cv_filename: string | null
  cv_text: string | null
  rejection_reason: string | null
  decision: 'pending' | 'hire' | 'reject' | null
  robota_apply_id: string | null
  email: string | null
  phone: string | null
  outreach_count: number
  viewed_at: string | null
  contacted_at: string | null
  created_at: string
}

export interface RobotaConfig {
  robota_configured: boolean
  smtp_configured: boolean
  turbosms_configured: boolean
  calendly_configured: boolean
  auto_outreach: boolean
  robota_email: string | null
  smtp_from: string | null
  calendly_url: string | null
  outreach_score_threshold: number
  followup_days: number
  last_auto_sync: string | null
}

export interface SmtpConfig {
  host?: string
  port?: string
  user?: string
  pass?: string
  from?: string
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

export interface SearchHistory {
  id: number
  job_id: number | null
  job_title: string | null
  location: string
  platforms: string
  candidates_found: number
  created_at: string
}

export interface VacancyStatus {
  id: number
  title: string
  location: string
  robota_vacancy_id: number
  robota_status: string | null
  robota_name?: string
  error?: string
}

export interface EmployerVacancy {
  id: number
  name: string
  state: string
  cityName?: string
  salaryRange?: { amountFrom?: number; amountTo?: number }
  linked: boolean
  farmasoft_job_id: number | null
  farmasoft_job_title: string | null
}

export interface FullSyncProgress {
  status: 'idle' | 'running' | 'done' | 'error'
  vacanciesTotal: number
  vacanciesDone: number
  candidatesImported: number
  candidatesOutreached: number
  currentVacancy: string
  startedAt: string | null
  finishedAt: string | null
  error?: string
}

export interface CandidateMessageEvent {
  id: number
  metadata: string
  created_at: string
}
