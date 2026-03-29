import { useEffect, useRef, useState } from 'react'
import { api, Job, Candidate, Interview } from '../api/client'
import { useAppStore } from '../store/useAppStore'
import { T } from '../i18n'

// ─── Constants ───────────────────────────────────────────────────────────────

const EMPTY_JOB: Partial<Job> = {
  title: '', location: 'Kyiv', salary_min: 0, salary_max: 0,
  salary_currency: 'UAH', experience_years: 0, skills: '[]',
  description: '', requirements: '', is_active: 1,
}

const PLATFORMS = ['work.ua', 'robota.ua', 'hh.ua']
const CITIES = ['Kyiv', 'Kharkiv', 'Lviv', 'Odesa', 'Dnipro', 'Zaporizhzhia', 'Vinnytsia', 'Poltava', 'Remote']

const PLATFORM_COLOR: Record<string, string> = {
  'work.ua': '#1a6b3c',
  'robota.ua': '#1a4a8a',
  'djinni.co': '#6b3a8a',
  'hh.ua': '#c0392b',
  'cv_import': '#6b4a1a',
}

const STAGE_LABELS: Record<string, string> = {
  new: 'Nouveau',
  prequalification: 'Préqualification',
  interview: 'Entretien',
  decision: 'Décision',
}
const STAGES = ['new', 'prequalification', 'interview', 'decision'] as const
type Stage = typeof STAGES[number]

const STAGE_COLORS: Record<Stage, string> = {
  new: 'var(--text-3)',
  prequalification: '#2563eb',
  interview: '#d97706',
  decision: '#16a34a',
}

const INTERVIEW_TYPES = [
  { value: 'phone', label: 'Téléphone' },
  { value: 'video', label: 'Visio' },
  { value: 'on-site', label: 'Présentiel' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseProfile(raw: string | null) {
  try { return raw ? JSON.parse(raw) : null } catch { return null }
}

function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : raw.split(',').map(s => s.trim()).filter(Boolean)
  } catch {
    return raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : []
  }
}

const iconTrash = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,4 14,4" /><path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
    <path d="M3 4l1 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-9" />
  </svg>
)
const iconChevronRight = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,4 10,8 6,12" />
  </svg>
)
const iconChevronLeft = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="10,4 6,8 10,12" />
  </svg>
)
const iconStar = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" stroke="none">
    <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4L8 10.1 4.4 12l.7-4L2.2 5.2l4-.6z" />
  </svg>
)
const iconUpload = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)
const iconClose = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="3" x2="13" y2="13" /><line x1="13" y1="3" x2="3" y2="13" />
  </svg>
)
const iconSparkle = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" stroke="none">
    <path d="M8 0l1.2 5.4L14 8l-4.8 2.6L8 16l-1.2-5.4L2 8l4.8-2.6z" />
  </svg>
)
const iconCalendar = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="12" height="11" rx="1.5" />
    <line x1="5" y1="1.5" x2="5" y2="4.5" />
    <line x1="11" y1="1.5" x2="11" y2="4.5" />
    <line x1="2" y1="7" x2="14" y2="7" />
  </svg>
)

// ─── Job Form ─────────────────────────────────────────────────────────────────

