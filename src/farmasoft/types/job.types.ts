export interface Job {
  id: number
  title: string
  location: string
  salary_min: number
  salary_max: number
  salary_currency: string
  experience_years: number
  skills: string[] | string
  description: string
  requirements: string
  is_active: number
  created_at: string
  updated_at: string
}

export interface JobInput {
  title: string
  location?: string
  salary_min?: number
  salary_max?: number
  salary_currency?: string
  experience_years?: number
  skills?: string[] | string
  description?: string
  requirements?: string
  is_active?: number
}

export function parseJobSkills(job: Job): string[] {
  if (Array.isArray(job.skills)) return job.skills
  try {
    return JSON.parse(job.skills as string)
  } catch {
    return []
  }
}
