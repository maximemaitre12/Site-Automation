import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAppStore } from '../store/useAppStore'

export function Settings() {
  const { setApiKeyConfigured } = useAppStore()
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    api.settings.get('anthropicApiKey').then((res) => {
      if (res.data) setApiKey(res.data)
      setLoading(false)
    })
  }, [])

  async function save() {
    if (!apiKey.trim()) { setError('La clé API est requise.'); return }
    if (!apiKey.startsWith('sk-ant-')) { setError('Format invalide. La clé doit commencer par sk-ant-'); return }
    setSaving(true)
    setError('')
    const res = await api.settings.set('anthropicApiKey', apiKey.trim())
    if (res.error) { setError(res.error); setSaving(false); return }
    setSaved(true)
    setApiKeyConfigured(true)
    setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  async function clear() {
    await api.settings.set('anthropicApiKey', '')
    setApiKey('')
    setApiKeyConfigured(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Paramètres</h1>
        <p className="page-desc">Configuration de la plateforme</p>
      </div>

      <div style={{ maxWidth: 480 }}>
        <div className="card">
          <div className="t-15 medium mb-4">Clé API Anthropic</div>
          <p className="t-13 c-2 mb-24">
            Nécessaire pour la génération de fiches de poste et de messages de contact via Claude.
          </p>

          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="flex-col gap-16">
              <div className="field">
                <label className="label">Clé API</label>
                <div className="flex gap-8">
                  <input
                    className="input flex-1"
                    type={visible ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => { setApiKey(e.target.value); setError('') }}
                    placeholder="sk-ant-api03-…"
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
              {saved && <p className="msg-ok">Clé enregistrée avec succès.</p>}

              <div className="flex gap-8">
                <button className="btn btn-primary" onClick={save} disabled={saving}>
                  {saving ? <span className="spinner" /> : null}
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                {apiKey && (
                  <button className="btn btn-ghost" onClick={clear}>Effacer la clé</button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card mt-16">
          <div className="t-15 medium mb-4">Modèle utilisé</div>
          <p className="t-13 c-2">
            <span className="chip chip-accent" style={{ marginRight: 8 }}>claude-sonnet-4-20250514</span>
            Génération de fiches de poste et messages de contact
          </p>
        </div>

        <div className="card mt-16">
          <div className="t-15 medium mb-4">Confidentialité</div>
          <p className="t-13 c-2">
            Aucun nom complet n'est stocké. Les candidats sont identifiés par leurs initiales uniquement (ex. A.B.).
            Toutes les données restent locales sur ce serveur.
          </p>
        </div>
      </div>
    </div>
  )
}
