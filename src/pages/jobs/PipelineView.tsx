import { useEffect, useState } from 'react'
import { api, Candidate, Job } from '../../api/client'
import { useAppStore } from '../../store/useAppStore'
import { T } from '../../i18n'
import { iconChevronLeft } from './icons'
import { PipelineCard } from './PipelineCard'
import { CandidateModal } from './CandidateModal'
import { AddCandidatePanel } from './AddCandidatePanel'

export function PipelineView({ job, onBack }: { job: Job; onBack: () => void }) {
  const { uiLang } = useAppStore()
  const tj = T[uiLang].jobs
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  useEffect(() => {
    api.candidates.list(job.id).then(r => {
      if (r.data) setCandidates(r.data)
      setLoading(false)
    })
  }, [job.id])

  async function deleteCandidate(id: number) {
    await api.candidates.remove(id)
    setCandidates(prev => prev.filter(c => c.id !== id))
  }

  function addCandidates(newOnes: Candidate[]) {
    setCandidates(prev => {
      const existing = new Set(prev.map(c => c.profile_url || c.id.toString()))
      const toAdd = newOnes.filter(c => !existing.has(c.profile_url || c.id.toString()))
      return [...toAdd, ...prev]
    })

    // Poll until all new candidates have a qualification score (max 60s)
    let attempts = 0
    const poll = setInterval(async () => {
      attempts++
      if (attempts > 20) { clearInterval(poll); return }
      const r = await api.candidates.list(job.id)
      if (!r.data) return
      setCandidates(r.data)
      const allScored = newOnes.every(c => r.data!.find(x => x.id === c.id)?.qualification_score != null)
      if (allScored) clearInterval(poll)
    }, 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div className="page-header" style={{ paddingBottom: 16, flexShrink: 0 }}>
        <div className="flex items-center justify-between">
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
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            {tj.addCandidate}
          </button>
        </div>
      </div>

      {/* Candidates list */}
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
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12,
          overflowY: 'auto', paddingBottom: 8,
        }}>
          {candidates.map(c => (
            <PipelineCard
              key={c.id}
              candidate={c}
              job={job}
              onDelete={deleteCandidate}
              onClick={() => setSelectedCandidate(c)}
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
