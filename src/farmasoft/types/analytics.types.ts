export interface KPIs {
  totalSearches: number
  weekSearches: number
  totalViewed: number
  todayViewed: number
  totalContacted: number
  contactRate: number
  activeJobs: number
  byJob: Array<{ title: string; count: number }>
}

export interface WeeklyActivity {
  week: string
  week_start: string
  count: number
}

export interface RecentEvent {
  id: number
  type: 'profile_viewed' | 'message_copied' | 'search_launched'
  candidate_id: number | null
  job_id: number | null
  metadata: string
  created_at: string
  initials: string | null
  role: string | null
  source_platform: string | null
  job_title: string | null
}

export type EventType = 'search_launched' | 'profile_viewed' | 'message_copied' | 'profile_opened' | 'job_created'
