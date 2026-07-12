import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { foods, movies, snacks, drinks } from '../data'
import { sortByPreferenceFit } from '../lib/matching'
import { GENRES, MOODS, MOOD_EMOJI, COOKING_EFFORTS } from '../data/options'
import SwipeDeck from '../components/SwipeDeck'
import MatchOverlay from '../components/MatchOverlay'
import PartnerSwitcher from '../components/PartnerSwitcher'
import CardArt from '../components/CardArt'
import { Chip, PrimaryButton, SecondaryButton } from '../components/ui'
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

const cardsById: Record<string, AnyCard> = {}
for (const c of [...foods, ...movies, ...snacks, ...drinks]) cardsById[c.id] = c

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

function buildCustomBundle(
  food: FoodCard,
  movie: MovieCard,
  snack: SnackCard,
  drink: DrinkCard,
): BundleCard {
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

export default function Home() {
  const navigate = useNavigate()
  const {
    profile,
    activePartner,
    swipe,
    hasSwiped,
    resetSwipesForKind,
    registerMatch,
    dateNightSession: session,
    updateDateNightSession,
    resetDateNightSession,
  } = useApp()
  const [justPicked, setJustPicked] = useState<AnyCard | null>(null)
  const [finalMatch, setFinalMatch] = useState<Match | null>(null)

  const stage = STAGES[session.stageIndex]

  const effectivePrefs = useMemo(
    () => ({
      ...profile.preferences,
      moods: session.moods.length > 0 ? session.moods : profile.preferences.moods,
      favoriteGenres:
        session.genres.length > 0 ? session.genres : profile.preferences.favoriteGenres,
      cookingEffort: session.cookingEffort ?? profile.preferences.cookingEffort,
    }),
    [profile.preferences, session.moods, session.genres, session.cookingEffort],
  )

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
    const sorted = sortByPreferenceFit(sourceCards, effectivePrefs)
    return sorted.filter((c) => !hasSwiped(c.id, activePartner))
  }, [sourceCards, effectivePrefs, activePartner, hasSwiped])

  function handleSwipe(card: AnyCard, direction: 'left' | 'right') {
    const match = swipe(card, direction)
    if (!match) return

    const nextPicks = { ...session.picks, [stage.kind]: match.card.id }
    setJustPicked(match.card)

    setTimeout(() => {
      setJustPicked(null)
      if (session.stageIndex < STAGES.length - 1) {
        updateDateNightSession({ picks: nextPicks, stageIndex: session.stageIndex + 1 })
      } else {
        const food = cardsById[nextPicks.food!] as FoodCard
        const movie = cardsById[nextPicks.movie!] as MovieCard
        const snack = cardsById[nextPicks.snack!] as SnackCard
        const drink = cardsById[nextPicks.drink!] as DrinkCard
        const bundle = buildCustomBundle(food, movie, snack, drink)
        setFinalMatch(registerMatch(bundle))
        resetDateNightSession()
      }
    }, 1300)
  }

  if (finalMatch) {
    return (
      <MatchOverlay match={finalMatch} onClose={() => setFinalMatch(null)} />
    )
  }

  if (!session.configured) {
    return (
      <TonightsSettings
        onStart={(moods, genres, cookingEffort) =>
          updateDateNightSession({ configured: true, moods, genres, cookingEffort })
        }
        onSkip={() => updateDateNightSession({ configured: true })}
      />
    )
  }

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex items-center justify-between gap-3 px-5 pt-6">
        <div className="min-w-0">
          <p className="truncate text-sm text-[var(--color-muted)]">
            {profile.partners.A.name || 'You'} &amp; {profile.partners.B.name || 'Partner'}
          </p>
          <h1 className="text-xl font-bold text-[var(--color-ink)]">
            Tonight's picks
          </h1>
        </div>
        <PartnerSwitcher />
      </div>

      <div className="flex items-center justify-center gap-2 px-5 pt-4">
        {STAGES.map((s, i) => (
          <div
            key={s.kind}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              i === session.stageIndex
                ? 'bg-gradient-to-r from-[var(--color-hot-pink)] to-[var(--color-warm-orange)] text-white'
                : i < session.stageIndex
                  ? 'bg-[var(--color-surface-2)] text-[var(--color-muted)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-border)]'
            }`}
          >
            <span>{i < session.stageIndex ? '✓' : s.icon}</span>
            {s.label}
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 py-6">
        {deck.length > 0 ? (
          <>
            <p className="mb-4 text-center text-sm text-[var(--color-muted)]">
              Step {session.stageIndex + 1} of {STAGES.length} — pick the{' '}
              {stage.label.toLowerCase()}
            </p>
            <SwipeDeck cards={deck} onSwipe={handleSwipe} />
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
              <PrimaryButton onClick={() => navigate('/browse')}>
                Browse instead
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
            {session.stageIndex < STAGES.length - 1
              ? `Next up: ${STAGES[session.stageIndex + 1].label}`
              : 'Putting your date night together...'}
          </p>
        </div>
      )}
    </div>
  )
}

function TonightsSettings({
  onStart,
  onSkip,
}: {
  onStart: (
    moods: (typeof MOODS)[number][],
    genres: (typeof GENRES)[number][],
    cookingEffort: (typeof COOKING_EFFORTS)[number] | null,
  ) => void
  onSkip: () => void
}) {
  const [moods, setMoods] = useState<(typeof MOODS)[number][]>([])
  const [genres, setGenres] = useState<(typeof GENRES)[number][]>([])
  const [cookingEffort, setCookingEffort] = useState<
    (typeof COOKING_EFFORTS)[number] | null
  >(null)

  return (
    <div className="flex min-h-svh flex-col px-5 pb-8 pt-6">
      <h1 className="mb-1 text-2xl font-bold text-[var(--color-ink)]">
        What are we feeling tonight?
      </h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        A few quick picks just for tonight — we will still use your saved
        preferences for everything else.
      </p>

      <p className="mb-2 text-sm font-medium text-[var(--color-muted)]">Mood</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {MOODS.map((m) => (
          <Chip
            key={m}
            selected={moods.includes(m)}
            onClick={() => setMoods((prev) => toggle(prev, m))}
          >
            {MOOD_EMOJI[m]} {m}
          </Chip>
        ))}
      </div>

      <p className="mb-2 text-sm font-medium text-[var(--color-muted)]">
        Movie genre
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {GENRES.map((g) => (
          <Chip
            key={g}
            selected={genres.includes(g)}
            onClick={() => setGenres((prev) => toggle(prev, g))}
          >
            {g}
          </Chip>
        ))}
      </div>

      <p className="mb-2 text-sm font-medium text-[var(--color-muted)]">
        How much cooking?
      </p>
      <div className="mb-8 flex flex-wrap gap-2">
        {COOKING_EFFORTS.map((c) => (
          <Chip
            key={c}
            selected={cookingEffort === c}
            onClick={() => setCookingEffort((prev) => (prev === c ? null : c))}
          >
            {c}
          </Chip>
        ))}
      </div>

      <div className="mt-auto space-y-2.5">
        <PrimaryButton onClick={() => onStart(moods, genres, cookingEffort)}>
          Start swiping
        </PrimaryButton>
        <SecondaryButton onClick={onSkip}>
          Skip, use our saved preferences
        </SecondaryButton>
      </div>
    </div>
  )
}
