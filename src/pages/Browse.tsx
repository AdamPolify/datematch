import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { Card, SectionTitle } from '../components/ui'
import CardArt from '../components/CardArt'
import { bundles, movies, foods, snacks, drinks } from '../data'
import type { AnyCard, SwipeMode } from '../types'

const MODES: { mode: SwipeMode; label: string; icon: string; desc: string }[] = [
  { mode: 'food', label: 'Food', icon: '🍽️', desc: 'Restaurants, takeout & recipes' },
  { mode: 'movie', label: 'Movies & Shows', icon: '🎬', desc: 'Something to watch together' },
  { mode: 'snack', label: 'Snacks', icon: '🍿', desc: 'Sweet, salty, or spicy' },
  { mode: 'drink', label: 'Drinks', icon: '🍹', desc: 'Cocktails, mocktails & more' },
  { mode: 'quick', label: 'Quick Match', icon: '⚡', desc: 'A few pre-built bundles, fast' },
]

const allCards: AnyCard[] = [...bundles, ...movies, ...foods, ...snacks, ...drinks]

export default function Browse() {
  const { favorites } = useApp()
  const navigate = useNavigate()

  const favoriteCards = favorites
    .map((id) => allCards.find((c) => c.id === id))
    .filter((c): c is AnyCard => Boolean(c))

  return (
    <div className="px-5 pb-8 pt-6">
      <h1 className="mb-1 text-2xl font-bold text-[var(--color-ink)]">
        Browse by category
      </h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Just want to pick a movie, or food, on its own? Start here.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-3">
        {MODES.map((m) => (
          <button
            key={m.mode}
            onClick={() => navigate(`/swipe/${m.mode}`)}
            className="flex flex-col items-start gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left transition-transform active:scale-[0.97]"
          >
            <span className="text-2xl">{m.icon}</span>
            <span className="font-semibold text-[var(--color-ink)]">
              {m.label}
            </span>
            <span className="text-xs text-[var(--color-muted)]">{m.desc}</span>
          </button>
        ))}
      </div>

      <div>
        <SectionTitle>Saved favorites</SectionTitle>
        {favoriteCards.length === 0 ? (
          <Card className="text-center text-sm text-[var(--color-muted)]">
            Save cards you love while swiping to find them here.
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {favoriteCards.slice(0, 9).map((card) => (
              <div
                key={card.id}
                className="flex flex-col items-center gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
              >
                <CardArt
                  image={card.image}
                  alt={card.title}
                  imgClassName="h-16 w-12 rounded-md object-cover"
                  emojiClassName="text-2xl"
                />
                <span className="line-clamp-2 text-center text-[11px] font-medium text-[var(--color-ink)]">
                  {card.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
