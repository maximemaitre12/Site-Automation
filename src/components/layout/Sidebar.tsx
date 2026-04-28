import { useState, useEffect, useRef } from 'react'
import { useAppStore, Page } from '../../store/useAppStore'
import { T } from '../../i18n'
import { api, RobotaConfig } from '../../api/client'

interface NavItem { id: Page; label: string; icon: JSX.Element }

const iconDashboard = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="5.5" height="5.5" rx="1.5" />
    <rect x="8.5" y="2" width="5.5" height="5.5" rx="1.5" />
    <rect x="2" y="8.5" width="5.5" height="5.5" rx="1.5" />
    <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5" />
  </svg>
)
const iconFile = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5l-3-3z" />
    <path d="M10 2v3h3" /><line x1="5.5" y1="8" x2="10.5" y2="8" /><line x1="5.5" y1="10.5" x2="8.5" y2="10.5" />
  </svg>
)

function ProfileMenu({ open, onClose, anchor }: { open: boolean; onClose: () => void; anchor: 'expanded' | 'collapsed' }) {
  const [config, setConfig] = useState<RobotaConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      api.robota.config().then(r => { if (r.data) setConfig(r.data) })
      setShowLogin(false); setError('')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, onClose])

  if (!open) return null

  async function handleConnect() {
    if (!email || !password) { setError('Email et mot de passe requis'); return }
    setLoading(true); setError('')
    const r = await api.robota.auth(email, password)
    setLoading(false)
    if (r.error) { setError(r.error); return }
    const c = await api.robota.config()
    if (c.data) setConfig(c.data)
    setShowLogin(false); setEmail(''); setPassword('')
  }

  async function handleDisconnect() {
    if (!confirm('Déconnecter le compte robota.ua ?')) return
    setLoading(true)
    await api.robota.disconnect()
    const c = await api.robota.config()
    if (c.data) setConfig(c.data)
    setLoading(false)
  }

  const positionStyle: React.CSSProperties = anchor === 'expanded'
    ? { position: 'absolute', bottom: 70, left: 12, right: 12 }
    : { position: 'absolute', bottom: 12, left: 60, width: 280 }

  return (
    <div ref={ref} style={{
      ...positionStyle,
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: 14, zIndex: 1000,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
        Compte robota.ua
      </div>

      {config?.robota_configured ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
            <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {config.robota_email || 'Connecté'}
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={loading}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
              cursor: loading ? 'wait' : 'pointer',
            }}>
            {loading ? '...' : 'Se déconnecter'}
          </button>
        </>
      ) : !showLogin ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-3)' }} />
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Non connecté</div>
          </div>
          <button
            onClick={() => setShowLogin(true)}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
            }}>
            Se connecter
          </button>
        </>
      ) : (
        <>
          <input
            type="email" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '8px 10px', borderRadius: 8, fontSize: 12,
              border: '1px solid var(--border)', background: 'var(--surface-2)',
              boxSizing: 'border-box', marginBottom: 8,
            }} />
          <input
            type="password" placeholder="Mot de passe"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleConnect()}
            style={{
              width: '100%', padding: '8px 10px', borderRadius: 8, fontSize: 12,
              border: '1px solid var(--border)', background: 'var(--surface-2)',
              boxSizing: 'border-box', marginBottom: 8,
            }} />
          {error && <div style={{ fontSize: 11, color: '#DC2626', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => { setShowLogin(false); setError('') }}
              style={{
                flex: 1, padding: '8px', borderRadius: 8, fontSize: 12,
                background: 'var(--surface-2)', color: 'var(--text-2)', border: 'none', cursor: 'pointer',
              }}>Annuler</button>
            <button
              onClick={handleConnect}
              disabled={loading}
              style={{
                flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: 'var(--accent)', color: '#fff', border: 'none',
                cursor: loading ? 'wait' : 'pointer',
              }}>
              {loading ? '...' : 'Connecter'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function Sidebar() {
  const { currentPage, setPage, uiLang, sidebarOpen } = useAppStore()
  const t = T[uiLang]
  const [menuOpen, setMenuOpen] = useState(false)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    api.robota.config().then(r => setConnected(!!r.data?.robota_configured))
  }, [menuOpen])

  const navItems: NavItem[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: iconDashboard },
    { id: 'jobs',      label: t.nav.jobs,      icon: iconFile },
  ]

  if (!sidebarOpen) {
    return (
      <aside className="sidebar-collapsed" style={{ position: 'relative' }}>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-item-icon${currentPage === item.id ? ' active' : ''}`}
              onClick={() => setPage(item.id)}
              title={item.label}
            >
              {item.icon}
            </div>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', position: 'relative' }}>
          <div
            onClick={() => setMenuOpen(o => !o)}
            title="Compte"
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600,
              lineHeight: '1', margin: '0 auto', cursor: 'pointer', position: 'relative',
            }}>
            U
            {connected && (
              <span style={{
                position: 'absolute', bottom: -2, right: -2, width: 10, height: 10,
                borderRadius: '50%', background: '#16A34A', border: '2px solid var(--surface)',
              }} />
            )}
          </div>
        </div>
        <ProfileMenu open={menuOpen} onClose={() => setMenuOpen(false)} anchor="collapsed" />
      </aside>
    )
  }

  return (
    <aside className="sidebar" style={{ position: 'relative' }}>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item${currentPage === item.id ? ' active' : ''}`}
            onClick={() => setPage(item.id)}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <div
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px',
            background: 'var(--surface-2)', borderRadius: 12, cursor: 'pointer',
            transition: 'background 120ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--border)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-2)' }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600,
              lineHeight: '1',
            }}>U</div>
            {connected && (
              <span style={{
                position: 'absolute', bottom: 0, right: 0, width: 10, height: 10,
                borderRadius: '50%', background: '#16A34A', border: '2px solid var(--surface-2)',
              }} />
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.user.name}</div>
            <div style={{ fontSize: 10, color: connected ? '#16A34A' : 'var(--text-3)', fontWeight: 500 }}>
              {connected ? 'robota.ua connecté' : 'robota.ua non connecté'}
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-3)', opacity: 0.6 }}>
            <path d="M4 6l4 4 4-4" style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transformOrigin: 'center', transition: 'transform 150ms ease' }} />
          </svg>
        </div>
      </div>
      <ProfileMenu open={menuOpen} onClose={() => setMenuOpen(false)} anchor="expanded" />
    </aside>
  )
}
