import { useRef, useState } from 'react'
import { api, Candidate, Job } from '../../api/client'
import { useAppStore } from '../../store/useAppStore'
import { T } from '../../i18n'
import { CITIES } from './constants'
import { iconClose, iconUpload } from './icons'

export function AddCandidatePanel({ job, onAdd, onClose }: {
  job: Job
  onAdd: (candidates: Candidate[]) => void
  onClose: () => void
}) {
  const { uiLang } = useAppStore()
  const tap = T[uiLang].jobs.addPanel
  const [mode, setMode] = useState<'scraper' | 'cv'>('scraper')

  // Scraper state
  const [query, setQuery] = useState(job.title)
  const [location, setLocation] = useState(job.location || 'Kyiv')
  const [count, setCount] = useState(5)
  const [platforms, setPlatforms] = useState<string[]>(['work.ua'])
  const [salaryMin, setSalaryMin] = useState(job.salary_min || 0)
  const [salaryMax, setSalaryMax] = useState(job.salary_max || 0)
  const [experienceMin, setExperienceMin] = useState(job.experience_years || 0)
  const [skills, setSkills] = useState(() => {
    try { const arr = JSON.parse(job.skills || '[]'); return Array.isArray(arr) ? arr.join(', ') : (job.skills || '') } catch { return job.skills || '' }
  })
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Candidate[]>([])
  const [searched, setSearched] = useState(false)
  const [searchError, setSearchError] = useState('')

  // CV state
  const [dragging, setDragging] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [parsedFile, setParsedFile] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ALL_PLATFORMS = ['work.ua', 'robota.ua', 'djinni.co', 'hh.ua']
  function togglePlatform(p: string) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  async function doSearch() {
    if (!query || platforms.length === 0) return
    setSearching(true); setSearchError(''); setSearched(false)
    const res = await api.scraper.search({ query, location, count, platforms, jobId: job.id, salaryMin, salaryMax, experienceMin, skills })
    setSearching(false); setSearched(true)
    if (res.error) { setSearchError(res.error); return }
    setSearchResults(res.data || [])
    if (res.data && res.data.length > 0) onAdd(res.data)
  }

  async function handleFile(file: File) {
    if (!file) return
    setParsing(true); setParseError(''); setParsedFile(file.name)

    const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain')

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        let content: string
        if (mimeType === 'application/pdf') {
          const arr = e.target?.result as ArrayBuffer
          const bytes = new Uint8Array(arr)
          let binary = ''
          for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
          content = btoa(binary)
        } else {
          content = e.target?.result as string
        }

        const res = await api.cv.parse(file.name, content, mimeType, job.id)
        if (res.error) { setParseError(res.error); setParsing(false); return }
        if (res.data) { onAdd([res.data]); onClose() }
      } catch (err) {
        setParseError((err as Error).message)
      }
      setParsing(false)
    }

    if (mimeType === 'application/pdf') {
      reader.readAsArrayBuffer(file)
    } else {
      reader.readAsText(file)
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
      background: 'var(--surface)', boxShadow: 'var(--shadow-lg)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div className="flex items-center justify-between mb-16">
          <h3 className="t-15 medium">{tap.title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}>{iconClose}</button>
        </div>
        <div style={{ display: 'flex', gap: 0, background: 'var(--surface-2)', borderRadius: 10, padding: 3 }}>
          {[['scraper', tap.modeSearch], ['cv', tap.modeCV]].map(([v, l]) => (
            <button key={v} onClick={() => setMode(v as 'scraper' | 'cv')} style={{
              flex: 1, background: mode === v ? 'var(--surface)' : 'none',
              border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 12,
              fontWeight: 500, cursor: 'pointer', color: mode === v ? 'var(--text-1)' : 'var(--text-2)',
              boxShadow: mode === v ? 'var(--shadow-sm)' : 'none',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {mode === 'scraper' && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <label className="form-label">{tap.search}</label>
              <input className="form-input" value={query} onChange={e => setQuery(e.target.value)} placeholder={tap.searchPlaceholder} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 10, marginBottom: 12 }}>
              <div>
                <label className="form-label">{tap.city}</label>
                <select className="form-input" value={location} onChange={e => setLocation(e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">{tap.count}</label>
                <input className="form-input" type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))} style={{ MozAppearance: 'textfield' } as React.CSSProperties} />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="form-label">{tap.skills}</label>
              <input className="form-input" value={skills} onChange={e => setSkills(e.target.value)} placeholder={tap.searchPlaceholder} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className="form-label">{tap.experienceMin}</label>
              <input className="form-input" type="number" min={0} max={30} value={experienceMin} onChange={e => setExperienceMin(+e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label className="form-label">{tap.salaryMin}</label>
                <input className="form-input" type="number" min={0} step={1000} value={salaryMin} onChange={e => setSalaryMin(+e.target.value)} />
              </div>
              <div>
                <label className="form-label">{tap.salaryMax}</label>
                <input className="form-input" type="number" min={0} step={1000} value={salaryMax} onChange={e => setSalaryMax(+e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">{tap.platforms}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {ALL_PLATFORMS.map(p => (
                  <div
                    key={p}
                    onClick={() => togglePlatform(p)}
                    style={{
                      padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: 'pointer',
                      background: platforms.includes(p) ? 'var(--accent)' : 'var(--surface-2)',
                      color: platforms.includes(p) ? '#fff' : 'var(--text-2)',
                      border: `1px solid ${platforms.includes(p) ? 'var(--accent)' : 'var(--border)'}`,
                      transition: 'all 120ms ease',
                    }}
                  >{p}</div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" onClick={doSearch}
              disabled={searching || !query} style={{ width: '100%' }}>
              {searching
                ? <span className="spinner" />
                : <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6.5" cy="6.5" r="4.5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>
              }
              {searching ? tap.searching : tap.startSearch}
            </button>

            {searchError && <p style={{ color: 'var(--err)', fontSize: 12, marginTop: 12 }}>{searchError}</p>}

            {searched && searchResults.length === 0 && (
              <div className="empty-state" style={{ padding: 24, marginTop: 20 }}>
                <p className="t-12">{tap.noResults}</p>
              </div>
            )}

            {searched && searchResults.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <p className="t-12 c-2 mb-12">{tap.resultsAdded(searchResults.length)}</p>
                {searchResults.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                      {c.initials || '?'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="t-12 medium truncate">{c.role}</div>
                      <div className="t-11 c-3">{c.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === 'cv' && (
          <div>
            <p className="t-12 c-2 mb-20">{tap.cvImportHint}</p>

            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 12, padding: '40px 20px', textAlign: 'center', cursor: 'pointer',
                background: dragging ? 'var(--accent)11' : 'var(--surface-2)',
                transition: 'border-color 150ms ease, background 150ms ease',
                marginBottom: 16,
              }}>
              <div style={{ color: 'var(--text-3)', marginBottom: 8 }}>{iconUpload}</div>
              <div className="t-13 medium mb-4">{tap.dropCV}</div>
              <div className="t-11 c-3">{tap.orClick}</div>
              <div className="t-11 c-3 mt-8">{tap.pdfSupported}</div>
            </div>

            <input ref={fileInputRef} type="file" accept=".pdf,.txt" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

            {parsing && (
              <div className="flex items-center gap-10">
                <span className="spinner" />
                <span className="t-12 c-2">{tap.parsing(parsedFile)}</span>
              </div>
            )}

            {parseError && <p style={{ color: 'var(--err)', fontSize: 12 }}>{parseError}</p>}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <p className="t-10 c-3">{tap.disclaimer}</p>
      </div>
    </div>
  )
}
