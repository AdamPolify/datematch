import type { AnyCard } from '../types'
import { MOOD_EMOJI } from '../data/options'
import CardArt from './CardArt'

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

function MoodTags({ mood, limit }: { mood: AnyCard['mood']; limit?: number }) {
  const shown = limit ? mood.slice(0, limit) : mood
  if (shown.length === 0) return null
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {shown.map((m) => (
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

function FlipHint({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/70">
      ↻ {label}
    </span>
  )
}

function flipLabel(kind: AnyCard['kind']): string {
  switch (kind) {
    case 'movie':
      return 'Tap for the full details'
    case 'bundle':
      return 'Tap for the full plan'
    default:
      return 'Tap for the full recipe'
  }
}

function briefStat(card: AnyCard): string {
  switch (card.kind) {
    case 'movie':
      return `${card.platform} · ${card.runtimeMinutes}m`
    case 'food':
      return `${card.cuisine} · ${card.priceLevel}`
    case 'snack':
      return `${card.flavor} · ${card.source}`
    case 'drink':
      return card.alcoholic ? 'Alcoholic' : 'Non-alcoholic'
    case 'bundle': {
      const hours = Math.round((card.estimatedTimeMinutes / 60) * 10) / 10
      return `${card.estimatedCost} · ~${hours}h`
    }
  }
}

export function DateCardFront({ card }: { card: AnyCard }) {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[28px] bg-gradient-to-b from-[var(--color-surface-2)] via-[var(--color-surface)] to-[var(--color-base-2)] p-5 text-white shadow-2xl">
      <div className="flex items-center justify-between">
        <KindBadge kind={card.kind} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-4">
        <CardArt
          image={card.image}
          alt={card.title}
          imgClassName="h-48 w-36 rounded-2xl object-cover shadow-xl"
        />
        <h2 className="text-center text-2xl font-bold leading-tight">
          {card.title}
        </h2>
        <MoodTags mood={card.mood} limit={2} />
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
          {briefStat(card)}
        </span>
        <p className="line-clamp-2 px-4 text-center text-sm italic text-white/70">
          "{card.reason}"
        </p>
      </div>

      <div className="flex justify-center">
        <FlipHint label={flipLabel(card.kind)} />
      </div>
    </div>
  )
}

export function DateCardBack({ card }: { card: AnyCard }) {
  return (
    <div className="flex h-full w-full flex-col rounded-[28px] bg-gradient-to-b from-[var(--color-base-2)] via-[var(--color-surface)] to-[var(--color-surface-2)] p-5 text-white shadow-2xl">
      <div className="mb-3 flex items-center justify-between gap-2">
        <KindBadge kind={card.kind} />
        <FlipHint label="Tap to flip back" />
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto">
        <h2 className="mb-2 text-xl font-bold leading-tight">{card.title}</h2>
        <MoodTags mood={card.mood} />

        <div className="mt-3 space-y-3">
          {card.kind === 'movie' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Genre" value={card.genre.join(', ')} />
                <Stat label="Runtime" value={`${card.runtimeMinutes} min`} />
                <Stat label="Platform" value={card.platform} />
                <Stat label="Rating" value={card.rating} />
              </div>
              <p className="text-sm leading-relaxed text-white/85">
                {card.synopsis}
              </p>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wide text-white/50">
                  Cast
                </p>
                <p className="text-sm text-white/85">{card.cast.join(', ')}</p>
              </div>
            </>
          )}

          {card.kind === 'food' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Cuisine" value={card.cuisine} />
                <Stat label="Price" value={card.priceLevel} />
                <Stat label="Method" value={card.method} />
                <Stat label="Time" value={`${card.timeMinutes} min`} />
                {card.dietaryTags.length > 0 && (
                  <Stat label="Dietary" value={card.dietaryTags.join(', ')} />
                )}
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wide text-white/50">
                  {card.method === 'cook at home' ? 'Ingredients' : 'What you get'}
                </p>
                <ul className="list-inside list-disc space-y-0.5 text-sm text-white/85">
                  {card.ingredients.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wide text-white/50">
                  {card.method === 'cook at home' ? 'Steps' : 'How it works'}
                </p>
                <ol className="space-y-1 text-sm text-white/85">
                  {card.steps.map((s, i) => (
                    <li key={s} className="flex gap-2">
                      <span className="font-bold text-[var(--color-hot-pink)]">
                        {i + 1}.
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          {card.kind === 'snack' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Flavor" value={card.flavor} />
                <Stat label="Source" value={card.source} />
                <Stat label="Pairing" value={card.pairing} />
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wide text-white/50">
                  Ingredients
                </p>
                <ul className="list-inside list-disc space-y-0.5 text-sm text-white/85">
                  {card.ingredients.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wide text-white/50">
                  Steps
                </p>
                <ol className="space-y-1 text-sm text-white/85">
                  {card.steps.map((s, i) => (
                    <li key={s} className="flex gap-2">
                      <span className="font-bold text-[var(--color-hot-pink)]">
                        {i + 1}.
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          {card.kind === 'drink' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Stat
                  label="Type"
                  value={card.alcoholic ? 'Alcoholic' : 'Non-alcoholic'}
                />
                <Stat label="Difficulty" value={card.difficulty} />
                <Stat label="Pairing" value={card.pairing} />
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wide text-white/50">
                  Ingredients
                </p>
                <ul className="list-inside list-disc space-y-0.5 text-sm text-white/85">
                  {card.ingredients.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wide text-white/50">
                  Steps
                </p>
                <ol className="space-y-1 text-sm text-white/85">
                  {card.steps.map((s, i) => (
                    <li key={s} className="flex gap-2">
                      <span className="font-bold text-[var(--color-hot-pink)]">
                        {i + 1}.
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          {card.kind === 'bundle' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Stat
                  label="Est. time"
                  value={`${Math.round((card.estimatedTimeMinutes / 60) * 10) / 10}h`}
                />
                <Stat label="Est. cost" value={card.estimatedCost} />
              </div>
              {[
                { label: 'Watch', item: card.movie },
                { label: 'Eat', item: card.food },
                { label: 'Snack', item: card.snack },
                { label: 'Drink', item: card.drink },
              ].map(({ label, item }) => (
                <div key={label} className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5">
                  <CardArt
                    image={item.image}
                    alt={item.title}
                    imgClassName="h-10 w-8 shrink-0 rounded object-cover"
                    emojiClassName="shrink-0 text-xl"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-white/50">
                      {label}
                    </p>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-0.5 text-xs italic text-white/60">
                      "{item.reason}"
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}

          <p className="rounded-xl bg-white/5 px-3 py-2 text-center text-xs italic text-white/80">
            "{card.reason}"
          </p>
        </div>
      </div>
    </div>
  )
}
