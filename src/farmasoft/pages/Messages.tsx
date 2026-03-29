import { useEffect, useState } from 'react'
import { api, Message, Job } from '../api/client'

const EMPTY_MSG: Partial<Message> = {
  name: '',
  subject: '',
  body: '',
  language: 'uk',
  job_id: undefined,
  ai_generated: 0,
}

export function Messages() {
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
    if (!form.name?.trim()) { setError('Le nom est requis.'); return }
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
    if (!job) { setError('Associez ce message à un poste pour générer avec l\'IA.'); return }
    setGenerating(true)
    setError('')
    const res = await api.ai.generateMessage(job, genRole || 'candidat', 'plateforme', form.language || 'uk')
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

  const LANG_LABELS: Record<string, string> = { uk: 'Ukrainien', fr: 'Français', en: 'Anglais' }

  return (
    <div className="panel-layout">
      <div className="panel-list">
        <div className="panel-list-header">
          <span className="medium t-13">Messages</span>
          <button className="btn btn-primary btn-sm" onClick={startNew}>+ Nouveau</button>
        </div>

        <div className="panel-list-body">
          {loading ? (
            <div className="flex items-center justify-center" style={{ padding: 32 }}>
              <div className="spinner" />
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state"><p>Aucun message</p></div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`list-item${selected?.id === msg.id ? ' active' : ''}`}
                onClick={() => selectMessage(msg)}
              >
                <div className="list-item-title truncate">{msg.name}</div>
                <div className="list-item-sub">{LANG_LABELS[msg.language] || msg.language}{msg.ai_generated ? ' · IA' : ''}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel-detail">
        {!selected && !isNew ? (
          <div className="empty-state">
            <p>Sélectionnez un message ou créez-en un nouveau</p>
            <button className="btn btn-secondary mt-16" onClick={startNew}>Créer un message</button>
          </div>
        ) : (
          <div style={{ maxWidth: 640 }}>
            <div className="flex items-center justify-between mb-32">
              <h2 className="t-22 medium">{isNew ? 'Nouveau message' : form.name}</h2>
              <div className="flex gap-8">
                {!isNew && (
                  <button className="btn btn-danger btn-sm" onClick={remove}>Supprimer</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={copyBody} disabled={!form.body}>
                  {copied ? 'Copié !' : 'Copier'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowGen((v) => !v)}>
                  Générer avec l'IA
                </button>
                <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
                  {saving ? <span className="spinner" /> : null}
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </div>

            {showGen && (
              <div className="card-sm mb-24">
                <div className="t-11 c-2 mb-12">Générer un message personnalisé</div>
                <div className="flex gap-8 items-center">
                  <input
                    className="input flex-1"
                    placeholder="Profil du candidat (ex. Développeur Python 3 ans d'expérience)"
                    value={genRole}
                    onChange={(e) => setGenRole(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generateWithAI()}
                  />
                  <button className="btn btn-primary" onClick={generateWithAI} disabled={generating}>
                    {generating ? <span className="spinner" /> : null}
                    {generating ? 'Génération…' : 'Générer'}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="msg-error mb-16">{error}</p>}

            <div className="flex-col gap-20">
              <div className="form-grid">
                <div className="field">
                  <label className="label">Nom du message</label>
                  <input className="input" value={form.name || ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="ex. Message Work.ua — Dev Backend" />
                </div>
                <div className="field">
                  <label className="label">Langue</label>
                  <select className="select" value={form.language || 'uk'} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}>
                    <option value="uk">Ukrainien</option>
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label">Fiche de poste associée</label>
                <select className="select" value={form.job_id || ''} onChange={(e) => setForm((f) => ({ ...f, job_id: e.target.value ? +e.target.value : undefined }))}>
                  <option value="">— Aucune —</option>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>

              <div className="field">
                <label className="label">Sujet (optionnel)</label>
                <input className="input" value={form.subject || ''} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Objet de l'email ou titre du message" />
              </div>

              <div className="field">
                <label className="label">Corps du message</label>
                <textarea
                  className="textarea"
                  rows={14}
                  value={form.body || ''}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder="Rédigez votre message ici, ou utilisez la génération IA…"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
