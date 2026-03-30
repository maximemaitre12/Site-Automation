import { useEffect, useState } from 'react'
import { api, Candidate, Interview, Job } from '../../api/client'
import { useAppStore } from '../../store/useAppStore'
import { T } from '../../i18n'
import { INTERVIEW_TYPES, PLATFORM_COLOR } from './constants'
import { iconCalendar, iconClose, iconSparkle, iconStar, iconTrash } from './icons'
import { parseProfile, parseTags } from './helpers'
import { ScheduleModal } from './ScheduleModal'

export function CandidateModal({ candidate: initial, job, onClose, onUpdate, onDelete }: {
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
