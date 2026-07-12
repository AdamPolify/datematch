import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { Card, SectionTitle, SecondaryButton } from '../components/ui'
import CardArt from '../components/CardArt'
import type { DateNightPlan } from '../types'

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-center">
      <p className="text-2xl font-extrabold text-[var(--color-hot-pink)]">{value}</p>
      <p className="text-[11px] text-[var(--color-muted)]">{label}</p>
    </div>
  )
}

function StarRow({
  rating,
  onRate,
}: {
  rating: number | null
  onRate: (rating: number) => void
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onRate(n)}
          aria-label={`Rate ${n} stars`}
          className="text-xl leading-none"
        >
          {rating !== null && n <= rating ? '★' : '☆'}
        </button>
      ))}
    </div>
  )
}

function UpcomingCard({
  plan,
  onOpen,
  onMarkDone,
}: {
  plan: DateNightPlan
  onOpen: () => void
  onMarkDone: () => void
}) {
  const { bundle } = plan
  return (
    <Card className="flex items-center gap-3 overflow-hidden">
      <button onClick={onOpen} className="shrink-0">
        <CardArt
          image={bundle.movie.image}
          alt={bundle.title}
          imgClassName="h-16 w-12 rounded-lg object-cover"
          emojiClassName="text-3xl"
        />
      </button>
      <button onClick={onOpen} className="block min-w-0 flex-1 text-left">
        <p className="truncate font-semibold text-[var(--color-ink)]">
          {bundle.title}
        </p>
        <p className="truncate text-xs text-[var(--color-muted)]">
          {plan.startTime} · {bundle.food.title}
        </p>
      </button>
      <button
        onClick={onMarkDone}
        className="shrink-0 whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-base-2)] px-3 py-2 text-xs font-medium text-[var(--color-ink)]"
      >
        Mark as done
      </button>
    </Card>
  )
}

function PastCard({ plan }: { plan: DateNightPlan }) {
  const { updatePlan } = useApp()
  const [editingMemory, setEditingMemory] = useState(false)
  const [draft, setDraft] = useState(plan.memory ?? '')
  const { bundle } = plan

  const dateLabel = plan.completedAt
    ? new Date(plan.completedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <Card>
      <div className="flex items-center gap-3">
        <CardArt
          image={bundle.movie.image}
          alt={bundle.title}
          imgClassName="h-16 w-12 shrink-0 rounded-lg object-cover"
          emojiClassName="shrink-0 text-3xl"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-[var(--color-ink)]">
            {bundle.title}
          </p>
          <p className="truncate text-xs text-[var(--color-muted)]">{dateLabel}</p>
        </div>
        <StarRow
          rating={plan.rating}
          onRate={(rating) => updatePlan(plan.id, { rating })}
        />
      </div>

      {editingMemory ? (
        <div className="mt-3 space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="How did it go? What do you want to remember?"
            rows={3}
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-base-2)] px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-hot-pink)]"
          />
          <div className="flex gap-2">
            <SecondaryButton
              className="text-sm"
              onClick={() => {
                updatePlan(plan.id, { memory: draft.trim() || null })
                setEditingMemory(false)
              }}
            >
              Save memory
            </SecondaryButton>
          </div>
        </div>
      ) : plan.memory ? (
        <button
          onClick={() => setEditingMemory(true)}
          className="mt-3 w-full rounded-2xl bg-[var(--color-surface-2)] p-3 text-left text-sm italic text-[var(--color-ink)]"
        >
          "{plan.memory}"
        </button>
      ) : (
        <button
          onClick={() => setEditingMemory(true)}
          className="mt-3 text-sm font-medium text-[var(--color-hot-pink)]"
        >
          + Add a memory
        </button>
      )}
    </Card>
  )
}

export default function Dates() {
  const { plans, updatePlan } = useApp()
  const navigate = useNavigate()

  const upcoming = plans.filter((p) => !p.completed)
  const past = plans.filter((p) => p.completed)

  const stats = useMemo(() => {
    const cuisines = new Set(past.map((p) => p.bundle.food.cuisine))
    const movies = new Set(past.map((p) => p.bundle.movie.title))
    return {
      completed: past.length,
      cuisines: cuisines.size,
      movies: movies.size,
    }
  }, [past])

  return (
    <div className="px-5 pb-8 pt-6">
      <h1 className="mb-1 text-2xl font-bold text-[var(--color-ink)]">
        Your dates
      </h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Everything you've planned and everything you've tried.
      </p>

      <div className="mb-8 flex gap-3">
        <StatTile value={stats.completed} label="Date nights" />
        <StatTile value={stats.cuisines} label="Cuisines tried" />
        <StatTile value={stats.movies} label="Movies watched" />
      </div>

      <div className="mb-8">
        <SectionTitle>Upcoming</SectionTitle>
        {upcoming.length === 0 ? (
          <Card className="text-center text-sm text-[var(--color-muted)]">
            No date nights planned yet. Match on a Full Date Night to add one.
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map((plan) => (
              <UpcomingCard
                key={plan.id}
                plan={plan}
                onOpen={() => navigate(`/plan/${plan.id}`)}
                onMarkDone={() =>
                  updatePlan(plan.id, { completed: true, completedAt: Date.now() })
                }
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionTitle>Past dates</SectionTitle>
        {past.length === 0 ? (
          <Card className="text-center text-sm text-[var(--color-muted)]">
            Mark a date night as done to start your history.
          </Card>
        ) : (
          <div className="space-y-3">
            {past
              .slice()
              .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
              .map((plan) => (
                <PastCard key={plan.id} plan={plan} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
