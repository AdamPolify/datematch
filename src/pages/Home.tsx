import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { Card, SectionTitle } from '../components/ui'
import PartnerSwitcher from '../components/PartnerSwitcher'
import CardArt from '../components/CardArt'
import { bundles, movies, foods, snacks, drinks } from '../data'
import type { AnyCard, SwipeMode } from '../types'

const MODES: { mode: SwipeMode; label: string; icon: string; desc: string }[] = [
  { mode: 'bundle', label: 'Full Date Night', icon: '🌙', desc: 'Food, then movie, then snack, then drink' },
  { mode: 'food', label: 'Food', icon: '🍽️', desc: 'Restaurants, takeout & recipes' },
  { mode: 'movie', label: 'Movies & Shows', icon: '🎬', desc: 'Something to watch together' },
  { mode: 'snack', label: 'Snacks', icon: '🍿', desc: 'Sweet, salty, or spicy' },
  { mode: 'drink', label: 'Drinks', icon: '🍹', desc: 'Cocktails, mocktails & more' },
  { mode: 'quick', label: 'Quick Match', icon: '⚡', desc: 'A few fast picks, decided now' },
]

const allCards: AnyCard[] = [...bundles, ...movies, ...foods, ...snacks, ...drinks]

export default function Home() {
  const { profile, matches, favorites } = useApp()
  const navigate = useNavigate()

  const partnerAName = profile.partners.A.name || 'You'
  const partnerBName = profile.partners.B.name || 'Partner'

  const favoriteCards = favorites
    .map((id) => allCards.find((c) => c.id === id))
    .filter((c): c is AnyCard => Boolean(c))

  return (
    <div className="px-5 pb-8 pt-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-muted)]">
            {partnerAName} &amp; {partnerBName}
          </p>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">
            What are we doing tonight?
          </h1>
        </div>
        <PartnerSwitcher />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3">
        {MODES.map((m) => (
          <button
            key={m.mode}
            onClick={() =>
              navigate(m.mode === 'bundle' ? '/full-date-night' : `/swipe/${m.mode}`)
            }
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

      <div className="mb-8">
        <SectionTitle>Recent matches</SectionTitle>
        {matches.length === 0 ? (
          <Card className="text-center text-sm text-[var(--color-muted)]">
            No matches yet. Swipe until you both agree.
          </Card>
        ) : (
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5">
            {matches.slice(0, 8).map((match) => (
              <button
                key={match.id}
                onClick={() => navigate('/matches')}
                className="flex w-32 shrink-0 flex-col items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
              >
                <CardArt
                  image={match.card.image}
                  alt={match.card.title}
                  imgClassName="h-20 w-16 rounded-lg object-cover"
                  emojiClassName="text-3xl"
                />
                <span className="line-clamp-2 text-center text-xs font-medium text-[var(--color-ink)]">
                  {match.card.title}
                </span>
              </button>
            ))}
          </div>
        )}
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
