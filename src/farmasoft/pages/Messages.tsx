import { useEffect, useState } from 'react'
import { api, Message, Job } from '../api/client'
import { useAppStore } from '../store/useAppStore'
import { T } from '../i18n'

const EMPTY_MSG: Partial<Message> = {
  name: '',
  subject: '',
  body: '',
  language: 'uk',
  job_id: undefined,
  ai_generated: 0,
}

export function Messages() {
  const { uiLang } = useAppStore()
  const tm = T[uiLang].messages

  const [messages, setMessages] = useState<Message[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [selected, setSelected] = useState<Message | null>(null)
  const [form, setForm] = useState<Partial<Message>>(EMPTY_MSG)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genRole, setGenRole] = useState('')
  const [showGen, setShowGen] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Promise.all([api.messages.list(), api.jobs.list()]).then(([m, j]) => {
      if (m.data) setMessages(m.data)
      if (j.data) setJobs(j.data.filter((x) => x.is_active))
      setLoading(false)
    })
  }, [])

  function selectMessage(msg: Message) {
    setSelected(msg)
    setForm({ ...msg })
    setIsNew(false)
    setError('')
    setShowGen(false)
  }

  function startNew() {
    setSelected(null)
    setForm({ ...EMPTY_MSG })
    setIsNew(true)
    setError('')
    setShowGen(false)
  }

  async function save() {
    if (!form.name?.trim()) { setError(tm.nameRequired); return }
    setSaving(true)
    setError('')
    const res = isNew
      ? await api.messages.create(form)
      : await api.messages.update(selected!.id, form)
    if (res.error) { setError(res.error); setSaving(false); return }
    if (res.data) {
      if (isNew) {
        setMessages((prev) => [res.data!, ...prev])
        setSelected(res.data!)
        setForm({ ...res.data! })
        setIsNew(false)
      } else {
        setMessages((prev) => prev.map((m) => (m.id === res.data!.id ? res.data! : m)))
        setSelected(res.data!)
      }
    }
    setSaving(false)
  }

  async function remove() {
    if (!selected) return
    await api.messages.remove(selected.id)
    setMessages((prev) => prev.filter((m) => m.id !== selected.id))
    setSelected(null)
    setForm(EMPTY_MSG)
    setIsNew(false)
  }

  async function generateWithAI() {
    const job = jobs.find((j) => j.id === form.job_id)
    if (!job) { setError(tm.noJobForAI); return }
    setGenerating(true)
    setError('')
    const fakeCandidate = { role: genRole || 'candidate', source_platform: 'work.ua', experience_years: 0, location: job.location } as import('../api/client').Candidate
    const res = await api.ai.generateMessage(job, fakeCandidate, form.language || 'uk')
    if (res.error) { setError(res.error); setGenerating(false); return }
    if (res.data) {
      setForm((f) => ({ ...f, body: res.data as string, ai_generated: 1 }))
      setShowGen(false)
      setGenRole('')
    }
    setGenerating(false)
  }

  async function copyBody() {
    if (!form.body) return
    await navigator.clipboard.writeText(form.body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const langLabel = (code: string) => {
    const found = tm.langs.find(([k]) => k === code)
    return found ? found[1] : code
  }

  return (
    <div className="panel-layout">
      <div className="panel-list">
        <div className="panel-list-header">
          <span className="medium t-13">{tm.title}</span>
          <button className="btn btn-primary btn-sm" onClick={startNew}>{tm.new}</button>
        </div>

        <div className="panel-list-body">
          {loading ? (
            <div className="flex items-center justify-center" style={{ padding: 32 }}>
              <div className="spinner" />
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state"><p>{tm.noMessages}</p></div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`list-item${selected?.id === msg.id ? ' active' : ''}`}
                onClick={() => selectMessage(msg)}
              >
                <div className="list-item-title truncate">{msg.name}</div>
                <div className="list-item-sub">{langLabel(msg.language)}{msg.ai_generated ? tm.aiLabel : ''}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel-detail">
        {!selected && !isNew ? (
          <div className="empty-state">
            <p>{tm.selectOrCreate}</p>
            <button className="btn btn-secondary mt-16" onClick={startNew}>{tm.create}</button>
          </div>
        ) : (
          <div style={{ maxWidth: 640 }}>
            <div className="flex items-center justify-between mb-32">
              <h2 className="t-22 medium">{isNew ? tm.newTitle : form.name}</h2>
              <div className="flex gap-8">
                {!isNew && (
                  <button className="btn btn-danger btn-sm" onClick={remove}>{tm.delete}</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={copyBody} disabled={!form.body}>
                  {copied ? tm.copied : tm.copy}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowGen((v) => !v)}>
                  {tm.generateAI}
                </button>
                <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
                  {saving ? <span className="spinner" /> : null}
                  {saving ? tm.saving : tm.save}
                </button>
              </div>
            </div>

            {showGen && (
              <div className="card-sm mb-24">
                <div className="t-11 c-2 mb-12">{tm.generateTitle}</div>
                <div className="flex gap-8 items-center">
                  <input
                    className="input flex-1"
                    placeholder={tm.candidateProfilePlaceholder}
                    value={genRole}
                    onChange={(e) => setGenRole(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generateWithAI()}
                  />
                  <button className="btn btn-primary" onClick={generateWithAI} disabled={generating}>
                    {generating ? <span className="spinner" /> : null}
                    {generating ? tm.generating : tm.generate}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="msg-error mb-16">{error}</p>}

            <div className="flex-col gap-20">
              <div className="form-grid">
                <div className="field">
                  <label className="label">{tm.labelName}</label>
                  <input className="input" value={form.name || ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={tm.namePlaceholder} />
                </div>
                <div className="field">
                  <label className="label">{tm.labelLang}</label>
                  <select className="select" value={form.language || 'uk'} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}>
                    {tm.langs.map(([code, label]) => (
                      <option key={code} value={code}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label">{tm.labelJob}</label>
                <select className="select" value={form.job_id || ''} onChange={(e) => setForm((f) => ({ ...f, job_id: e.target.value ? +e.target.value : undefined }))}>
                  <option value="">{tm.noJob}</option>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>

              <div className="field">
                <label className="label">{tm.labelSubject}</label>
                <input className="input" value={form.subject || ''} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder={tm.subjectPlaceholder} />
              </div>

              <div className="field">
                <label className="label">{tm.labelBody}</label>
                <textarea
                  className="textarea"
                  rows={14}
                  value={form.body || ''}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder={tm.bodyPlaceholder}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
