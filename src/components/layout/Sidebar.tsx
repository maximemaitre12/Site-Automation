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
const iconCalendar = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="12" height="11" rx="1.5" />
    <line x1="5" y1="1.5" x2="5" y2="4.5" />
    <line x1="11" y1="1.5" x2="11" y2="4.5" />
    <line x1="2" y1="7" x2="14" y2="7" />
  </svg>
)
const iconMessage = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3l3 3 3-3h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
  </svg>
)
const iconChart = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,12 6,7 9,10 14,4" />
    <line x1="2" y1="14" x2="14" y2="14" />
  </svg>
)
const iconSettings = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="2.5" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
  </svg>
)

export function Sidebar() {
  const { currentPage, setPage, uiLang, sidebarOpen } = useAppStore()
  const t = T[uiLang]

  const navItems: NavItem[] = [
    { id: 'dashboard',  label: t.nav.dashboard,  icon: iconDashboard },
    { id: 'jobs',       label: t.nav.jobs,        icon: iconFile },
    { id: 'interviews', label: t.nav.interviews,  icon: iconCalendar },
    { id: 'messages',   label: t.nav.messages,    icon: iconMessage },
    { id: 'analytics',  label: t.nav.analytics,   icon: iconChart },
    { id: 'settings',   label: t.nav.settings,    icon: iconSettings },
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
