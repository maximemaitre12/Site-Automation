import { useEffect, useState } from 'react'
import { api, Job, Candidate } from '../api/client'

const PLATFORMS = ['work.ua', 'robota.ua', 'djinni.co', 'hh.ua']
const CITIES = ['Kyiv', 'Kharkiv', 'Lviv', 'Odesa', 'Dnipro', 'Zaporizhzhia', 'Vinnytsia', 'Poltava', 'Remote']

const STATUS_LABELS: Record<string, string> = {
  new: 'nouveau',
  viewed: 'consulté',
  contacted: 'contacté',
  rejected: 'refusé',
}

const STATUS_CHIP: Record<string, string> = {
  new: '',
  viewed: 'chip-warn',
  contacted: 'chip-ok',
  rejected: 'chip-err',
}

interface CandidateModalProps {
  candidate: Candidate
  job: Job | undefined
  onClose: () => void
  onStatusChange: (id: number, status: string) => void
}

function CandidateModal({ candidate, job, onClose, onStatusChange }: CandidateModalProps) {
  const [message, setMessage] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')
  const [language, setLanguage] = useState('uk')
  const [copied, setCopied] = useState(false)

  async function generateMessage() {
    if (!job) { setGenError('Associez ce candidat à un poste pour générer un message.'); return }
    setGenerating(true)
    setGenError('')
    const res = await api.ai.generateMessage(job, candidate.role, candidate.source_platform, language)
    if (res.error) { setGenError(res.error); setGenerating(false); return }
    if (res.data) setMessage(res.data)
    setGenerating(false)
  }

  async function copyMessage() {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onStatusChange(candidate.id, 'contacted')
    api.analytics.log('message_copied', { candidateId: candidate.id, jobId: candidate.job_id })
  }

  async function openProfile() {
    window.open(candidate.profile_url, '_blank', 'noopener,noreferrer')
    onStatusChange(candidate.id, 'viewed')
    api.analytics.log('profile_viewed', { candidateId: candidate.id, jobId: candidate.job_id })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: 600 }}>
        <div className="flex items-center justify-between mb-20">
          <div>
            <div className="t-15 medium">{candidate.initials}</div>
            <div className="t-11 c-2 mt-4">{candidate.role} · {candidate.location}</div>
          </div>
          <div className="flex gap-8 items-center">
            <span className={`chip ${STATUS_CHIP[candidate.status] || ''}`}>
              {STATUS_LABELS[candidate.status] || candidate.status}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Fermer</button>
          </div>
        </div>

        <div className="flex gap-12 mb-20">
          <div className="card-sm flex-1 text-center">
            <div className="t-22 medium">{candidate.salary_expectation > 0 ? candidate.salary_expectation.toLocaleString() : '—'}</div>
            <div className="t-11 c-2 mt-4">UAH/mois</div>
          </div>
          <div className="card-sm flex-1 text-center">
            <div className="t-22 medium">{candidate.experience_years || '—'}</div>
            <div className="t-11 c-2 mt-4">ans d'expérience</div>
          </div>
          <div className="card-sm flex-1 text-center">
            <div className="t-13 medium" style={{ paddingTop: 6 }}>{candidate.source_platform}</div>
            <div className="t-11 c-2 mt-4">plateforme</div>
          </div>
        </div>

        <hr className="divider mb-20" />

        <div className="flex items-center justify-between mb-12">
          <span className="t-13 medium">Message de contact</span>
          <div className="flex gap-8 items-center">
            <select className="select" style={{ width: 'auto', height: 28, fontSize: 11, padding: '0 8px' }} value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="uk">Ukrainien</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
            <button className="btn btn-secondary btn-sm" onClick={generateMessage} disabled={generating}>
              {generating ? <span className="spinner" /> : null}
              {generating ? 'Génération…' : 'Générer avec l\'IA'}
            </button>
          </div>
        </div>

        {genError && <p className="msg-error mb-12">{genError}</p>}

        <textarea
          className="textarea"
          rows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Le message généré par l'IA apparaîtra ici. Vous pouvez le modifier avant de le copier."
        />

        <div className="modal-footer">
          <button className="btn btn-ghost btn-sm" onClick={openProfile}>Voir le profil</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={copyMessage}
            disabled={!message}
          >
            {copied ? 'Copié !' : 'Copier le message'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Prospecting() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedJob, setSelectedJob] = useState<number | undefined>()
  const [configOpen, setConfigOpen] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Kyiv')
  const [count, setCount] = useState(20)
  const [platforms, setPlatforms] = useState<string[]>(['work.ua', 'robota.ua'])

  useEffect(() => {
    api.jobs.list().then((res) => {
      if (res.data) setJobs(res.data.filter((j) => j.is_active))
    })
    api.candidates.list().then((res) => {
      if (res.data) setCandidates(res.data)
    })
  }, [])

  function togglePlatform(p: string) {
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])
  }

  async function search() {
    if (!query.trim()) { setError('Entrez un terme de recherche.'); return }
    if (platforms.length === 0) { setError('Sélectionnez au moins une plateforme.'); return }
    setSearching(true)
    setError('')
    const res = await api.scraper.search({ query, location, count, platforms, jobId: selectedJob })
    if (res.error) { setError(res.error); setSearching(false); return }
    if (res.data) {
      setCandidates(res.data)
      setConfigOpen(false)
      api.analytics.log('search_launched', { jobId: selectedJob, platforms, count })
    }
    setSearching(false)
  }

  function updateCandidateStatus(id: number, status: string) {
    setCandidates((prev) => prev.map((c) => c.id === id ? { ...c, status: status as Candidate['status'] } : c))
    api.candidates.updateStatus(id, status)
  }

  const activeJob = jobs.find((j) => j.id === selectedJob)

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Prospection</h1>
        <p className="page-desc">Recherche de candidats sur Work.ua, Robota.ua, Djinni et HH.ua</p>
      </div>

      <div className="search-config">
        <div className="search-config-header" onClick={() => setConfigOpen((v) => !v)}>
          <span className="t-13 medium">Configuration de recherche</span>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
            style={{ transform: configOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease', opacity: 0.5 }}
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </div>

        {configOpen && (
          <div className="search-config-body">
            <div className="form-grid mb-20">
              <div className="field">
                <label className="label">Terme de recherche</label>
                <input
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && search()}
                  placeholder="ex. Développeur React, Pharmacien, Logisticien"
                />
              </div>
              <div className="field">
                <label className="label">Fiche de poste associée (optionnel)</label>
                <select className="select" value={selectedJob || ''} onChange={(e) => setSelectedJob(e.target.value ? +e.target.value : undefined)}>
                  <option value="">— Aucune —</option>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">Ville</label>
                <select className="select" value={location} onChange={(e) => setLocation(e.target.value)}>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">Nombre de résultats</label>
                <select className="select" value={count} onChange={(e) => setCount(+e.target.value)}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={40}>40</option>
                </select>
              </div>
            </div>

            <div className="mb-20">
              <div className="label mb-8">Plateformes</div>
              <div className="platform-grid">
                {PLATFORMS.map((p) => (
                  <div
                    key={p}
                    className={`platform-toggle${platforms.includes(p) ? ' selected' : ''}`}
                    onClick={() => togglePlatform(p)}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="msg-error mb-12">{error}</p>}

            <button className="btn btn-primary mt-20" onClick={search} disabled={searching}>
              {searching ? <span className="spinner" /> : null}
              {searching ? 'Recherche en cours…' : 'Lancer la recherche'}
            </button>
          </div>
        )}
      </div>

      {candidates.length === 0 ? (
        <div className="empty-state">
          <p>Aucun candidat trouvé. Lancez une recherche.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-16">
            <span className="t-13 c-2">{candidates.length} profil{candidates.length > 1 ? 's' : ''}</span>
          </div>
          <div className="candidate-grid">
            {candidates.map((c) => (
              <div key={c.id} className="candidate-card" onClick={() => setSelectedCandidate(c)}>
                <div className="flex items-center justify-between mb-8">
                  <div className="t-15 medium">{c.initials}</div>
                  <span className={`chip ${STATUS_CHIP[c.status] || ''}`}>{STATUS_LABELS[c.status] || c.status}</span>
                </div>
                <div className="t-13 mb-4 truncate">{c.role}</div>
                <div className="t-11 c-2">{c.location}</div>
                <div className="flex items-center gap-8 mt-12">
                  {c.salary_expectation > 0 && (
                    <span className="chip chip-accent">{c.salary_expectation.toLocaleString()} UAH</span>
                  )}
                  <span className="chip">{c.source_platform}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          job={activeJob}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={updateCandidateStatus}
        />
      )}
    </div>
  )
}
