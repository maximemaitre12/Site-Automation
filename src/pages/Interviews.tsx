import { useEffect, useState } from 'react'
import { api, Interview, Candidate, Job } from '../api/client'
import { useAppStore } from '../store/useAppStore'
import { T } from '../i18n'
import { CandidateModal } from './jobs/CandidateModal'

function isToday(s: string) {
  const d = new Date(s), n = new Date()
  return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
}
function isPast(s: string) { return new Date(s) < new Date() }

const iconTrash = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,4 14,4" /><path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
    <path d="M3 4l1 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-9" />
  </svg>
)
const iconClose = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="3" x2="13" y2="13" /><line x1="13" y1="3" x2="3" y2="13" />
  </svg>
)
const iconCalEmpty = (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const iconUser = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
  </svg>
)

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ interview, onSave, onClose }: {
  interview: Interview; onSave: (iv: Interview) => void; onClose: () => void
}) {
  const { uiLang } = useAppStore()
  const ti = T[uiLang].interviews
  const types = T[uiLang].interviewTypes

  const [form, setForm] = useState({
    scheduled_at: interview.scheduled_at.slice(0, 16),
    type: interview.type,
    interviewer: interview.interviewer || '',
    notes: interview.notes || '',
    decision: interview.decision || 'pending',
  })
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const res = await api.interviews.update(interview.id, form as Partial<Interview>)
    if (res.data) onSave(res.data)
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 460 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
          <h2 className="modal-title" style={{ marginBottom: 0 }}>{ti.editTitle}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}>{iconClose}</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="form-label">{ti.dateTime}</label>
          <input className="form-input" type="datetime-local" value={form.scheduled_at}
            onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label className="form-label">{ti.type}</label>
            <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'phone' | 'video' | 'on-site' }))}>
              <option value="phone">{types.phone}</option>
              <option value="video">{types.video}</option>
              <option value="on-site">{types['on-site']}</option>
            </select>
          </div>
          <div>
            <label className="form-label">{ti.decisionLabel}</label>
            <select className="form-input" value={form.decision} onChange={e => setForm(f => ({ ...f, decision: e.target.value as 'pending' | 'hire' | 'reject' }))}>
              <option value="pending">{ti.decisions.pending}</option>
              <option value="hire">{ti.decisions.hire}</option>
              <option value="reject">{ti.decisions.reject}</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">{ti.interviewer}</label>
          <input className="form-input" value={form.interviewer} onChange={e => setForm(f => ({ ...f, interviewer: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label className="form-label">{ti.notes}</label>
          <textarea className="form-input" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>

        <div className="flex gap-10 justify-end">
          <button className="btn btn-ghost" onClick={onClose}>{ti.cancel}</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? <span className="spinner" /> : null}
            {saving ? ti.saving : ti.save}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Interviews page ──────────────────────────────────────────────────────────

export function Interviews() {
  const { uiLang } = useAppStore()
  const ti = T[uiLang].interviews
  const types = T[uiLang].interviewTypes

  const TYPE_CONFIG: Record<string, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
    phone: {
      label: types.phone, bg: '#D0F0E4', color: '#2E9460',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 10.6c0 .4-.1.7-.2 1-.2.5-.5.9-.9 1.2-.6.5-1.3.7-2 .7-1.2-.1-2.3-.5-3.4-1.3-1-.7-2-1.7-2.7-2.7C4 8.4 3.6 7.3 3.5 6.1c0-.7.2-1.4.7-2 .3-.4.7-.7 1.2-.9.2-.1.4-.1.6-.1.1 0 .3 0 .4.1l1.3 2.6c.1.2.1.4.1.5 0 .2-.1.3-.2.5l-.6.6c0 .1-.1.2-.1.3 0 .1 0 .2.1.3.3.6.7 1.2 1.2 1.7.5.5 1 .9 1.7 1.2.1 0 .2.1.3.1.1 0 .2-.1.3-.2l.6-.6c.1-.1.3-.2.5-.2.1 0 .3 0 .4.1l2.2 1c.2.1.3.2.4.3.1.1.1.2.1.4z" />
        </svg>
      ),
    },
    video: {
      label: types.video, bg: '#D0E4F8', color: '#2563EB',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11,5.5 15,3 15,13 11,10.5" />
          <rect x="1" y="4" width="10" height="9" rx="1.5" />
        </svg>
      ),
    },
    'on-site': {
      label: types['on-site'], bg: '#FEE8D0', color: '#D9780A',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="12" height="13" rx="1.5" />
          <line x1="6" y1="8" x2="6" y2="8.1" strokeWidth="2" />
          <line x1="10" y1="8" x2="10" y2="8.1" strokeWidth="2" />
          <line x1="6" y1="5" x2="6" y2="5.1" strokeWidth="2" />
          <line x1="10" y1="5" x2="10" y2="5.1" strokeWidth="2" />
          <path d="M6 15v-3h4v3" />
        </svg>
      ),
    },
  }

  const DECISION_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
    pending: { label: ti.decisions.pending, bg: 'var(--surface-2)', color: 'var(--text-3)' },
    hire:    { label: ti.decisions.hire,    bg: '#D0F0E4',           color: '#2E9460' },
    reject:  { label: ti.decisions.reject,  bg: '#FDDDD8',           color: '#D94040' },
  }

  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'upcoming' | 'today' | 'past' | 'all'>('upcoming')
  const [editing, setEditing] = useState<Interview | null>(null)
  const [viewCandidate, setViewCandidate] = useState<{ candidate: Candidate; job: Job | null } | null>(null)
  const [loadingCandidate, setLoadingCandidate] = useState<number | null>(null)

  useEffect(() => {
    api.interviews.list().then(r => {
      if (r.data) setInterviews(r.data.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()))
      setLoading(false)
    })
  }, [])

  async function deleteInterview(id: number) {
    await api.interviews.remove(id)
    setInterviews(prev => prev.filter(i => i.id !== id))
  }

  async function openCandidate(iv: Interview) {
    if (!iv.candidate_id) return
    setLoadingCandidate(iv.id)
    const [cRes, jRes] = await Promise.all([
      api.candidates.get(iv.candidate_id),
      iv.job_id ? api.jobs.get(iv.job_id) : Promise.resolve({ data: null }),
    ])
    setLoadingCandidate(null)
    if (cRes.data) setViewCandidate({ candidate: cRes.data, job: jRes.data ?? null })
  }

  const counts = {
    upcoming: interviews.filter(i => !isPast(i.scheduled_at)).length,
    today: interviews.filter(i => isToday(i.scheduled_at)).length,
    past: interviews.filter(i => isPast(i.scheduled_at)).length,
    all: interviews.length,
  }

  const filtered = interviews.filter(iv => {
    if (filter === 'today') return isToday(iv.scheduled_at)
    if (filter === 'upcoming') return !isPast(iv.scheduled_at)
    if (filter === 'past') return isPast(iv.scheduled_at)
    return true
  })

  const locale = T[uiLang].locale
  const groups: Record<string, Interview[]> = {}
  for (const iv of filtered) {
    const key = new Date(iv.scheduled_at).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    if (!groups[key]) groups[key] = []
    groups[key].push(iv)
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">{ti.title}</h1>
            <p className="page-desc">{ti.desc}</p>
          </div>
          <div className="flex gap-10">
            {counts.today > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#D0E4F8', borderRadius: 20 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2563EB' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#2563EB' }}>{ti.todayBadge(counts.today)}</span>
              </div>
            )}
            {counts.upcoming > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--ok-bg)', borderRadius: 20 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ok)' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ok)' }}>{ti.upcomingBadge(counts.upcoming)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {([
          ['upcoming', ti.filterUpcoming(counts.upcoming)],
          ['today',    ti.filterToday(counts.today)],
          ['past',     ti.filterPast(counts.past)],
          ['all',      ti.filterAll(counts.all)],
        ] as [typeof filter, string][]).map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            background: filter === v ? 'var(--text-1)' : 'var(--surface)',
            color: filter === v ? '#fff' : 'var(--text-2)',
            border: 'none', borderRadius: 12, padding: '8px 18px', fontSize: 12,
            fontWeight: 500, cursor: 'pointer', boxShadow: filter === v ? 'none' : 'var(--shadow-sm)',
            transition: 'all 150ms ease',
          }}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-10">
          <span className="spinner" /><span className="c-2">{ti.loading}</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '60px 32px', boxShadow: 'var(--shadow-sm)', textAlign: 'center', color: 'var(--text-3)' }}>
          <div style={{ marginBottom: 12, opacity: 0.35 }}>{iconCalEmpty}</div>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)' }}>
            {filter === 'today' ? ti.emptyToday : filter === 'upcoming' ? ti.emptyUpcoming : ti.emptyGeneral}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>{ti.emptyHint}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {Object.entries(groups).map(([dateLabel, ivs]) => {
            const todayGroup = ivs.some(iv => isToday(iv.scheduled_at))
            return (
              <div key={dateLabel}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: todayGroup ? 'var(--accent)' : 'var(--text-2)' }}>
                    {todayGroup ? ti.todayLabel : dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}
                  </span>
                  {todayGroup && (
                    <span style={{ fontSize: 10, padding: '3px 10px', background: 'var(--accent)', color: '#fff', borderRadius: 20, fontWeight: 600 }}>
                      {ti.todayLabel}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {ivs.map(iv => {
                    const typeConf = TYPE_CONFIG[iv.type] || TYPE_CONFIG.phone
                    const decConf = DECISION_CONFIG[iv.decision] || DECISION_CONFIG.pending
                    const past = isPast(iv.scheduled_at) && !isToday(iv.scheduled_at)

                    return (
                      <div key={iv.id} style={{
                        background: 'var(--surface)', borderRadius: 20, padding: '18px 22px',
                        boxShadow: 'var(--shadow)', opacity: past ? 0.72 : 1,
                        borderLeft: isToday(iv.scheduled_at) ? '3px solid var(--accent)' : 'none',
                      }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-14">
                            <div style={{
                              width: 44, height: 44, borderRadius: '50%',
                              background: typeConf.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 13, fontWeight: 600, color: typeConf.color, flexShrink: 0,
                            }}>
                              {iv.initials || '?'}
                            </div>

                            <div>
                              <div className="flex items-center gap-10 mb-3">
                                <span style={{ fontWeight: 600, fontSize: 14 }}>{iv.role || 'Candidate'}</span>
                                {iv.job_title && (
                                  <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 8, background: 'var(--surface-2)', color: 'var(--text-2)' }}>
                                    {iv.job_title}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-10">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 8, background: typeConf.bg, color: typeConf.color }}>
                                  {typeConf.icon} {typeConf.label}
                                </div>
                                <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>
                                  {new Date(iv.scheduled_at).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {iv.interviewer && (
                                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>· {iv.interviewer}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-10">
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 20,
                              background: decConf.bg, color: decConf.color,
                            }}>{decConf.label}</span>
                            {iv.candidate_id && (
                              <button
                                onClick={() => openCandidate(iv)}
                                disabled={loadingCandidate === iv.id}
                                style={{
                                  background: 'var(--surface-2)', border: 'none', borderRadius: 10, cursor: 'pointer',
                                  color: 'var(--text-2)', padding: '6px 10px', fontSize: 12, fontWeight: 500,
                                  display: 'flex', alignItems: 'center', gap: 5,
                                }}>
                                {loadingCandidate === iv.id ? <span className="spinner" /> : iconUser}
                              </button>
                            )}
                            <button
                              onClick={() => setEditing(iv)}
                              style={{
                                background: 'var(--surface-2)', border: 'none', borderRadius: 10, cursor: 'pointer',
                                color: 'var(--text-2)', padding: '6px 14px', fontSize: 12, fontWeight: 500,
                              }}>
                              {ti.edit}
                            </button>
                            <button
                              onClick={() => deleteInterview(iv.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4, display: 'flex', alignItems: 'center' }}
                              onMouseEnter={e => (e.currentTarget.style.color = 'var(--err)')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                              {iconTrash}
                            </button>
                          </div>
                        </div>

                        {iv.notes && (
                          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{iv.notes}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing && (
        <EditModal
          interview={editing}
          onSave={updated => { setInterviews(prev => prev.map(i => i.id === updated.id ? updated : i)); setEditing(null) }}
          onClose={() => setEditing(null)}
        />
      )}

      {viewCandidate && (
        <CandidateModal
          candidate={viewCandidate.candidate}
          job={viewCandidate.job}
          onClose={() => setViewCandidate(null)}
          onUpdate={updated => setViewCandidate(vc => vc ? { ...vc, candidate: updated } : null)}
          onDelete={() => setViewCandidate(null)}
        />
      )}
    </div>
  )
}
