import { useEffect, useState } from 'react'
import { api, KPIs, SearchHistory, WeeklyData, RecentEvent } from '../api/client'
import { useAppStore } from '../store/useAppStore'
import { T } from '../i18n'

export function Analytics() {
  const { uiLang } = useAppStore()
  const ta = T[uiLang].analytics
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [weekly, setWeekly] = useState<WeeklyData[]>([])
  const [recent, setRecent] = useState<RecentEvent[]>([])
  const [searches, setSearches] = useState<SearchHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.analytics.kpis(),
      api.analytics.weekly(),
      api.analytics.recent(),
      api.analytics.searches(),
    ]).then(([k, w, r, s]) => {
      if (k.data) setKpis(k.data)
      if (w.data) setWeekly(w.data)
      if (r.data) setRecent(r.data)
      if (s.data) setSearches(s.data)
      setLoading(false)
    })
  }, [])

  const maxCount = Math.max(...weekly.map(w => w.count), 1)

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(T[uiLang].locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  function eventLabel(type: string) {
    return (ta.eventTypes as Record<string, string>)[type] || type
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{ta.title}</h1>
        <p className="page-desc">{ta.desc}</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-8">
          <span className="spinner" /><span className="c-2">{T[uiLang].dashboard.loading}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* KPI row */}
          {kpis && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {[
                { label: T[uiLang].dashboard.kpi.activeJobs, value: kpis.activeJobs, color: 'var(--accent)' },
                { label: T[uiLang].dashboard.kpi.contacted, value: kpis.totalContacted, color: 'var(--ok)' },
                { label: uiLang === 'ua' ? 'Пошуки за тиждень' : 'Searches this week', value: kpis.weekSearches, color: 'var(--text-2)' },
                { label: T[uiLang].dashboard.kpi.contactRate, value: `${kpis.contactRate}%`, color: kpis.contactRate >= 20 ? 'var(--ok)' : '#d97706' },
              ].map((kpi, i) => (
                <div key={i} className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                  <div className="t-11 c-3 mt-4">{kpi.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Weekly bar chart */}
          <div className="card">
            <div className="t-14 medium mb-16">{ta.weeklyTitle}</div>
            {weekly.length === 0 ? (
              <p className="t-13 c-3">{ta.noActivity}</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
                {weekly.map((w, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-3)', fontWeight: 600 }}>{w.count}</div>
                    <div style={{
                      width: '100%', borderRadius: '4px 4px 0 0',
                      background: 'var(--accent)',
                      height: `${Math.max((w.count / maxCount) * 96, 4)}px`,
                      opacity: 0.85,
                    }} />
                    <div style={{ fontSize: 8, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{w.week_start}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Candidates by job */}
          {kpis && kpis.byJob.length > 0 && (
            <div className="card">
              <div className="t-14 medium mb-16">{T[uiLang].dashboard.candidatesPerJob}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {kpis.byJob.map((j, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', minWidth: 140, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.title}</div>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--surface-2)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.round((j.count / Math.max(...kpis.byJob.map(x => x.count), 1)) * 100)}%`,
                        height: '100%', borderRadius: 4, background: 'var(--accent)',
                      }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', minWidth: 24, textAlign: 'right' }}>{j.count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search history */}
          <div className="card">
            <div className="t-14 medium mb-16">{ta.searchesTitle}</div>
            {searches.length === 0 ? (
              <p className="t-13 c-3">{ta.noSearches}</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Date', uiLang === 'ua' ? 'Посада' : 'Position', uiLang === 'ua' ? 'Місто' : 'City', uiLang === 'ua' ? 'Платформи' : 'Platforms', uiLang === 'ua' ? 'Результати' : 'Results'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 600, color: 'var(--text-3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {searches.map((s, i) => {
                      const platforms = (() => { try { return JSON.parse(s.platforms) as string[] } catch { return [s.platforms] } })()
                      return (
                        <tr key={s.id} style={{ borderBottom: i < searches.length - 1 ? '1px solid var(--border)' : 'none' }}>
                          <td style={{ padding: '8px 10px', color: 'var(--text-3)' }}>{formatDate(s.created_at)}</td>
                          <td style={{ padding: '8px 10px', fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.job_title || '—'}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-2)' }}>{s.location || '—'}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <div className="flex flex-wrap gap-4">
                              {platforms.map(p => (
                                <span key={p} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: 'var(--surface-2)', color: 'var(--text-2)' }}>{p}</span>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: 600, color: s.candidates_found > 0 ? 'var(--ok)' : 'var(--text-3)' }}>
                            {s.candidates_found}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="card">
            <div className="t-14 medium mb-16">{ta.recentTitle}</div>
            {recent.length === 0 ? (
              <p className="t-13 c-3">{ta.noActivity}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {recent.map((ev, i) => (
                  <div key={ev.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '9px 0',
                    borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 600, color: 'var(--text-2)', flexShrink: 0,
                    }}>
                      {ev.initials || '—'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-1)' }}>
                        <span style={{ fontWeight: 500 }}>{eventLabel(ev.type)}</span>
                        {ev.role && <span className="c-3"> · {ev.role}</span>}
                        {ev.job_title && <span className="c-3"> @ {ev.job_title}</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', flexShrink: 0 }}>{formatDate(ev.created_at)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
