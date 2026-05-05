import { useState } from 'react'
import { api, Candidate, Interview, Job } from '../../api/client'
import { useAppStore } from '../../store/useAppStore'
import { T } from '../../i18n'
import { INTERVIEW_TYPES } from './constants'
import { iconCalendar, iconClose } from './icons'

export function ScheduleModal({ candidate, job, onSave, onClose }: {
  candidate: Candidate
  job: Job | null
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
      job_id: job?.id,
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
