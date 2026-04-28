import { useEffect, useRef, useState } from 'react'
import { api, Candidate, Job } from '../../api/client'
import { useAppStore } from '../../store/useAppStore'
import { T } from '../../i18n'
import { iconChevronLeft } from './icons'
import { PipelineCard } from './PipelineCard'
import { CandidateModal } from './CandidateModal'
import { AddCandidatePanel } from './AddCandidatePanel'
import { RobotaSyncModal } from './RobotaSyncModal'

const STAGE_ORDER = ['new', 'interview', 'decision'] as const
type Stage = typeof STAGE_ORDER[number]

const STAGE_COLORS: Record<Stage, { bg: string; color: string; border: string }> = {
  new:              { bg: 'var(--surface-2)',  color: 'var(--text-3)',  border: 'var(--border)' },
  interview:        { bg: '#FEE8D0',           color: '#D9780A',        border: '#FCD09A' },
  decision:         { bg: '#D0F0E4',           color: '#2E9460',        border: '#86EFAC' },
}

export function PipelineView({ job, onBack }: { job: Job; onBack: () => void }) {
  const { uiLang } = useAppStore()
  const tj = T[uiLang].jobs
  const tp = T[uiLang].jobs.pipeline
  const stages = T[uiLang].stages
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState<string>('all')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('kanban')
  const [batchQualifying, setBatchQualifying] = useState(false)
  const [qualifyProgress, setQualifyProgress] = useState<{ done: number; total: number } | null>(null)
  const [showRobotaSync, setShowRobotaSync] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    api.candidates.list(job.id).then(r => {
      if (r.data) setCandidates(r.data)
      setLoading(false)
    })
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [job.id])

  async function deleteCandidate(id: number) {
    await api.candidates.remove(id)
    setCandidates(prev => prev.filter(c => c.id !== id))
  }

  async function advanceStage(id: number, newStage: string) {
    const res = await api.candidates.updateStage(id, newStage)
    if (res.data) setCandidates(prev => prev.map(c => c.id === id ? res.data! : c))
  }

  async function batchQualify() {
    const unscored = candidates.filter(c => c.qualification_score == null)
    if (unscored.length === 0) return
    setBatchQualifying(true)
    setQualifyProgress({ done: 0, total: unscored.length })
    for (let i = 0; i < unscored.length; i++) {
      const res = await api.candidates.qualify(unscored[i].id)
      if (res.data) setCandidates(prev => prev.map(c => c.id === res.data!.id ? res.data! : c))
      setQualifyProgress({ done: i + 1, total: unscored.length })
    }
    setBatchQualifying(false)
    setQualifyProgress(null)
  }

  function addCandidates(newOnes: Candidate[]) {
    setCandidates(prev => {
      const existing = new Set(prev.map(c => c.profile_url || c.id.toString()))
      const toAdd = newOnes.filter(c => !existing.has(c.profile_url || c.id.toString()))
      return [...toAdd, ...prev]
    })
    if (pollRef.current) clearInterval(pollRef.current)
    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts++
      if (attempts > 20) { clearInterval(pollRef.current!); pollRef.current = null; return }
      const r = await api.candidates.list(job.id)
      if (!r.data) return
      setCandidates(r.data)
      const allScored = newOnes.every(c => r.data!.find(x => x.id === c.id)?.qualification_score != null)
      if (allScored) { clearInterval(pollRef.current!); pollRef.current = null }
    }, 1500)
  }

  function exportCSV() {
    const headers = ['ID', 'Role', 'Location', 'Experience', 'Stage', 'Score', 'Platform', 'Status', 'Salary']
    const rows = candidates.map(c => [
      c.id,
      `"${(c.role || '').replace(/"/g, '""')}"`,
      `"${(c.location || '').replace(/"/g, '""')}"`,
      c.experience_years ?? '',
      c.stage,
      c.qualification_score ?? '',
      c.source_platform,
      c.status,
      c.salary_expectation ?? '',
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${job.title.replace(/[^a-z0-9]/gi, '_')}_candidates.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const platforms = Array.from(new Set(candidates.map(c => c.source_platform))).filter(Boolean)
  const unscoredCount = candidates.filter(c => c.qualification_score == null).length

  const filtered = candidates.filter(c => {
    if (filterStage !== 'all' && c.stage !== filterStage) return false
    if (filterPlatform !== 'all' && c.source_platform !== filterPlatform) return false
    if (search) {
      const q = search.toLowerCase()
      if (!c.role?.toLowerCase().includes(q) && !c.location?.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div className="page-header" style={{ paddingBottom: 12, flexShrink: 0 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <div className="flex items-center gap-16">
            <button onClick={onBack} style={{
              background: 'var(--surface-2)', border: 'none', borderRadius: 10,
              padding: '7px 14px', cursor: 'pointer', color: 'var(--text-2)',
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500,
            }}>
              {iconChevronLeft} {tj.back}
            </button>
            <div>
              <h1 className="page-title" style={{ marginBottom: 2 }}>{job.title}</h1>
              <p className="t-11 c-3">{job.location} · {job.salary_min?.toLocaleString()}–{job.salary_max?.toLocaleString()} UAH · {tj.candidates(candidates.length)}</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            {/* View toggle */}
            <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 8, padding: 2 }}>
              {(['kanban', 'grid'] as const).map(m => (
                <button key={m} onClick={() => setViewMode(m)} style={{
                  background: viewMode === m ? 'var(--surface)' : 'transparent',
                  border: 'none', borderRadius: 6, padding: '4px 10px',
                  cursor: 'pointer', fontSize: 11, fontWeight: 500,
                  color: viewMode === m ? 'var(--text-1)' : 'var(--text-3)',
                  boxShadow: viewMode === m ? 'var(--shadow-sm)' : 'none',
                }}>
                  {m === 'kanban' ? tp.kanban : tp.grid}
                </button>
              ))}
            </div>
            <button className="btn btn-secondary" onClick={exportCSV} style={{ fontSize: 11 }}>
              {tj.exportCSV}
            </button>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              {tj.addCandidate}
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-8" style={{ flexWrap: 'wrap' }}>
          <input
            className="input"
            style={{ width: 200, fontSize: 12 }}
            placeholder={tp.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="input"
            style={{ width: 130, fontSize: 12 }}
            value={filterStage}
            onChange={e => setFilterStage(e.target.value)}
          >
            <option value="all">{tp.allStages}</option>
            {STAGE_ORDER.map(s => (
              <option key={s} value={s}>{stages[s]}</option>
            ))}
          </select>
          {platforms.length > 1 && (
            <select
              className="input"
              style={{ width: 140, fontSize: 12 }}
              value={filterPlatform}
              onChange={e => setFilterPlatform(e.target.value)}
            >
              <option value="all">{tp.allPlatforms}</option>
              {platforms.map(p => (
                <option key={p} value={p}>{p === 'cv_import' ? 'CV' : p}</option>
              ))}
            </select>
          )}
          {(search || filterStage !== 'all' || filterPlatform !== 'all') && (
            <span className="t-11 c-3">{filtered.length} / {candidates.length}</span>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-8" style={{ padding: 32 }}>
          <span className="spinner" /><span className="c-2">{tj.loading}</span>
        </div>
      ) : candidates.length === 0 ? (
        <div className="empty-state">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: 4 }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          <p className="t-13 c-2">{tj.noCandidates}</p>
          <p className="t-12 c-3">{tj.noCandidatesHint}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p className="t-13 c-2">{tp.noMatch}</p></div>
      ) : viewMode === 'kanban' ? (
        /* ── Kanban view ── */
        <div style={{ display: 'flex', gap: 12, flex: 1, minHeight: 0, overflowX: 'auto' }}>
          {STAGE_ORDER.map(stage => {
            const stageCands = filtered.filter(c => c.stage === stage)
            const conf = STAGE_COLORS[stage]
            const avgScore = stageCands.filter(c => c.qualification_score != null).length > 0
              ? Math.round(stageCands.filter(c => c.qualification_score != null).reduce((a, c) => a + c.qualification_score!, 0) / stageCands.filter(c => c.qualification_score != null).length)
              : null
            return (
              <div key={stage} style={{ flex: '1 1 0', minWidth: 240, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                {/* Column header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', marginBottom: 8,
                  background: conf.bg, borderRadius: 10, border: `1px solid ${conf.border}`,
                  flexShrink: 0,
                }}>
                  <div className="flex items-center gap-6">
                    <span style={{ fontSize: 11, fontWeight: 600, color: conf.color }}>{stages[stage]}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10,
                      background: conf.color + '20', color: conf.color,
                    }}>{stageCands.length}</span>
                  </div>
                  {avgScore !== null && (
                    <span style={{ fontSize: 10, color: conf.color, opacity: 0.7 }}>∅ {avgScore}</span>
                  )}
                </div>
                {/* Cards */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stageCands.map(c => (
                    <PipelineCard
                      key={c.id}
                      candidate={c}
                      job={job}
                      onDelete={deleteCandidate}
                      onClick={() => setSelectedCandidate(c)}
                      onStageAdvance={advanceStage}
                    />
                  ))}
                  {stageCands.length === 0 && (
                    <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 11 }}>—</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ── Grid view ── */
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12,
          overflowY: 'auto', paddingBottom: 8,
        }}>
          {filtered.map(c => (
            <PipelineCard
              key={c.id}
              candidate={c}
              job={job}
              onDelete={deleteCandidate}
              onClick={() => setSelectedCandidate(c)}
              onStageAdvance={advanceStage}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <AddCandidatePanel
          job={job}
          onAdd={newOnes => { addCandidates(newOnes) }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {showRobotaSync && (
        <RobotaSyncModal
          job={job}
          onClose={() => setShowRobotaSync(false)}
          onImported={() => {
            api.candidates.list(job.id).then(r => { if (r.data) setCandidates(r.data) })
          }}
        />
      )}

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          job={job}
          onClose={() => setSelectedCandidate(null)}
          onUpdate={updated => {
            setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c))
            setSelectedCandidate(updated)
          }}
          onDelete={id => { deleteCandidate(id); setSelectedCandidate(null) }}
        />
      )}
    </div>
  )
}
