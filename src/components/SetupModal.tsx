import { useState } from 'react'

interface Props {
  onClose: () => void
}

export function SetupModal({ onClose }: Props) {
  const [apiKey, setApiKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!apiKey.trim().startsWith('sk-ant-')) {
      setError('La clé API Anthropic doit commencer par "sk-ant-"')
      return
    }
    setSaving(true)
    setError('')
    try {
      await window.electronAPI.setSetting('anthropicApiKey', apiKey.trim())
      onClose()
    } catch (e) {
      setError('Erreur lors de la sauvegarde. Réessayez.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--bg-border)',
        borderRadius: 16,
        padding: 32,
        width: 460,
        animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36,
              background: 'var(--accent-green-bg)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-green)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Configuration initiale</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Farmasoft RH Intelligence Platform</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Pour activer la génération IA de fiches de poste et de messages personnalisés,
            entrez votre clé API Anthropic. Elle sera stockée localement sur cet ordinateur.
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="label">Clé API Anthropic</label>
          <input
            className="input"
            type="password"
            placeholder="sk-ant-api03-..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
            Obtenez votre clé sur console.anthropic.com → API Keys
          </p>
        </div>

        {error && (
          <div style={{
            background: '#450a0a', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, padding: '10px 12px',
            color: '#ef4444', fontSize: 13, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={() => onClose()} disabled={saving}>
            Ignorer
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={saving || !apiKey.trim()}>
            {saving ? 'Sauvegarde…' : 'Confirmer →'}
          </button>
        </div>
      </div>
    </div>
  )
}
