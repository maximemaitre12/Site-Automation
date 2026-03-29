import { useAppStore, Page } from '../../store/useAppStore'
import { T } from '../../i18n'

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

  const navItems: NavItem[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: iconDashboard },
    { id: 'jobs',      label: t.nav.jobs,      icon: iconFile },
  ]

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
        <div style={{ marginTop: 'auto' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600,
            lineHeight: '1', margin: '0 auto',
          }}>U</div>
        </div>
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

      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px',
          background: 'var(--surface-2)', borderRadius: 12,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600,
            lineHeight: '1', flexShrink: 0,
          }}>U</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.user.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>{t.user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
