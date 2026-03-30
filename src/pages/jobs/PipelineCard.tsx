import { Candidate, Job } from '../../api/client'
import { PLATFORM_COLOR } from './constants'
import { iconStar, iconTrash } from './icons'
import { parseProfile } from './helpers'
import { T } from '../../i18n'
import { useAppStore } from '../../store/useAppStore'

const STAGE_COLORS: Record<string, { bg: string; color: string }> = {
  new:              { bg: 'var(--surface-3)',  color: 'var(--text-3)' },
  prequalification: { bg: '#D0E4F8',           color: '#2563EB' },
  interview:        { bg: '#FEE8D0',           color: '#D9780A' },
  decision:         { bg: '#D0F0E4',           color: '#2E9460' },
}

export function PipelineCard({ candidate, job: _job, onDelete, onClick, onStageAdvance }: {
  candidate: Candidate
  job: Job
  onDelete: (id: number) => void
  onClick: () => void
  onStageAdvance?: (id: number, newStage: string) => void
}) {
  const { uiLang } = useAppStore()
  const stages = T[uiLang].stages
  const profile = parseProfile(candidate.profile_data)
  const platformColor = PLATFORM_COLOR[candidate.source_platform] || 'var(--text-3)'

  const scoreColor = candidate.qualification_score == null ? 'var(--text-3)'
    : candidate.qualification_score >= 70 ? 'var(--ok)'
    : candidate.qualification_score >= 40 ? '#d97706'
    : 'var(--err)'

  const STAGE_ORDER = ['new', 'prequalification', 'interview', 'decision'] as const
  const currentStageIdx = STAGE_ORDER.indexOf(candidate.stage as typeof STAGE_ORDER[number])
  const nextStage = currentStageIdx < STAGE_ORDER.length - 1 ? STAGE_ORDER[currentStageIdx + 1] : null
  const stageConf = STAGE_COLORS[candidate.stage] || STAGE_COLORS.new

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)', borderRadius: 16, boxShadow: 'var(--shadow-sm)',
        padding: '12px 14px', cursor: 'pointer', position: 'relative',
        transition: 'box-shadow 150ms ease',
        display: 'flex', flexDirection: 'column', gap: 8,
        borderTop: `3px solid ${stageConf.color}`,
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
    >
      {/* Top row: avatar + name + score */}
      <div className="flex items-center justify-between" style={{ gap: 8, overflow: 'hidden' }}>
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

        {/* Score badge — prominent */}
        {candidate.qualification_score != null ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            background: scoreColor + '18', color: scoreColor,
            fontSize: 12, fontWeight: 700, flexShrink: 0,
            padding: '3px 8px', borderRadius: 8,
          }}>
            {iconStar} {candidate.qualification_score}
          </div>
        ) : (
          <div style={{
            fontSize: 10, color: 'var(--text-3)', flexShrink: 0,
            padding: '3px 8px', borderRadius: 8, background: 'var(--surface-2)',
          }}>
            —
          </div>
        )}
      </div>

      {/* Skills preview */}
      {profile?.skills?.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {(profile.skills as string[]).slice(0, 3).map((s: string, i: number) => (
            <span key={i} style={{ fontSize: 9, padding: '1px 5px', background: 'var(--surface-2)', borderRadius: 3, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{s}</span>
          ))}
        </div>
      )}

      {/* Bottom row: platform + stage + actions */}
      <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
        <div className="flex items-center gap-6">
          <span style={{
            fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
            background: platformColor + '22', color: platformColor,
          }}>
            {candidate.source_platform === 'cv_import' ? 'CV' : candidate.source_platform}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
            background: stageConf.bg, color: stageConf.color,
          }}>
            {stages[candidate.stage as keyof typeof stages] || candidate.stage}
          </span>
        </div>

        <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
          {/* Advance stage button */}
          {nextStage && onStageAdvance && (
            <button
              onClick={() => onStageAdvance(candidate.id, nextStage)}
              title={`→ ${stages[nextStage as keyof typeof stages]}`}
              style={{
                background: 'var(--surface-2)', border: 'none', borderRadius: 4, cursor: 'pointer',
                color: 'var(--text-2)', padding: '2px 6px', fontSize: 9, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 2,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = stageConf.bg; e.currentTarget.style.color = stageConf.color }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-2)' }}
            >
              → {stages[nextStage as keyof typeof stages]}
            </button>
          )}
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
