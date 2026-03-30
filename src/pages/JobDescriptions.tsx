import { useEffect, useState } from 'react'
import { api, Job } from '../api/client'
import { useAppStore } from '../store/useAppStore'
import { T } from '../i18n'
import { EMPTY_JOB } from './jobs/constants'
import { iconTrash } from './jobs/icons'
import { JobForm } from './jobs/JobForm'
import { PipelineView } from './jobs/PipelineView'

export function JobDescriptions() {
  const { uiLang } = useAppStore()
  const tj = T[uiLang].jobs
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [candidateCounts, setCandidateCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    api.jobs.list().then(r => {
      if (r.data) {
        setJobs(r.data)
        r.data.forEach(job => {
          api.candidates.list(job.id).then(cr => {
            if (cr.data) setCandidateCounts(prev => ({ ...prev, [job.id]: cr.data!.length }))
          })
        })
      }
      setLoading(false)
    })
  }, [])

  async function deleteJob(id: number) {
    if (!confirm(tj.deleteConfirm)) return
    await api.jobs.remove(id)
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  if (selectedJob) {
    return (
      <div className="page-pipeline">
        <PipelineView job={selectedJob} onBack={() => setSelectedJob(null)} />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">{tj.title}</h1>
            <p className="page-desc">{tj.desc}</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingJob(null); setShowForm(true) }}>
            {tj.newJob}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-8">
          <span className="spinner" /><span className="c-2">{tj.loading}</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <p>{tj.noJobs}</p>
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setShowForm(true)}>{tj.createJob}</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {jobs.map(job => {
            const count = candidateCounts[job.id] ?? 0
            const skills = (() => { try { return JSON.parse(job.skills || '[]') as string[] } catch { return [] } })()
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                style={{
                  background: 'var(--surface)', borderRadius: 16, boxShadow: 'var(--shadow-sm)',
                  padding: '20px 22px', cursor: 'pointer', transition: 'box-shadow 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
              >
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <div className="t-14 medium">{job.title}</div>
                    <div className="t-11 c-3 mt-4">{job.location}</div>
                  </div>
                  <div className="flex items-center gap-6" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { setEditingJob(job); setShowForm(true) }}
                      style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'var(--text-2)', padding: '5px 10px', fontSize: 11, fontWeight: 500 }}>
                      {tj.edit}
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4, display: 'flex', alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--err)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                      {iconTrash}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <span className="t-11 c-2">{job.salary_min?.toLocaleString()}–{job.salary_max?.toLocaleString()} UAH</span>
                  <span className="t-11 c-3">·</span>
                  <span className="t-11 c-2">{tj.expYears(job.experience_years)}</span>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-4" style={{ marginBottom: 12 }}>
                    {skills.slice(0, 4).map((s, i) => (
                      <span key={i} style={{ fontSize: 10, padding: '2px 6px', background: 'var(--surface-2)', borderRadius: 4, color: 'var(--text-3)' }}>{s}</span>
                    ))}
                    {skills.length > 4 && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>+{skills.length - 4}</span>}
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {tj.candidates(count)}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: job.is_active ? 'var(--ok-bg)' : 'var(--surface-2)', color: job.is_active ? 'var(--ok)' : 'var(--text-3)' }}>
                    {job.is_active ? tj.active : tj.inactive}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <JobForm
          initial={editingJob || EMPTY_JOB}
          onSave={saved => {
            setJobs(prev => editingJob ? prev.map(j => j.id === saved.id ? saved : j) : [saved, ...prev])
            setShowForm(false)
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
