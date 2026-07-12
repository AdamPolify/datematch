import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { foods, movies, snacks, drinks } from '../data'
import { sortByPreferenceFit } from '../lib/matching'
import SwipeDeck from '../components/SwipeDeck'
import MatchOverlay from '../components/MatchOverlay'
import TopBar from '../components/TopBar'
import PartnerSwitcher from '../components/PartnerSwitcher'
import { PrimaryButton, SecondaryButton } from '../components/ui'
import CardArt from '../components/CardArt'
import type {
  AnyCard,
  BundleCard,
  DrinkCard,
  FoodCard,
  Match,
  MovieCard,
  SnackCard,
} from '../types'

type StageKind = 'food' | 'movie' | 'snack' | 'drink'

const STAGES: { kind: StageKind; label: string; icon: string }[] = [
  { kind: 'food', label: 'Food', icon: '🍽️' },
  { kind: 'movie', label: 'Movie', icon: '🎬' },
  { kind: 'snack', label: 'Snack', icon: '🍿' },
  { kind: 'drink', label: 'Drink', icon: '🍹' },
]

interface Picks {
  food?: FoodCard
  movie?: MovieCard
  snack?: SnackCard
  drink?: DrinkCard
}

function buildCustomBundle(picks: Required<Picks>): BundleCard {
  const { food, movie, snack, drink } = picks
  const sharedMood = Array.from(new Set([...food.mood, ...movie.mood]))
  return {
    id: `custom-${food.id}-${movie.id}-${snack.id}-${drink.id}-${Date.now()}`,
    kind: 'bundle',
    title: 'Your Custom Date Night',
    image: '💫',
    mood: sharedMood.length > 0 ? sharedMood.slice(0, 3) : food.mood,
    reason: 'Built from the food, movie, snack, and drink you both picked',
    food,
    movie,
    snack,
    drink,
    estimatedTimeMinutes: food.timeMinutes + movie.runtimeMinutes + 15,
    estimatedCost: food.priceLevel,
  }
}

export default function FullDateNight() {
  const navigate = useNavigate()
  const { profile, activePartner, swipe, hasSwiped, resetSwipesForKind, registerMatch } =
    useApp()
  const [stageIndex, setStageIndex] = useState(0)
  const [picks, setPicks] = useState<Picks>({})
  const [justPicked, setJustPicked] = useState<AnyCard | null>(null)
  const [finalMatch, setFinalMatch] = useState<Match | null>(null)

  const prefs = profile.preferences
  const stage = STAGES[stageIndex]

  const sourceCards: AnyCard[] = useMemo(() => {
    switch (stage?.kind) {
      case 'food':
        return foods
      case 'movie':
        return movies
      case 'snack':
        return snacks
      case 'drink':
        return drinks
      default:
        return []
    }
  }, [stage])

  const deck = useMemo(() => {
    const sorted = sortByPreferenceFit(sourceCards, prefs)
    return sorted.filter((c) => !hasSwiped(c.id, activePartner))
  }, [sourceCards, prefs, activePartner, hasSwiped])

  function handleSwipe(card: AnyCard, direction: 'left' | 'right') {
    const match = swipe(card, direction)
    if (!match) return

    const nextPicks: Picks = { ...picks, [stage.kind]: match.card }
    setPicks(nextPicks)
    setJustPicked(match.card)

    setTimeout(() => {
      setJustPicked(null)
      if (stageIndex < STAGES.length - 1) {
        setStageIndex((i) => i + 1)
      } else {
        const bundle = buildCustomBundle(nextPicks as Required<Picks>)
        setFinalMatch(registerMatch(bundle))
      }
    }, 1300)
  }

  if (finalMatch) {
    return <MatchOverlay match={finalMatch} onClose={() => navigate('/home')} />
  }

  return (
    <div className="flex min-h-svh flex-col">
      <TopBar
        title="Full Date Night"
        subtitle={`Swiping as ${
          profile.partners[activePartner].name || `Partner ${activePartner}`
        }`}
        onBack={() => navigate('/home')}
        right={<PartnerSwitcher />}
      />

      <div className="flex items-center justify-center gap-2 px-5 pt-4">
        {STAGES.map((s, i) => (
          <div
            key={s.kind}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              i === stageIndex
                ? 'bg-gradient-to-r from-[var(--color-hot-pink)] to-[var(--color-warm-orange)] text-white'
                : i < stageIndex
                  ? 'bg-white/10 text-white/70'
                  : 'bg-white/5 text-white/30'
            }`}
          >
            <span>{i < stageIndex ? '✓' : s.icon}</span>
            {s.label}
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 py-6">
        {deck.length > 0 ? (
          <>
            <p className="mb-4 text-center text-sm text-[var(--color-muted)]">
              Step {stageIndex + 1} of {STAGES.length} — pick the {stage.label.toLowerCase()}
            </p>
            <SwipeDeck cards={deck} onSwipe={handleSwipe} />
            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                onClick={() => handleSwipe(deck[0], 'left')}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-2xl text-white shadow-lg active:scale-95"
                aria-label="Pass"
              >
                ✕
              </button>
              <button
                onClick={() => handleSwipe(deck[0], 'right')}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-hot-pink)] to-[var(--color-warm-orange)] text-2xl text-white shadow-lg active:scale-95"
                aria-label="Like"
              >
                ♥
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
              {deck.length} card{deck.length === 1 ? '' : 's'} left
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-5xl">✨</div>
            <h2 className="text-xl font-bold text-[var(--color-ink)]">
              No more {stage.label.toLowerCase()} options
            </h2>
            <p className="text-sm text-[var(--color-muted)]">
              You have not both agreed on a {stage.label.toLowerCase()} yet. Try the
              deck again.
            </p>
            <div className="mt-2 w-full space-y-2.5">
              <SecondaryButton onClick={() => resetSwipesForKind(stage.kind)}>
                Swipe this deck again
              </SecondaryButton>
              <PrimaryButton onClick={() => navigate('/home')}>
                Back home
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>

      {justPicked && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-[480px] flex-col items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <CardArt
            image={justPicked.image}
            alt={justPicked.title}
            imgClassName="h-36 w-28 rounded-xl object-cover shadow-lg"
            emojiClassName="text-6xl"
          />
          <p className="mt-3 text-lg font-bold text-white">{justPicked.title}</p>
          <p className="mt-1 text-sm text-white/70">
            {stageIndex < STAGES.length - 1
              ? `Next up: ${STAGES[stageIndex + 1].label}`
              : 'Putting your date night together...'}
          </p>
        </div>
      )}
    </div>
  )
}
