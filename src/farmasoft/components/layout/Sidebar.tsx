import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore, Page } from '../../store/useAppStore'
import { T } from '../../i18n'
import { useAuth } from '@/hooks/useAuth'

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

export function Sidebar() {
  const { currentPage, setPage, uiLang, sidebarOpen } = useAppStore()
  const t = T[uiLang]
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: iconDashboard },
    { id: 'jobs',      label: t.nav.jobs,      icon: iconFile },
  ]

  const profileButton = (collapsed = false) => (
    <div style={{ marginTop: 'auto', paddingTop: collapsed ? 0 : 16, position: 'relative' }}>
      {showMenu && (
        <div style={{
          position: 'absolute', bottom: collapsed ? 44 : 56, left: 0, right: collapsed ? 'auto' : 0,
          minWidth: collapsed ? 140 : undefined,
          background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 4, zIndex: 50,
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '8px 12px', fontSize: 12, fontWeight: 500,
              background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer',
              color: '#ef4444', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3, rgba(0,0,0,0.05))')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 14H3.33A1.33 1.33 0 0 1 2 12.67V3.33A1.33 1.33 0 0 1 3.33 2H6" />
              <polyline points="10.67 11.33 14 8 10.67 4.67" />
              <line x1="14" y1="8" x2="6" y2="8" />
            </svg>
            Log out
          </button>
        </div>
      )}
      <div
        onClick={() => setShowMenu(!showMenu)}
        style={{
          display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10,
          padding: collapsed ? '0' : '10px 10px',
          background: collapsed ? 'none' : 'var(--surface-2)', borderRadius: 12,
          cursor: 'pointer', justifyContent: collapsed ? 'center' : undefined,
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--accent)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600,
          lineHeight: '1', flexShrink: 0,
        }}>U</div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.user.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>{t.user.role}</div>
          </div>
        )}
      </div>
    </div>
  )

  if (!sidebarOpen) {
    return (
      <aside className="sidebar-collapsed">
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
        {profileButton(true)}
      </aside>
    )
  }

  return (
    <aside className="sidebar">
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
      {profileButton(false)}
    </aside>
  )
}
