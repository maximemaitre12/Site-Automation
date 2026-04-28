import { useEffect, useState } from 'react'
import { api, Job, Candidate } from '../api/client'
import { useAppStore } from '../store/useAppStore'
import { T } from '../i18n'

const PLATFORMS = ['work.ua', 'robota.ua', 'djinni.co', 'hh.ua']
const CITIES = ['Kyiv', 'Kharkiv', 'Lviv', 'Odesa', 'Dnipro', 'Zaporizhzhia', 'Vinnytsia', 'Poltava', 'Remote']
const CITY_IDS: Record<string, number> = {
  Kyiv: 1, Kharkiv: 2, Lviv: 3, Odesa: 4, Dnipro: 7,
  Zaporizhzhia: 8, Vinnytsia: 10, Poltava: 16,
}
const EXPERIENCE_OPTIONS = [
  { label: 'Peu importe', value: undefined },
  { label: 'Sans expérience', value: 0 },
  { label: '1 an+', value: 1 },
  { label: '2 ans+', value: 2 },
  { label: '5 ans+', value: 3 },
]

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
  const { uiLang } = useAppStore()
  const tp = T[uiLang].prospecting

  const [message, setMessage] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')
  const [language, setLanguage] = useState('uk')
  const [copied, setCopied] = useState(false)
  const langs = T[uiLang].messageLangs

  async function generateMessage() {
    if (!job) { setGenError(tp.noJobError); return }
    setGenerating(true)
    setGenError('')
    const res = await api.ai.generateMessage(job, candidate, language)
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
              {tp.statusLabels[candidate.status as keyof typeof tp.statusLabels] || candidate.status}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>{tp.close}</button>
          </div>
        </div>

        <div className="flex gap-12 mb-20">
          <div className="card-sm flex-1 text-center">
            <div className="t-22 medium">{candidate.salary_expectation > 0 ? candidate.salary_expectation.toLocaleString() : '—'}</div>
            <div className="t-11 c-2 mt-4">UAH/mois</div>
          </div>
          <div className="card-sm flex-1 text-center">
            <div className="t-22 medium">{candidate.experience_years || '—'}</div>
            <div className="t-11 c-2 mt-4">{tp.expYears(candidate.experience_years || 0)}</div>
          </div>
          <div className="card-sm flex-1 text-center">
            <div className="t-13 medium" style={{ paddingTop: 6 }}>{candidate.source_platform}</div>
            <div className="t-11 c-2 mt-4">{tp.platform}</div>
          </div>
        </div>

        <hr className="divider mb-20" />

        <div className="flex items-center justify-between mb-12">
          <span className="t-13 medium">Message</span>
          <div className="flex gap-8 items-center">
            <select className="select" style={{ width: 'auto', height: 28, fontSize: 11, padding: '0 8px' }} value={language} onChange={(e) => setLanguage(e.target.value)}>
              {langs.map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
            <button className="btn btn-secondary btn-sm" onClick={generateMessage} disabled={generating}>
              {generating ? <span className="spinner" /> : null}
              {generating ? tp.generating : tp.generateMessage}
            </button>
          </div>
        </div>

        {genError && <p className="msg-error mb-12">{genError}</p>}

        <textarea
          className="textarea"
          rows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="…"
        />

        <div className="modal-footer">
          <button className="btn btn-ghost btn-sm" onClick={openProfile}>{tp.viewProfile}</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={copyMessage}
            disabled={!message}
          >
            {copied ? tp.copied : tp.copyMessage}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Prospecting() {
  const { uiLang } = useAppStore()
  const tp = T[uiLang].prospecting

  const [jobs, setJobs] = useState<Job[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedJob, setSelectedJob] = useState<number | undefined>()
  const [configOpen, setConfigOpen] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  // Scraping mode
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Kyiv')
  const [count, setCount] = useState(20)
  const [platforms, setPlatforms] = useState<string[]>(['work.ua', 'robota.ua'])

  // CV database mode
  const [mode, setMode] = useState<'scraping' | 'cvdb'>('cvdb')
  const [cvKeywords, setCvKeywords] = useState('')
  const [cvCity, setCvCity] = useState('Kyiv')
  const [cvSalaryFrom, setCvSalaryFrom] = useState('')
  const [cvSalaryTo, setCvSalaryTo] = useState('')
  const [cvExperience, setCvExperience] = useState<number | undefined>(undefined)
  const [cvCount, setCvCount] = useState(20)
  const [cvTotal, setCvTotal] = useState<number | null>(null)
  const [cvPage, setCvPage] = useState(0)

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

  async function searchScraping() {
    if (!query.trim()) { setError(tp.errorQuery); return }
    if (platforms.length === 0) { setError(tp.errorPlatform); return }
    setSearching(true)
    setError('')
    const res = await api.scraper.search({ query, location, count, platforms, jobId: selectedJob })
    if (res.error) { setError(res.error); setSearching(false); return }
    if (res.data) {
      setCandidates(res.data)
      setCvTotal(null)
      setConfigOpen(false)
      api.analytics.log('search_launched', { jobId: selectedJob, platforms, count })
    }
    setSearching(false)
  }

  async function searchCvdb(page = 0) {
    if (!cvKeywords.trim()) { setError('Mots-clés requis'); return }
    setSearching(true)
    setError('')
    setCvPage(page)
    const res = await api.robota.cvdbSearch({
      keywords: cvKeywords,
      cityId: CITY_IDS[cvCity],
      salaryFrom: cvSalaryFrom ? parseInt(cvSalaryFrom) : undefined,
      salaryTo: cvSalaryTo ? parseInt(cvSalaryTo) : undefined,
      experienceId: cvExperience,
      count: cvCount,
      page,
      jobId: selectedJob,
    })
    if (res.error) { setError(res.error); setSearching(false); return }
    const result = res.data as unknown as { data: Candidate[]; total: number }
    if (result?.data) {
      setCandidates(page === 0 ? result.data : [...candidates, ...result.data])
      setCvTotal(result.total ?? null)
      setConfigOpen(false)
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
        <h1 className="page-title">{tp.title}</h1>
        <p className="page-desc">{tp.desc}</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-8 mb-16">
        <button
          className={`btn btn-sm ${mode === 'cvdb' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => { setMode('cvdb'); setConfigOpen(true) }}
        >
          Base CV robota.ua
        </button>
        <button
          className={`btn btn-sm ${mode === 'scraping' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => { setMode('scraping'); setConfigOpen(true) }}
        >
          Scraping web
        </button>
      </div>

      <div className="search-config">
        <div className="search-config-header" onClick={() => setConfigOpen((v) => !v)}>
          <span className="t-13 medium">
            {mode === 'cvdb' ? 'Recherche dans la base CV robota.ua' : tp.configTitle}
          </span>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
            style={{ transform: configOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease', opacity: 0.5 }}
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </div>

        {configOpen && mode === 'cvdb' && (
          <div className="search-config-body">
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#1D4ED8' }}>
              Accès direct à +100 000 CVs robota.ua — sans annonce nécessaire. Les profils trouvés sont importés dans Farmasoft.
            </div>
            <div className="form-grid mb-20">
              <div className="field">
                <label className="label">Poste / Mots-clés</label>
                <input
                  className="input"
                  value={cvKeywords}
                  onChange={(e) => setCvKeywords(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchCvdb(0)}
                  placeholder="ex: водій, менеджер, бухгалтер…"
                />
              </div>
              <div className="field">
                <label className="label">{tp.labelJob}</label>
                <select className="select" value={selectedJob || ''} onChange={(e) => setSelectedJob(e.target.value ? +e.target.value : undefined)}>
                  <option value="">{tp.noJob}</option>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">Ville</label>
                <select className="select" value={cvCity} onChange={(e) => setCvCity(e.target.value)}>
                  {CITIES.filter(c => c !== 'Remote').map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">Expérience</label>
                <select className="select" value={cvExperience ?? ''} onChange={(e) => setCvExperience(e.target.value !== '' ? +e.target.value : undefined)}>
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={String(o.value)} value={o.value ?? ''}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label">Salaire min (UAH)</label>
                <input className="input" type="number" value={cvSalaryFrom} onChange={(e) => setCvSalaryFrom(e.target.value)} placeholder="ex: 15000" />
              </div>
              <div className="field">
                <label className="label">Salaire max (UAH)</label>
                <input className="input" type="number" value={cvSalaryTo} onChange={(e) => setCvSalaryTo(e.target.value)} placeholder="ex: 40000" />
              </div>
              <div className="field">
                <label className="label">Nombre de résultats</label>
                <select className="select" value={cvCount} onChange={(e) => setCvCount(+e.target.value)}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {error && <p className="msg-error mb-12">{error}</p>}

            <button className="btn btn-primary mt-20" onClick={() => searchCvdb(0)} disabled={searching}>
              {searching ? <span className="spinner" /> : null}
              {searching ? 'Recherche en cours…' : 'Rechercher dans la base CV'}
            </button>
          </div>
        )}

        {configOpen && mode === 'scraping' && (
          <div className="search-config-body">
            <div className="form-grid mb-20">
              <div className="field">
                <label className="label">{tp.labelQuery}</label>
                <input
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchScraping()}
                  placeholder={tp.queryPlaceholder}
                />
              </div>
              <div className="field">
                <label className="label">{tp.labelJob}</label>
                <select className="select" value={selectedJob || ''} onChange={(e) => setSelectedJob(e.target.value ? +e.target.value : undefined)}>
                  <option value="">{tp.noJob}</option>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">{tp.labelCity}</label>
                <select className="select" value={location} onChange={(e) => setLocation(e.target.value)}>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">{tp.labelCount}</label>
                <select className="select" value={count} onChange={(e) => setCount(+e.target.value)}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={40}>40</option>
                </select>
              </div>
            </div>

            <div className="mb-20">
              <div className="label mb-8">{tp.labelPlatforms}</div>
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

            <button className="btn btn-primary mt-20" onClick={searchScraping} disabled={searching}>
              {searching ? <span className="spinner" /> : null}
              {searching ? tp.searching : tp.startSearch}
            </button>
          </div>
        )}
      </div>

      {candidates.length === 0 ? (
        <div className="empty-state">
          <p>{tp.noCandidates}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-16">
            <span className="t-13 c-2">
              {cvTotal !== null
                ? `${candidates.length} profils affichés sur ${cvTotal.toLocaleString()} disponibles`
                : tp.profiles(candidates.length)}
            </span>
            {mode === 'cvdb' && cvTotal !== null && candidates.length < cvTotal && (
              <button className="btn btn-secondary btn-sm" onClick={() => searchCvdb(cvPage + 1)} disabled={searching}>
                {searching ? <span className="spinner" /> : 'Charger plus'}
              </button>
            )}
          </div>
          <div className="candidate-grid">
            {candidates.map((c) => (
              <div key={c.id} className="candidate-card" onClick={() => setSelectedCandidate(c)}>
                <div className="flex items-center justify-between mb-8">
                  <div className="t-15 medium">{c.initials}</div>
                  <span className={`chip ${STATUS_CHIP[c.status] || ''}`}>
                    {tp.statusLabels[c.status as keyof typeof tp.statusLabels] || c.status}
                  </span>
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
