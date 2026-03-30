import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAppStore } from '../store/useAppStore'
import { T } from '../i18n'

export function Settings() {
  const { setApiKeyConfigured, uiLang } = useAppStore()
  const ts = T[uiLang].settings
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    api.settings.get('geminiKey').then((res) => {
      if (res.data) setApiKey(res.data)
      setLoading(false)
    })
  }, [])

  async function save() {
    if (!apiKey.trim()) { setError(ts.required); return }
    setSaving(true)
    setError('')
    const res = await api.settings.set('geminiKey', apiKey.trim())
    if (res.error) { setError(res.error); setSaving(false); return }
    setSaved(true)
    setApiKeyConfigured(true)
    setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  async function clear() {
    await api.settings.set('geminiKey', '')
    setApiKey('')
    setApiKeyConfigured(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{ts.title}</h1>
        <p className="page-desc">{ts.desc}</p>
      </div>

      <div style={{ maxWidth: 480 }}>
        <div className="card">
          <div className="t-15 medium mb-4">{ts.geminiKey}</div>
          <p className="t-13 c-2 mb-24">{ts.geminiDesc}</p>

          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="flex-col gap-16">
              <div className="field">
                <label className="label">{ts.keyLabel}</label>
                <div className="flex gap-8">
                  <input
                    className="input flex-1"
                    type={visible ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => { setApiKey(e.target.value); setError('') }}
                    placeholder="AIzaSy…"
                    autoComplete="off"
                  />
                  <button
                    className="btn btn-secondary"
                    style={{ width: 36, padding: 0 }}
                    onClick={() => setVisible((v) => !v)}
                    title={visible ? 'Masquer' : 'Afficher'}
                  >
                    {visible ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" />
                        <circle cx="8" cy="8" r="1.5" />
                        <line x1="2" y1="2" x2="14" y2="14" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" />
                        <circle cx="8" cy="8" r="1.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="msg-error">{error}</p>}
              {saved && <p className="msg-ok">{ts.saved}</p>}

              <div className="flex gap-8">
                <button className="btn btn-primary" onClick={save} disabled={saving}>
                  {saving ? <span className="spinner" /> : null}
                  {saving ? ts.saving : ts.save}
                </button>
                {apiKey && (
                  <button className="btn btn-ghost" onClick={clear}>{ts.clear}</button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card mt-16">
          <div className="t-15 medium mb-4">{ts.modelTitle}</div>
          <p className="t-13 c-2">
            <span className="chip chip-accent" style={{ marginRight: 8 }}>gemini-2.5-flash</span>
            {ts.geminiDesc}
          </p>
        </div>

        <div className="card mt-16">
          <div className="t-15 medium mb-4">{ts.privacyTitle}</div>
          <p className="t-13 c-2">{ts.privacyDesc}</p>
        </div>
      </div>
    </div>
  )
}
