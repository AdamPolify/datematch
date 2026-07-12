import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { Card } from '../components/ui'
import MatchOverlay from '../components/MatchOverlay'
import type { Match } from '../types'

export default function Matches() {
  const { matches } = useApp()
  const [selected, setSelected] = useState<Match | null>(null)

  return (
    <div className="px-5 pb-8 pt-6">
      <h1 className="mb-1 text-2xl font-bold text-[var(--color-ink)]">
        Your matches
      </h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        You both swiped yes. No more "I don't know, what do you want?"
      </p>

      {matches.length === 0 ? (
        <Card className="text-center text-sm text-[var(--color-muted)]">
          Nothing yet — go swipe on the home tab and find your first match.
        </Card>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <button
              key={match.id}
              onClick={() => setSelected(match)}
              className="flex w-full items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left"
            >
              <span className="text-3xl">{match.card.image}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[var(--color-ink)]">
                  {match.card.title}
                </p>
                <p className="truncate text-xs text-[var(--color-muted)]">
                  {match.card.reason}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-black/30 px-2 py-1 text-[10px] font-semibold uppercase text-[var(--color-muted)]">
                {match.card.kind}
              </span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <MatchOverlay match={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
