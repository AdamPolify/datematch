import type { AnyCard } from '../types'
import { MOOD_EMOJI } from '../data/options'

function KindBadge({ kind }: { kind: AnyCard['kind'] }) {
  const labels: Record<AnyCard['kind'], string> = {
    movie: '🎬 Movie / Show',
    food: '🍽️ Food',
    snack: '🍿 Snack',
    drink: '🍹 Drink',
    bundle: '🌙 Full Date Night',
  }
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
      {labels[kind]}
    </span>
  )
}

function MoodTags({ mood }: { mood: AnyCard['mood'] }) {
  if (mood.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {mood.map((m) => (
        <span
          key={m}
          className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white"
        >
          {MOOD_EMOJI[m]} {m}
        </span>
      ))}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-white/60">
        {label}
      </p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

export default function DateCard({ card }: { card: AnyCard }) {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[28px] bg-gradient-to-b from-[var(--color-surface-2)] via-[var(--color-surface)] to-[var(--color-base-2)] p-5 text-white shadow-2xl">
      <div className="flex items-center justify-between">
        <KindBadge kind={card.kind} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-4">
        <div className="text-8xl">{card.image}</div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          {card.title}
        </h2>
        <MoodTags mood={card.mood} />
      </div>

      <div className="space-y-3">
        {card.kind === 'movie' && (
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Genre" value={card.genre.join(', ')} />
            <Stat label="Runtime" value={`${card.runtimeMinutes} min`} />
            <Stat label="Platform" value={card.platform} />
            <Stat label="Rating" value={card.rating} />
          </div>
        )}

        {card.kind === 'food' && (
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Cuisine" value={card.cuisine} />
            <Stat label="Price" value={card.priceLevel} />
            <Stat label="Method" value={card.method} />
            <Stat label="Time" value={`${card.timeMinutes} min`} />
            {card.dietaryTags.length > 0 && (
              <Stat label="Dietary" value={card.dietaryTags.join(', ')} />
            )}
          </div>
        )}

        {card.kind === 'snack' && (
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Flavor" value={card.flavor} />
            <Stat label="Source" value={card.source} />
            <Stat label="Pairing" value={card.pairing} />
          </div>
        )}

        {card.kind === 'drink' && (
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Type" value={card.alcoholic ? 'Alcoholic' : 'Non-alcoholic'} />
            <Stat label="Difficulty" value={card.difficulty} />
            <Stat label="Pairing" value={card.pairing} />
          </div>
        )}

        {card.kind === 'bundle' && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-white/10 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-white/60">Food</p>
                <p className="font-medium">{card.food.image} {card.food.title}</p>
              </div>
              <div className="rounded-xl bg-white/10 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-white/60">Watch</p>
                <p className="font-medium">{card.movie.image} {card.movie.title}</p>
              </div>
              <div className="rounded-xl bg-white/10 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-white/60">Snack</p>
                <p className="font-medium">{card.snack.image} {card.snack.title}</p>
              </div>
              <div className="rounded-xl bg-white/10 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-white/60">Drink</p>
                <p className="font-medium">{card.drink.image} {card.drink.title}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat
                label="Est. time"
                value={`${Math.round(card.estimatedTimeMinutes / 60 * 10) / 10}h`}
              />
              <Stat label="Est. cost" value={card.estimatedCost} />
            </div>
          </div>
        )}

        <p className="rounded-xl bg-white/5 px-3 py-2 text-center text-xs italic text-white/80">
          "{card.reason}"
        </p>
      </div>
    </div>
  )
}
