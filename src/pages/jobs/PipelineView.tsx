import { useEffect, useRef, useState } from 'react'
import { api, Candidate, Job } from '../../api/client'
import { useAppStore } from '../../store/useAppStore'
import { T } from '../../i18n'
import { iconChevronLeft } from './icons'
import { PipelineCard } from './PipelineCard'
import { CandidateModal } from './CandidateModal'
import { AddCandidatePanel } from './AddCandidatePanel'

const STAGE_ORDER = ['new', 'prequalification', 'interview', 'decision'] as const

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

  function addCandidates(newOnes: Candidate[]) {
    setCandidates(prev => {
      const existing = new Set(prev.map(c => c.profile_url || c.id.toString()))
      const toAdd = newOnes.filter(c => !existing.has(c.profile_url || c.id.toString()))
      return [...toAdd, ...prev]
    })

    // Poll until all new candidates have a qualification score (max 60s)
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

  // Derive available platforms
  const platforms = Array.from(new Set(candidates.map(c => c.source_platform))).filter(Boolean)

  // Apply filters
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
              style={{ width: 130, fontSize: 12 }}
              value={filterPlatform}
              onChange={e => setFilterPlatform(e.target.value)}
            >
              <option value="all">All platforms</option>
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

      {/* Candidates grid */}
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
        <div className="empty-state">
          <p className="t-13 c-2">No candidates match the current filters.</p>
        </div>
      ) : (
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

      {/* Modals & panels */}
      {showAdd && (
        <AddCandidatePanel
          job={job}
          onAdd={newOnes => { addCandidates(newOnes) }}
          onClose={() => setShowAdd(false)}
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
