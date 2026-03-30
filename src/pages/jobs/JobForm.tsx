import { useState } from 'react'
import { api, Job } from '../../api/client'
import { useAppStore } from '../../store/useAppStore'
import { T } from '../../i18n'
import { CITIES, EMPTY_JOB } from './constants'
import { iconClose, iconSparkle } from './icons'

export { EMPTY_JOB }

export function JobForm({ initial, onSave, onClose }: {
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