function JobForm({ initial, onSave, onClose }: {
  initial: Partial<Job>
  onSave: (job: Job) => void
  onClose: () => void
}) {
  const { uiLang } = useAppStore()
  const tf = T[uiLang].jobs.form
  const [form, setForm] = useState<Partial<Job>>(initial)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = Boolean((initial as Job).id)

  function set(key: keyof Job, value: unknown) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function generate() {
    if (!form.title) return
    setGenerating(true); setError('')
    const res = await api.ai.generateJob(form.title)
    if (res.error) { setError(res.error); setGenerating(false); return }
    if (res.data) {
      setForm(f => ({
        ...f,
        ...res.data,
        skills: Array.isArray(res.data!.skills) ? JSON.stringify(res.data!.skills) : (res.data!.skills ?? f.skills),
      }))
    }
    setGenerating(false)
  }

  async function save() {
    if (!form.title) { setError(tf.titleRequired); return }
    setSaving(true); setError('')
    const res = isEdit
      ? await api.jobs.update((initial as Job).id, form)
      : await api.jobs.create(form)
    if (res.error) { setError(res.error); setSaving(false); return }
    if (res.data) onSave(res.data)
  }

  const skillsArr = (() => {
    try { return Array.isArray(JSON.parse(form.skills || '[]')) ? JSON.parse(form.skills || '[]') as string[] : [] } catch { return [] }
  })()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 640, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-24">
          <h2 className="modal-title">{isEdit ? tf.editTitle : tf.newTitle}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}>{iconClose}</button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">{tf.jobTitle}</label>
            <input className="form-input" value={form.title || ''} onChange={e => set('title', e.target.value)} placeholder={tf.jobTitlePlaceholder} />
          </div>
          <div style={{ marginTop: 22 }}>
            <button className="btn" onClick={generate} disabled={generating || !form.title} style={{ whiteSpace: 'nowrap' }}>
              {generating ? <span className="spinner" /> : iconSparkle}
              {generating ? tf.generating : tf.generateAI}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label className="form-label">{tf.city}</label>
            <select className="form-input" value={form.location || ''} onChange={e => set('location', e.target.value)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">{tf.experience}</label>
            <input className="form-input" type="number" min={0} value={form.experience_years ?? 0} onChange={e => set('experience_years', +e.target.value)} />
          </div>
          <div>
            <label className="form-label">{tf.salaryMin}</label>
            <input className="form-input" type="number" min={0} value={form.salary_min ?? 0} onChange={e => set('salary_min', +e.target.value)} />
          </div>
          <div>
            <label className="form-label">{tf.salaryMax}</label>
            <input className="form-input" type="number" min={0} value={form.salary_max ?? 0} onChange={e => set('salary_max', +e.target.value)} />
          </div>
        </div>

        {skillsArr.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">{tf.skills}</label>
            <div className="flex flex-wrap gap-6">
              {skillsArr.map((s, i) => <span key={i} className="chip">{s}</span>)}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label className="form-label">{tf.description}</label>
          <textarea className="form-input" rows={3} value={form.description || ''} onChange={e => set('description', e.target.value)} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label className="form-label">{tf.requirements}</label>
          <textarea className="form-input" rows={3} value={form.requirements || ''} onChange={e => set('requirements', e.target.value)} />
        </div>

        {error && <p style={{ color: 'var(--err)', fontSize: 12, marginBottom: 12 }}>{error}</p>}
        <div className="flex gap-10 justify-end">
          <button className="btn btn-ghost" onClick={onClose}>{tf.cancel}</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? <span className="spinner" /> : null}
            {saving ? tf.saving : isEdit ? tf.save : tf.create}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Schedule Interview Modal ─────────────────────────────────────────────────

function ScheduleModal({ candidate, job, onSave, onClose }: {
  candidate: Candidate
  job: Job
  onSave: (interview: Interview) => void
  onClose: () => void
}) {
  const { uiLang } = useAppStore()
  const ts = T[uiLang].jobs.schedule
  const ti = T[uiLang].interviewTypes
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().slice(0, 16)

  const [form, setForm] = useState({ scheduled_at: defaultDate, type: 'phone', interviewer: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setSaving(true); setError('')
    const res = await api.interviews.create({
      candidate_id: candidate.id,
      job_id: job.id,
      scheduled_at: form.scheduled_at,
      type: form.type as Interview['type'],
      interviewer: form.interviewer,
      notes: form.notes,
    })
    if (res.error) { setError(res.error); setSaving(false); return }
    if (res.data) onSave(res.data)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 480 }}>
        <div className="flex items-center justify-between mb-24">
          <h2 className="modal-title">{ts.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}>{iconClose}</button>
        </div>
        <div style={{ marginBottom: 8, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 12 }}>
          <div className="t-13 medium">{candidate.role}</div>
          <div className="t-11 c-2">{candidate.location} · {ts.expYears(candidate.experience_years)}</div>
        </div>
        <div style={{ height: 16 }} />

        <div style={{ marginBottom: 14 }}>
          <label className="form-label">{ts.dateTime}</label>
          <input className="form-input" type="datetime-local" value={form.scheduled_at}
            onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">{ts.type}</label>
          <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            {INTERVIEW_TYPES.map(it => <option key={it.value} value={it.value}>{ti[it.value as keyof typeof ti] || it.label}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">{ts.interviewer}</label>
          <input className="form-input" value={form.interviewer} placeholder={ts.interviewerPlaceholder}
            onChange={e => setForm(f => ({ ...f, interviewer: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label className="form-label">{ts.notes}</label>
          <textarea className="form-input" rows={2} value={form.notes} placeholder={ts.notesPlaceholder}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>

        {error && <p style={{ color: 'var(--err)', fontSize: 12, marginBottom: 12 }}>{error}</p>}
        <div className="flex gap-10 justify-end">
          <button className="btn btn-ghost" onClick={onClose}>{ts.cancel}</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? <span className="spinner" /> : iconCalendar}
            {saving ? ts.saving : ts.schedule}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Candidate Detail Modal ───────────────────────────────────────────────────

function CandidateModal({ candidate: initial, job, onClose, onUpdate, onDelete }: {
  candidate: Candidate
  job: Job
  onClose: () => void
  onUpdate: (c: Candidate) => void
  onDelete: (id: number) => void
}) {
  const { uiLang } = useAppStore()
  const tm = T[uiLang].jobs.modal
  const [candidate, setCandidate] = useState(initial)
  const [tab, setTab] = useState<'profile' | 'message' | 'interview'>('profile')
  const [qualifying, setQualifying] = useState(false)
  const [qualError, setQualError] = useState('')
  const [message, setMessage] = useState('')
  const [generating, setGenerating] = useState(false)
  const [msgLang, setMsgLang] = useState('uk')
  const [copied, setCopied] = useState(false)
  const [genError, setGenError] = useState('')
  const [showSchedule, setShowSchedule] = useState(false)
  const [interviews, setInterviews] = useState<Interview[]>([])

  useEffect(() => {
    if (tab === 'interview') {
      api.interviews.list(job.id).then(r => {
        if (r.data) setInterviews(r.data.filter(i => i.candidate_id === candidate.id))
      })
    }
  }, [tab, candidate.id, job.id])

  const profile = parseProfile(candidate.profile_data)

  async function qualify() {
    setQualifying(true); setQualError('')
    const res = await api.candidates.qualify(candidate.id)
    if (res.error) { setQualError(res.error); setQualifying(false); return }
    if (res.data) { setCandidate(res.data); onUpdate(res.data) }
    setQualifying(false)
  }

  async function generateMessage() {
    setGenerating(true); setGenError('')
    const res = await api.ai.generateMessage(job, candidate, msgLang)
    if (res.error) { setGenError(res.error); setGenerating(false); return }
    if (res.data) {
      setMessage(res.data)
      api.candidates.updateStatus(candidate.id, 'viewed')
    }
    setGenerating(false)
  }

  async function copyMessage() {
    await navigator.clipboard.writeText(message)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    const r = await api.candidates.updateStatus(candidate.id, 'contacted')
    if (r.data) { setCandidate(r.data); onUpdate(r.data) }
    api.analytics.log('message_copied', { candidateId: candidate.id, jobId: candidate.job_id })
  }

  const scoreColor = candidate.qualification_score == null ? 'var(--text-3)'
    : candidate.qualification_score >= 70 ? 'var(--ok)'
    : candidate.qualification_score >= 40 ? '#d97706'
    : 'var(--err)'

  const platformColor = PLATFORM_COLOR[candidate.source_platform] || 'var(--text-3)'
  const tags = parseTags(candidate.tags || '[]')

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}
          style={{ width: 680, padding: 0, overflow: 'hidden', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div style={{ padding: '20px 24px 0', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div className="flex items-center gap-14">
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 600, color: 'var(--text-1)', flexShrink: 0,
                }}>
                  {candidate.initials || '?'}
                </div>
                <div>
                  <div className="t-15 medium">{candidate.role}</div>
                  <div className="t-11 c-2 mt-4">{candidate.location}{candidate.experience_years > 0 ? ` · ${tm.years(candidate.experience_years)}` : ''}</div>
                </div>
              </div>
              <div className="flex gap-8 items-center">
                {candidate.qualification_score != null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: scoreColor, fontWeight: 600, fontSize: 13 }}>
                    {iconStar} {candidate.qualification_score}/100
                  </div>
                )}
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                  background: platformColor + '22', color: platformColor,
                }}>
                  {candidate.source_platform === 'cv_import' ? 'CV' : candidate.source_platform}
                </span>
                <button onClick={() => { onDelete(candidate.id); onClose() }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--err)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                  {iconTrash}
                </button>
                <button onClick={onClose}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}>
                  {iconClose}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: -1 }}>
              {(['profile', 'message'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px',
                  fontSize: 12, fontWeight: 500, borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
                  color: tab === t ? 'var(--accent)' : 'var(--text-2)',
                }}>
                  {t === 'profile' ? tm.tabProfile : tm.tabMessage}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

            {tab === 'profile' && (
              <div>
                {/* Stats row — only show filled fields */}
                {(() => {
                  const profileData = candidate.profile_data ? (() => { try { return JSON.parse(candidate.profile_data as string) } catch { return null } })() : null
                  const education = profileData?.education || ''
                  const employment = profileData?.employment || candidate.experience_text?.split(' | ')[0] || ''
                  const stats = [
                    candidate.experience_years > 0 && { label: tm.experience, value: tm.years(candidate.experience_years) },
                    candidate.salary_expectation > 0 && { label: tm.salary, value: `${candidate.salary_expectation.toLocaleString()} UAH` },
                    (candidate.stage && candidate.stage !== 'new') && { label: tm.stage, value: T[uiLang].stages[candidate.stage as keyof typeof T.en.stages] || candidate.stage },
                    education && { label: uiLang === 'en' ? 'Education' : 'Освіта', value: education },
                    employment && { label: uiLang === 'en' ? 'Employment' : 'Зайнятість', value: employment },
                  ].filter(Boolean) as { label: string; value: string }[]
                  if (stats.length === 0) return null
                  const cols = Math.min(stats.length, 3)
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10, marginBottom: 20 }}>
                      {stats.map(stat => (
                        <div key={stat.label} style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '10px 14px' }}>
                          <div className="t-11 c-3">{stat.label}</div>
                          <div className="t-13 medium mt-4">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  )
                })()}


                {/* Qualification section */}
                <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
                  <div className="flex items-center justify-between mb-12">
                    <span className="t-12 medium">{tm.aiScore}</span>
                    <button className="btn" onClick={qualify} disabled={qualifying} style={{ fontSize: 11, padding: '5px 12px' }}>
                      {qualifying ? <span className="spinner" style={{ width: 12, height: 12 }} /> : iconSparkle}
                      {qualifying ? tm.analyzing : candidate.qualification_score != null ? tm.reanalyze : tm.qualify}
                    </button>
                  </div>
                  {qualError && <p style={{ color: 'var(--err)', fontSize: 11, marginBottom: 8 }}>{qualError}</p>}
                  {candidate.qualification_score != null ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: '50%', border: `3px solid ${scoreColor}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 15, fontWeight: 700, color: scoreColor, flexShrink: 0,
                        }}>
                          {candidate.qualification_score}
                        </div>
                        <div className="t-12 c-2" style={{ lineHeight: 1.5 }}>{candidate.qualification_notes}</div>
                      </div>
                    </div>
                  ) : (
                    <p className="t-11 c-3">{tm.noScore}</p>
                  )}
                </div>

                {/* Profile details */}
                {profile && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    {profile.skills?.length > 0 && (
                      <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '12px 14px' }}>
                        <div className="t-11 c-3 mb-8">{tm.skills}</div>
                        <div className="flex flex-wrap gap-4">
                          {(profile.skills as string[]).map((s: string, i: number) => (
                            <span key={i} style={{ fontSize: 10, padding: '2px 7px', background: 'var(--surface-3)', borderRadius: 4, color: 'var(--text-2)' }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.education && (
                      <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '12px 14px' }}>
                        <div className="t-11 c-3 mb-4">{tm.education}</div>
                        <div className="t-12">{profile.education}</div>
                      </div>
                    )}
                    {profile.languages?.length > 0 && (
                      <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '12px 14px' }}>
                        <div className="t-11 c-3 mb-4">{tm.languages}</div>
                        <div className="t-12">{(profile.languages as string[]).join(', ')}</div>
                      </div>
                    )}
                    {profile.availability && (
                      <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '12px 14px' }}>
                        <div className="t-11 c-3 mb-4">{tm.availability}</div>
                        <div className="t-12">{profile.availability}</div>
                      </div>
                    )}
                  </div>
                )}

                {profile?.summary && (
                  <p className="t-12 c-2" style={{ lineHeight: 1.6, marginBottom: 12 }}>{profile.summary}</p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {tags.map((t, i) => <span key={i} className="chip t-11">{t}</span>)}
                  </div>
                )}

                {candidate.source_platform !== 'cv_import' && (
                  <div style={{ marginTop: 16 }}>
                    {candidate.profile_url ? (
                      <a href={candidate.profile_url} target="_blank" rel="noopener noreferrer"
                        onClick={() => api.candidates.updateStatus(candidate.id, 'viewed')}
                        style={{
                          fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                        }}>
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9"/><path d="M13 1h2v2m0-2L8 8"/><path d="M9 1h4"/>
                        </svg>
                        {T[uiLang].jobs.viewProfile(candidate.source_platform)}
                      </a>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                        {T[uiLang].jobs.noProfileUrl}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {tab === 'message' && (
              <div>
                <div className="flex items-center gap-10 mb-16">
                  <label className="t-12 c-2">{tm.messageLang}</label>
                  {T[uiLang].messageLangs.map(([v, l]) => (
                    <button key={v} onClick={() => setMsgLang(v)} style={{
                      background: msgLang === v ? 'var(--accent)' : 'var(--surface-2)',
                      color: msgLang === v ? '#fff' : 'var(--text-2)',
                      border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer',
                    }}>{l}</button>
                  ))}
                </div>

                <button className="btn btn-primary" onClick={generateMessage} disabled={generating} style={{ marginBottom: 16 }}>
                  {generating ? <span className="spinner" /> : iconSparkle}
                  {generating ? tm.generating : tm.generateMessage}
                </button>

                {genError && <p style={{ color: 'var(--err)', fontSize: 12, marginBottom: 12 }}>{genError}</p>}

                {message && (
                  <div>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="form-input"
                      style={{ minHeight: 180 }}
                    />
                    <button className="btn btn-primary" onClick={copyMessage} style={{ marginTop: 12 }}>
                      {copied ? tm.copied : tm.copyMessage}
                    </button>
                  </div>
                )}

                {!message && !generating && (
                  <p className="t-12 c-3">{tm.messageHint}</p>
                )}
              </div>
            )}

            {tab === 'interview' && (
              <div>
                <button className="btn btn-primary" onClick={() => setShowSchedule(true)} style={{ marginBottom: 20 }}>
                  {iconCalendar} {tm.scheduleInterview}
                </button>

                {interviews.length === 0 ? (
                  <p className="t-12 c-3">{tm.noInterviews}</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {interviews.map(iv => (
                      <div key={iv.id} style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '12px 16px' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="t-13 medium">
                              {new Date(iv.scheduled_at).toLocaleDateString(T[uiLang].locale, { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="t-11 c-2 mt-4">
                              {INTERVIEW_TYPES.find(t => t.value === iv.type)?.label || iv.type}
                              {iv.interviewer ? ` · ${iv.interviewer}` : ''}
                            </div>
                          </div>
                          <button onClick={() => api.interviews.remove(iv.id).then(() => setInterviews(prev => prev.filter(i => i.id !== iv.id)))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--err)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                            {iconTrash}
                          </button>
                        </div>
                        {iv.notes && <p className="t-11 c-2" style={{ marginTop: 8 }}>{iv.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showSchedule && (
        <ScheduleModal
          candidate={candidate}
          job={job}
          onSave={iv => { setInterviews(prev => [...prev, iv]); setShowSchedule(false) }}
          onClose={() => setShowSchedule(false)}
        />
      )}
    </>
  )
}

// ─── Pipeline Card ────────────────────────────────────────────────────────────

function PipelineCard({ candidate, job, onDelete, onClick }: {
  candidate: Candidate
  job: Job
  onDelete: (id: number) => void
  onClick: () => void
}) {
  const profile = parseProfile(candidate.profile_data)
  const platformColor = PLATFORM_COLOR[candidate.source_platform] || 'var(--text-3)'
  const scoreColor = candidate.qualification_score == null ? undefined
    : candidate.qualification_score >= 70 ? 'var(--ok)'
    : candidate.qualification_score >= 40 ? '#d97706'
    : 'var(--err)'

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)', borderRadius: 16, boxShadow: 'var(--shadow-sm)',
        padding: '12px 14px', cursor: 'pointer', position: 'relative',
        transition: 'box-shadow 150ms ease',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-8" style={{ gap: 8, overflow: 'hidden' }}>
        <div className="flex items-center gap-8" style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, color: 'var(--text-1)', flexShrink: 0,
          }}>
            {candidate.initials || '?'}
          </div>
          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
            <div className="t-12 medium truncate">{candidate.role}</div>
            <div className="t-11 c-3 truncate">{candidate.location}</div>
          </div>
        </div>
        {candidate.qualification_score != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: scoreColor, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
            {iconStar} {candidate.qualification_score}
          </div>
        )}
      </div>

      {/* Skills preview */}
      {profile?.skills?.length > 0 && (
        <div className="flex flex-wrap gap-3" style={{ marginBottom: 8 }}>
          {(profile.skills as string[]).slice(0, 3).map((s: string, i: number) => (
            <span key={i} style={{ fontSize: 9, padding: '1px 5px', background: 'var(--surface-2)', borderRadius: 3, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{s}</span>
          ))}
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
        <span style={{
          fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
          background: platformColor + '22', color: platformColor,
        }}>
          {candidate.source_platform === 'cv_import' ? 'CV' : candidate.source_platform}
        </span>

        <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onDelete(candidate.id)}
            title="Supprimer"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '2px 4px', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--err)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
            {iconTrash}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Add Candidate Panel ──────────────────────────────────────────────────────

function AddCandidatePanel({ job, onAdd, onClose }: {
  job: Job
  onAdd: (candidates: Candidate[]) => void
  onClose: () => void
}) {
  const { uiLang } = useAppStore()
  const tap = T[uiLang].jobs.addPanel
  const [mode, setMode] = useState<'scraper' | 'cv'>('scraper')

  // Scraper state
  const [query, setQuery] = useState(job.title)
  const [location, setLocation] = useState(job.location || 'Kyiv')
  const [count, setCount] = useState(5)
  const [platforms, setPlatforms] = useState<string[]>(['work.ua'])
  const [salaryMin, setSalaryMin] = useState(job.salary_min || 0)
  const [salaryMax, setSalaryMax] = useState(job.salary_max || 0)
  const [experienceMin, setExperienceMin] = useState(job.experience_years || 0)
  const [skills, setSkills] = useState(() => {
    try { const arr = JSON.parse(job.skills || '[]'); return Array.isArray(arr) ? arr.join(', ') : (job.skills || '') } catch { return job.skills || '' }
  })
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Candidate[]>([])
  const [searched, setSearched] = useState(false)
  const [searchError, setSearchError] = useState('')

  // CV state
  const [dragging, setDragging] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [parsedFile, setParsedFile] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function togglePlatform(p: string) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  async function doSearch() {
    if (!query || platforms.length === 0) return
    setSearching(true); setSearchError(''); setSearched(false)
    const res = await api.scraper.search({ query, location, count, platforms, jobId: job.id, salaryMin, salaryMax, experienceMin, skills })
    setSearching(false); setSearched(true)
    if (res.error) { setSearchError(res.error); return }
    setSearchResults(res.data || [])
    if (res.data && res.data.length > 0) onAdd(res.data)
  }

  async function handleFile(file: File) {
    if (!file) return
    setParsing(true); setParseError(''); setParsedFile(file.name)

    const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain')

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        let content: string
        if (mimeType === 'application/pdf') {
          // Send as base64 for Gemini inline document
          const arr = e.target?.result as ArrayBuffer
          const bytes = new Uint8Array(arr)
          let binary = ''
          for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
          content = btoa(binary)
        } else {
          content = e.target?.result as string
        }

        const res = await api.cv.parse(file.name, content, mimeType, job.id)
        if (res.error) { setParseError(res.error); setParsing(false); return }
        if (res.data) { onAdd([res.data]); onClose() }
      } catch (err) {
        setParseError((err as Error).message)
      }
      setParsing(false)
    }

    if (mimeType === 'application/pdf') {
      reader.readAsArrayBuffer(file)
    } else {
      reader.readAsText(file)
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
      background: 'var(--surface)', boxShadow: 'var(--shadow-lg)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div className="flex items-center justify-between mb-16">
          <h3 className="t-15 medium">{tap.title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}>{iconClose}</button>
        </div>
        <div style={{ display: 'flex', gap: 0, background: 'var(--surface-2)', borderRadius: 10, padding: 3 }}>
          {[['scraper', tap.modeSearch], ['cv', tap.modeCV]].map(([v, l]) => (
            <button key={v} onClick={() => setMode(v as 'scraper' | 'cv')} style={{
              flex: 1, background: mode === v ? 'var(--surface)' : 'none',
              border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 12,
              fontWeight: 500, cursor: 'pointer', color: mode === v ? 'var(--text-1)' : 'var(--text-2)',
              boxShadow: mode === v ? 'var(--shadow-sm)' : 'none',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {mode === 'scraper' && (
          <div>
            {/* Query + city + count */}
            <div style={{ marginBottom: 12 }}>
              <label className="form-label">{tap.search}</label>
              <input className="form-input" value={query} onChange={e => setQuery(e.target.value)} placeholder={tap.searchPlaceholder} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 10, marginBottom: 12 }}>
              <div>
                <label className="form-label">{tap.city}</label>
                <select className="form-input" value={location} onChange={e => setLocation(e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">{tap.count}</label>
                <input className="form-input" type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))} style={{ MozAppearance: 'textfield' } as React.CSSProperties} />
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 12 }}>
              <label className="form-label">{tap.skills}</label>
              <input className="form-input" value={skills} onChange={e => setSkills(e.target.value)} placeholder="ex: permis C, ADR, logistique" />
            </div>

            {/* Experience */}
            <div style={{ marginBottom: 12 }}>
              <label className="form-label">{tap.experienceMin}</label>
              <input className="form-input" type="number" min={0} max={30} value={experienceMin} onChange={e => setExperienceMin(+e.target.value)} />
            </div>

            {/* Salary range */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label className="form-label">{tap.salaryMin}</label>
                <input className="form-input" type="number" min={0} step={1000} value={salaryMin} onChange={e => setSalaryMin(+e.target.value)} />
              </div>
              <div>
                <label className="form-label">{tap.salaryMax}</label>
                <input className="form-input" type="number" min={0} step={1000} value={salaryMax} onChange={e => setSalaryMax(+e.target.value)} />
              </div>
            </div>

            <button className="btn btn-primary" onClick={doSearch}
              disabled={searching || !query} style={{ width: '100%' }}>
              {searching
                ? <span className="spinner" />
                : <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6.5" cy="6.5" r="4.5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>
              }
              {searching ? tap.searching : tap.startSearch}
            </button>

            {searchError && <p style={{ color: 'var(--err)', fontSize: 12, marginTop: 12 }}>{searchError}</p>}

            {searched && searchResults.length === 0 && (
              <div className="empty-state" style={{ padding: 24, marginTop: 20 }}>
                <p className="t-12">{tap.noResults}</p>
              </div>
            )}

            {searched && searchResults.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <p className="t-12 c-2 mb-12">{tap.resultsAdded(searchResults.length)}</p>
                {searchResults.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                      {c.initials || '?'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="t-12 medium truncate">{c.role}</div>
                      <div className="t-11 c-3">{c.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === 'cv' && (
          <div>
            <p className="t-12 c-2 mb-20">{tap.cvImportHint}</p>

            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 12, padding: '40px 20px', textAlign: 'center', cursor: 'pointer',
                background: dragging ? 'var(--accent)11' : 'var(--surface-2)',
                transition: 'border-color 150ms ease, background 150ms ease',
                marginBottom: 16,
              }}>
              <div style={{ color: 'var(--text-3)', marginBottom: 8 }}>{iconUpload}</div>
              <div className="t-13 medium mb-4">{tap.dropCV}</div>
              <div className="t-11 c-3">{tap.orClick}</div>
              <div className="t-11 c-3 mt-8">{tap.pdfSupported}</div>
            </div>

            <input ref={fileInputRef} type="file" accept=".pdf,.txt" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

            {parsing && (
              <div className="flex items-center gap-10">
                <span className="spinner" />
                <span className="t-12 c-2">{tap.parsing(parsedFile)}</span>
              </div>
            )}

            {parseError && <p style={{ color: 'var(--err)', fontSize: 12 }}>{parseError}</p>}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <p className="t-10 c-3">{tap.disclaimer}</p>
      </div>
    </div>
  )
}

// ─── Pipeline View ────────────────────────────────────────────────────────────

function PipelineView({ job, onBack }: { job: Job; onBack: () => void }) {
  const { uiLang } = useAppStore()
  const tj = T[uiLang].jobs
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  useEffect(() => {
    api.candidates.list(job.id).then(r => {
      if (r.data) setCandidates(r.data)
      setLoading(false)
    })
  }, [job.id])

  async function deleteCandidate(id: number) {
    await api.candidates.remove(id)
    setCandidates(prev => prev.filter(c => c.id !== id))
  }

  function addCandidates(newOnes: Candidate[]) {
    setCandidates(prev => {
      const existing = new Set(prev.map(c => c.profile_url || c.id.toString()))
      const toAdd = newOnes.filter(c => !existing.has(c.profile_url || c.id.toString()))
      return [...toAdd, ...prev]
    })

    // Poll until all new candidates have a qualification score (max 60s)
    const newIds = new Set(newOnes.map(c => c.id))
    let attempts = 0
    const poll = setInterval(async () => {
      attempts++
      if (attempts > 20) { clearInterval(poll); return }
      const r = await api.candidates.list(job.id)
      if (!r.data) return
      setCandidates(r.data)
      const allScored = newOnes.every(c => r.data!.find(x => x.id === c.id)?.qualification_score != null)
      if (allScored) clearInterval(poll)
    }, 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div className="page-header" style={{ paddingBottom: 16, flexShrink: 0 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-16">
            <button onClick={onBack} style={{
              background: 'var(--surface-2)', border: 'none', borderRadius: 10,
              padding: '7px 14px', cursor: 'pointer', color: 'var(--text-2)',
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500,
            }}>
              {iconChevronLeft} {tj.back}
            </button>
            <div>
              <h1 className="page-title" style={{ marginBottom: 2 }}>{job.title}</h1>
              <p className="t-11 c-3">{job.location} · {job.salary_min?.toLocaleString()}–{job.salary_max?.toLocaleString()} UAH · {tj.candidates(candidates.length)}</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            {tj.addCandidate}
          </button>
        </div>
      </div>

      {/* Candidates list */}
      {loading ? (
        <div className="flex items-center gap-8" style={{ padding: 32 }}>
          <span className="spinner" /><span className="c-2">{tj.loading}</span>
        </div>
      ) : candidates.length === 0 ? (
        <div className="empty-state">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: 4 }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          <p className="t-13 c-2">{tj.noCandidates}</p>
          <p className="t-12 c-3">{tj.noCandidatesHint}</p>
        </div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12,
          overflowY: 'auto', paddingBottom: 8,
        }}>
          {candidates.map(c => (
            <PipelineCard
              key={c.id}
              candidate={c}
              job={job}
              onDelete={deleteCandidate}
              onClick={() => setSelectedCandidate(c)}
            />
          ))}
        </div>
      )}

      {/* Modals & panels */}
      {showAdd && (
        <AddCandidatePanel
          job={job}
          onAdd={newOnes => { addCandidates(newOnes); }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          job={job}
          onClose={() => setSelectedCandidate(null)}
          onUpdate={updated => {
            setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c))
            setSelectedCandidate(updated)
          }}
          onDelete={id => { deleteCandidate(id); setSelectedCandidate(null) }}
        />
      )}
    </div>
  )
}

// ─── Job List ─────────────────────────────────────────────────────────────────

export function JobDescriptions() {
  const { uiLang } = useAppStore()
  const tj = T[uiLang].jobs
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [candidateCounts, setCandidateCounts] = useState<Record<number, number>>({})


  useEffect(() => {
    api.jobs.list().then(r => {
      if (r.data) {
        setJobs(r.data)
        // Load candidate counts per job
        r.data.forEach(job => {
          api.candidates.list(job.id).then(cr => {
            if (cr.data) setCandidateCounts(prev => ({ ...prev, [job.id]: cr.data!.length }))
          })
        })
      }
      setLoading(false)
    })
  }, [])

  async function deleteJob(id: number) {
    if (!confirm(tj.deleteConfirm)) return
    await api.jobs.remove(id)
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  if (selectedJob) {
    return (
      <div className="page-pipeline">
        <PipelineView job={selectedJob} onBack={() => setSelectedJob(null)} />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">{tj.title}</h1>
            <p className="page-desc">{tj.desc}</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingJob(null); setShowForm(true) }}>
            {tj.newJob}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-8">
          <span className="spinner" /><span className="c-2">{tj.loading}</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <p>{tj.noJobs}</p>
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setShowForm(true)}>{tj.createJob}</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {jobs.map(job => {
            const count = candidateCounts[job.id] ?? 0
            const skills = (() => { try { return JSON.parse(job.skills || '[]') as string[] } catch { return [] } })()
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                style={{
                  background: 'var(--surface)', borderRadius: 16, boxShadow: 'var(--shadow-sm)',
                  padding: '20px 22px', cursor: 'pointer', transition: 'box-shadow 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
              >
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <div className="t-14 medium">{job.title}</div>
                    <div className="t-11 c-3 mt-4">{job.location}</div>
                  </div>
                  <div className="flex items-center gap-6" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { setEditingJob(job); setShowForm(true) }}
                      style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'var(--text-2)', padding: '5px 10px', fontSize: 11, fontWeight: 500 }}>
                      {tj.edit}
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4, display: 'flex', alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--err)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                      {iconTrash}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <span className="t-11 c-2">{job.salary_min?.toLocaleString()}–{job.salary_max?.toLocaleString()} UAH</span>
                  <span className="t-11 c-3">·</span>
                  <span className="t-11 c-2">{tj.expYears(job.experience_years)}</span>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-4" style={{ marginBottom: 12 }}>
                    {skills.slice(0, 4).map((s, i) => (
                      <span key={i} style={{ fontSize: 10, padding: '2px 6px', background: 'var(--surface-2)', borderRadius: 4, color: 'var(--text-3)' }}>{s}</span>
                    ))}
                    {skills.length > 4 && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>+{skills.length - 4}</span>}
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {tj.candidates(count)}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: job.is_active ? 'var(--ok-bg)' : 'var(--surface-2)', color: job.is_active ? 'var(--ok)' : 'var(--text-3)' }}>
                    {job.is_active ? tj.active : tj.inactive}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <JobForm
          initial={editingJob || EMPTY_JOB}
          onSave={saved => {
            setJobs(prev => editingJob ? prev.map(j => j.id === saved.id ? saved : j) : [saved, ...prev])
            setShowForm(false)
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
