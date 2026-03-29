import { Job, JobInput } from './job.types'
import { Candidate, SearchParams } from './candidate.types'

interface ElectronAPI {
  // Jobs
  getJobs: () => Promise<{ data?: Job[]; error?: string }>
  createJob: (job: JobInput) => Promise<{ data?: Job; error?: string }>
  updateJob: (id: number, job: Partial<JobInput>) => Promise<{ data?: Job; error?: string }>
  deleteJob: (id: number) => Promise<{ data?: { success: boolean }; error?: string }>

  // Candidates
  getCandidates: (jobId?: number) => Promise<{ data?: Candidate[]; error?: string }>
  updateCandidateStatus: (id: number, status: string) => Promise<{ data?: { success: boolean }; error?: string }>

  // Messages
  getMessages: (jobId?: number) => Promise<{ data?: Message[]; error?: string }>
  createMessage: (msg: MessageInput) => Promise<{ data?: Message; error?: string }>
  updateMessage: (id: number, msg: Partial<MessageInput>) => Promise<{ data?: Message; error?: string }>
  deleteMessage: (id: number) => Promise<{ data?: { success: boolean }; error?: string }>

  // Settings
  getSetting: (key: string) => Promise<{ data?: string | null; error?: string }>
  setSetting: (key: string, value: string) => Promise<{ data?: { success: boolean }; error?: string }>

  // Scraping
  searchCandidates: (params: SearchParams) => Promise<{ data?: Candidate[]; errors?: string[] | null; error?: string }>

  // AI
  generateJobDescription: (title: string) => Promise<{ data?: JobInput; error?: string }>
  generateMessage: (job: Job, candidateRole: string, platform: string, language: string) => Promise<{ data?: string; error?: string }>

  // Analytics
  logEvent: (type: string, metadata: object) => Promise<{ data?: { success: boolean }; error?: string }>
  getKPIs: () => Promise<{ data?: import('./analytics.types').KPIs; error?: string }>
  getWeeklyActivity: () => Promise<{ data?: import('./analytics.types').WeeklyActivity[]; error?: string }>
  getRecentEvents: () => Promise<{ data?: import('./analytics.types').RecentEvent[]; error?: string }>

  // System
  openExternal: (url: string) => Promise<{ success: boolean; error?: string }>
}

interface Message {
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

interface MessageInput {
  job_id?: number
  name?: string
  subject?: string
  body?: string
  language?: string
  ai_generated?: number
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
