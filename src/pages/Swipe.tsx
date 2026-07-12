import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { bundles, movies, foods, snacks, drinks } from '../data'
import { sortByPreferenceFit } from '../lib/matching'
import SwipeDeck from '../components/SwipeDeck'
import MatchOverlay from '../components/MatchOverlay'
import TopBar from '../components/TopBar'
import PartnerSwitcher from '../components/PartnerSwitcher'
import { PrimaryButton, SecondaryButton } from '../components/ui'
import type { AnyCard, CardKind, Match, SwipeMode } from '../types'

const MODE_META: Record<SwipeMode, { title: string; kind: CardKind | null }> = {
  bundle: { title: 'Full Date Night', kind: 'bundle' },
  movie: { title: 'Movies & Shows', kind: 'movie' },
  food: { title: 'What to Eat', kind: 'food' },
  snack: { title: 'Snacks', kind: 'snack' },
  drink: { title: 'Drinks & Cocktails', kind: 'drink' },
  quick: { title: 'Quick Match', kind: 'bundle' },
}

export default function Swipe() {
  const { mode = 'bundle' } = useParams<{ mode: SwipeMode }>()
  const navigate = useNavigate()
  const { profile, activePartner, swipe, hasSwiped, resetSwipesForKind } =
    useApp()
  const [pendingMatch, setPendingMatch] = useState<Match | null>(null)

  const meta = MODE_META[mode as SwipeMode] ?? MODE_META.bundle
  const prefs = profile.preferences

  const sourceCards: AnyCard[] = useMemo(() => {
    switch (mode) {
      case 'movie':
        return movies
      case 'food':
        return foods
      case 'snack':
        return snacks
      case 'drink':
        return drinks
      case 'quick':
        return sortByPreferenceFit(bundles, prefs).slice(0, 5)
      case 'bundle':
      default:
        return bundles
    }
  }, [mode, prefs])

  const deck = useMemo(() => {
    const sorted = sortByPreferenceFit(sourceCards, prefs)
    return sorted.filter((c) => !hasSwiped(c.id, activePartner))
  }, [sourceCards, prefs, activePartner, hasSwiped])

  function handleSwipe(card: AnyCard, direction: 'left' | 'right') {
    const match = swipe(card, direction)
    if (match) {
      setTimeout(() => setPendingMatch(match), 300)
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <TopBar
        title={meta.title}
        subtitle={`Swiping as ${
          profile.partners[activePartner].name || `Partner ${activePartner}`
        }`}
        onBack={() => navigate('/home')}
        right={<PartnerSwitcher />}
      />

      <div className="flex flex-1 flex-col justify-center px-5 py-6">
        {deck.length > 0 ? (
          <>
            <SwipeDeck cards={deck} onSwipe={handleSwipe} />
            <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
              {deck.length} card{deck.length === 1 ? '' : 's'} left
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-5xl">✨</div>
            <h2 className="text-xl font-bold text-[var(--color-ink)]">
              You're all caught up
            </h2>
            <p className="text-sm text-[var(--color-muted)]">
              Check the Matches tab to see what you've both agreed on, or
              swipe through this deck again.
            </p>
            <div className="mt-2 w-full space-y-2.5">
              <PrimaryButton onClick={() => navigate('/matches')}>
                View matches
              </PrimaryButton>
              <SecondaryButton
                onClick={() => {
                  if (meta.kind) resetSwipesForKind(meta.kind)
                }}
              >
                Swipe this deck again
              </SecondaryButton>
            </div>
          </div>
        )}
      </div>

      {pendingMatch && (
        <MatchOverlay
          match={pendingMatch}
          onClose={() => setPendingMatch(null)}
        />
      )}
    </div>
  )
}
