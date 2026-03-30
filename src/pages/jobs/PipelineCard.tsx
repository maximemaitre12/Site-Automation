import { Candidate, Job } from '../../api/client'
import { PLATFORM_COLOR } from './constants'
import { iconStar, iconTrash } from './icons'
import { parseProfile } from './helpers'

export function PipelineCard({ candidate, job: _job, onDelete, onClick }: {
  candidate: Candidate
  job: Job
  onDelete: (id: number) => void
  onClick: () => void
}) {
  const profile = parseProfile(candidate.profile_data)
  const platformColor = PLATFORM_COLOR[candidate.source_platform] || 'var(--text-3)'
  const scoreColor = candidate.qualification_score == null ? undefined
    : candidate.qualification_score >= 70 ? 'var(--ok)'
    : candidate.qualification_score >= 40 ? '#d97706'
    : 'var(--err)'

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)', borderRadius: 16, boxShadow: 'var(--shadow-sm)',
        padding: '12px 14px', cursor: 'pointer', position: 'relative',
        transition: 'box-shadow 150ms ease',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-8" style={{ gap: 8, overflow: 'hidden' }}>
        <div className="flex items-center gap-8" style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, color: 'var(--text-1)', flexShrink: 0,
          }}>
            {candidate.initials || '?'}
          </div>
          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
            <div className="t-12 medium truncate">{candidate.role}</div>
            <div className="t-11 c-3 truncate">{candidate.location}</div>
          </div>
        </div>
        {candidate.qualification_score != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: scoreColor, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
            {iconStar} {candidate.qualification_score}
          </div>
        )}
      </div>

      {/* Skills preview */}
      {profile?.skills?.length > 0 && (
        <div className="flex flex-wrap gap-3" style={{ marginBottom: 8 }}>
          {(profile.skills as string[]).slice(0, 3).map((s: string, i: number) => (
            <span key={i} style={{ fontSize: 9, padding: '1px 5px', background: 'var(--surface-2)', borderRadius: 3, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{s}</span>
          ))}
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
        <span style={{
          fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
          background: platformColor + '22', color: platformColor,
        }}>
          {candidate.source_platform === 'cv_import' ? 'CV' : candidate.source_platform}
        </span>

        <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onDelete(candidate.id)}
            title="Supprimer"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '2px 4px', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--err)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
            {iconTrash}
          </button>
        </div>
      </div>
    </div>
  )
}
