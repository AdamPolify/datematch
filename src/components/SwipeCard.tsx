import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useDragControls, useMotionValue } from 'framer-motion'
import type { AnyCard } from '../types'
import { MOOD_EMOJI } from '../data/options'

const PEEK_HEIGHT = 44

function timeLabel(card: AnyCard): string | null {
  switch (card.kind) {
    case 'movie':
      return `${card.runtimeMinutes}m`
    case 'food':
      return `${card.timeMinutes}m`
    case 'bundle':
      return `${Math.round((card.estimatedTimeMinutes / 60) * 10) / 10}h`
    default:
      return null
  }
}

function MoodTags({ mood, limit }: { mood: AnyCard['mood']; limit?: number }) {
  const shown = limit ? mood.slice(0, limit) : mood
  if (shown.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((m) => (
        <span
          key={m}
          className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-ink)]"
        >
          {MOOD_EMOJI[m]} {m}
        </span>
      ))}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface-2)] px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </p>
      <p className="text-sm font-semibold text-[var(--color-ink)]">{value}</p>
    </div>
  )
}

function kindLabel(kind: AnyCard['kind']): string {
  const labels: Record<AnyCard['kind'], string> = {
    movie: '🎬 Movie / Show',
    food: '🍽️ Food',
    snack: '🍿 Snack',
    drink: '🍹 Drink',
    bundle: '🌙 Full Date Night',
  }
  return labels[kind]
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

function DetailList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-1 text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </p>
      <ul className="list-inside list-disc space-y-0.5 text-sm text-[var(--color-ink)]">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  )
}

function DetailSteps({ label, steps }: { label: string; steps: string[] }) {
  return (
    <div>
      <p className="mb-1 text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </p>
      <ol className="space-y-1 text-sm text-[var(--color-ink)]">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-2">
            <span className="font-bold text-[var(--color-hot-pink)]">
              {i + 1}.
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  )
}

function DetailBody({ card }: { card: AnyCard }) {
  if (card.kind === 'movie') {
    return (
      <>
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Genre" value={card.genre.join(', ')} />
          <Stat label="Runtime" value={`${card.runtimeMinutes} min`} />
          <Stat label="Platform" value={card.platform} />
          <Stat label="Rating" value={card.rating} />
        </div>
        <p className="text-sm leading-relaxed text-[var(--color-ink)]">
          {card.synopsis}
        </p>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
            Cast
          </p>
          <p className="text-sm text-[var(--color-ink)]">{card.cast.join(', ')}</p>
        </div>
      </>
    )
  }

  if (card.kind === 'food') {
    return (
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
        <DetailList
          label={card.method === 'cook at home' ? 'Ingredients' : 'What you get'}
          items={card.ingredients}
        />
        <DetailSteps
          label={card.method === 'cook at home' ? 'Steps' : 'How it works'}
          steps={card.steps}
        />
      </>
    )
  }

  if (card.kind === 'snack') {
    return (
      <>
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Flavor" value={card.flavor} />
          <Stat label="Source" value={card.source} />
          <Stat label="Pairing" value={card.pairing} />
        </div>
        <DetailList label="Ingredients" items={card.ingredients} />
        <DetailSteps label="Steps" steps={card.steps} />
      </>
    )
  }

  if (card.kind === 'drink') {
    return (
      <>
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Type" value={card.alcoholic ? 'Alcoholic' : 'Non-alcoholic'} />
          <Stat label="Difficulty" value={card.difficulty} />
          <Stat label="Pairing" value={card.pairing} />
        </div>
        <DetailList label="Ingredients" items={card.ingredients} />
        <DetailSteps label="Steps" steps={card.steps} />
      </>
    )
  }

  return (
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
        <div key={label} className="rounded-xl bg-[var(--color-surface-2)] p-2.5">
          <p className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
            {label}
          </p>
          <p className="text-sm font-medium text-[var(--color-ink)]">{item.title}</p>
          <p className="mt-0.5 text-xs italic text-[var(--color-muted)]">
            "{item.reason}"
          </p>
        </div>
      ))}
    </>
  )
}

function Backdrop({ image, title }: { image: string; title: string }) {
  if (image.startsWith('http')) {
    return (
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
    )
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[var(--color-surface-2)] via-[var(--color-surface)] to-[var(--color-base-2)]">
      <span className="text-9xl">{image}</span>
    </div>
  )
}

export default function SwipeCard({
  card,
  interactive = true,
  onSwipeLeft,
  onSwipeRight,
}: {
  card: AnyCard
  interactive?: boolean
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const dragControls = useDragControls()
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardHeight, setCardHeight] = useState(540)

  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const update = () => setCardHeight(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const sheetHeight = Math.max(cardHeight - 24, 0)
  const collapsedOffset = Math.max(sheetHeight - PEEK_HEIGHT, 0)

  const y = useMotionValue(collapsedOffset)

  useEffect(() => {
    const controls = animate(y, expanded ? 0 : collapsedOffset, {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, collapsedOffset])

  const time = timeLabel(card)
  const topMood = card.mood[0]

  return (
    <div ref={cardRef} className="relative h-full w-full">
      <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[var(--color-base-2)] shadow-2xl">
        <Backdrop image={card.image} title={card.title} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div
          className="absolute inset-x-5 flex flex-col items-center gap-3 text-center"
          style={{ top: '29%' }}
        >
          <h2
            className="text-[26px] font-black leading-[1.1] text-white drop-shadow-lg"
            style={{ fontFamily: "'Nunito','Poppins',sans-serif" }}
          >
            {card.title}
          </h2>
          <p className="line-clamp-1 text-sm text-white/70">{card.reason}</p>
          <div className="flex items-center gap-2">
            {time && (
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1.5 text-sm font-medium text-white shadow-[inset_0_0_16px_rgba(255,255,255,0.3)] backdrop-blur">
                <img src="home/hourglass.svg" alt="" className="h-[14px] w-[14px]" />
                {time}
              </span>
            )}
            {topMood && (
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1.5 text-sm font-medium capitalize text-white shadow-[inset_0_0_16px_rgba(255,255,255,0.3)] backdrop-blur">
                <img src="home/moonstar.svg" alt="" className="h-[14px] w-[14px]" />
                {topMood}
              </span>
            )}
          </div>
        </div>

        <motion.div
          drag={interactive ? 'y' : false}
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{ top: 0, bottom: collapsedOffset }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.y < -40 || info.velocity.y < -300) setExpanded(true)
            else if (info.offset.y > 40 || info.velocity.y > 300) setExpanded(false)
          }}
          style={{ y, height: sheetHeight }}
          className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-[28px] bg-[var(--color-surface)] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
        >
          <div
            onPointerDown={(e) => {
              if (!interactive) return
              e.stopPropagation()
              dragControls.start(e)
            }}
            onClick={() => setExpanded((v) => !v)}
            className="flex shrink-0 cursor-grab flex-col items-center gap-2 pb-1 pt-2.5 active:cursor-grabbing"
          >
            <div className="h-1 w-10 rounded-full bg-[var(--color-border)]" />
          </div>

          {!expanded && (
            <p className="shrink-0 pb-4 text-center text-xs text-[var(--color-muted)]">
              Swipe up for the full recipe
            </p>
          )}

          <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-6">
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <MoodTags mood={card.mood} limit={2} />
              <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-muted)]">
                {briefStat(card)}
              </span>
              <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-muted)]">
                {kindLabel(card.kind)}
              </span>
            </div>
            <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
              <DetailBody card={card} />
            </div>
          </div>
        </motion.div>
      </div>

      {interactive && (
        <div className="absolute left-1/2 -bottom-8 z-20 flex -translate-x-1/2 items-center gap-[7px]">
          <button
            onClick={onSwipeLeft}
            aria-label="Pass"
            className="flex h-16 w-16 items-center justify-center rounded-full border-[0.5px] border-white/30 bg-black/20 shadow-[0_8px_15px_rgba(0,0,0,0.15)] backdrop-blur-md active:scale-90"
          >
            <img src="home/close.svg" alt="" className="h-8 w-8" />
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label="Details"
            className="flex h-16 w-16 items-center justify-center rounded-full border-[0.5px] border-white/30 bg-black/20 shadow-[0_8px_15px_rgba(0,0,0,0.15)] backdrop-blur-md active:scale-90"
          >
            <img src="home/info.svg" alt="" className="h-8 w-8" />
          </button>
          <button
            onClick={onSwipeRight}
            aria-label="Like"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[var(--color-hot-pink)] to-[var(--color-warm-orange)] shadow-[inset_0_0_15px_rgba(255,255,255,0.4)] active:scale-90"
          >
            <img src="home/heart.svg" alt="" className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  )
}
