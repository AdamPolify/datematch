import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { foods, movies, snacks, drinks } from '../data'
import { sortByPreferenceFit } from '../lib/matching'
import { GENRES, MOODS, MOOD_EMOJI, COOKING_EFFORTS } from '../data/options'
import SwipeDeck from '../components/SwipeDeck'
import MatchOverlay from '../components/MatchOverlay'
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

function PizzaIcon() {
  return (
    <svg viewBox="0 0 11 11" fill="none" className="h-[14px] w-[14px]">
      <path
        d="M7.68 0.77 8.64.6c.79-.14 1.48.55 1.35 1.35l-.64 3.75-.43 2.51-.15.86c-.11.64-.73 1.08-1.35.89A7.9 7.9 0 0 1 3.18 7.4 7.9 7.9 0 0 1 .63 3.17c-.19-.62.25-1.24.88-1.35l.86-.15M8.91 8.21a7.9 7.9 0 0 1-2.67-1.01M2.37 1.67c.3 1.57 1.05 3.06 2.26 4.28.5.49 1.04.91 1.61 1.25M2.37 1.67l3.29-.56M9.34 5.7a1.75 1.75 0 0 0-3.16 1.5"
        stroke="currentColor"
        strokeWidth="1.17"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TvIcon() {
  return (
    <svg viewBox="0 0 12 11" fill="none" className="h-[14px] w-[14px]">
      <path
        d="M9.33 9.92a11 11 0 0 0-7 0M1.75 7.58h8.17c.64 0 1.16-.52 1.16-1.17V1.75c0-.64-.52-1.17-1.16-1.17H1.75c-.64 0-1.17.53-1.17 1.17v4.66c0 .65.53 1.17 1.17 1.17Z"
        stroke="currentColor"
        strokeWidth="1.17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CookiesIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className="h-[14px] w-[14px]">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 5.83A5.83 5.83 0 0 1 6.5.04a.83.83 0 0 1 .5.85c0 .74.55 1.35 1.26 1.44.26.04.47.24.5.5.1.71.71 1.26 1.45 1.26.18 0 .35-.03.51-.09a.58.58 0 0 1 .76.42c.12.46.18.94.18 1.44a5.83 5.83 0 1 1-11.67 0Zm5.83-4.67a4.67 4.67 0 1 0 4.63 4.06 1.75 1.75 0 0 1-2.17-1.86A2.33 2.33 0 0 1 5.85 1.17Z"
      />
      <circle cx="3.79" cy="3.79" r="0.88" />
      <circle cx="6.13" cy="5.54" r="0.88" />
      <circle cx="8.75" cy="7" r="0.58" />
      <circle cx="5.54" cy="8.46" r="0.88" />
      <circle cx="2.92" cy="7" r="0.58" />
    </svg>
  )
}

function CocktailIcon() {
  return (
    <svg viewBox="0 0 12 11" fill="none" className="h-[14px] w-[14px]">
      <path
        d="M5.86 5.83V10.5M5.86 5.83 1.11 2.73C.14 2.09.6.58 1.75.58h8.22c1.16 0 1.6 1.5.64 2.15L5.86 5.83ZM5.86 10.5H3.53M5.86 10.5h2.33"
        stroke="currentColor"
        strokeWidth="1.17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const STAGES: {
  kind: StageKind
  label: string
  Icon: () => React.JSX.Element
}[] = [
  { kind: 'food', label: 'Food', Icon: PizzaIcon },
  { kind: 'movie', label: 'Movie', Icon: TvIcon },
  { kind: 'snack', label: 'Snack', Icon: CookiesIcon },
  { kind: 'drink', label: 'Drink', Icon: CocktailIcon },
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
    <div className="flex min-h-0 flex-1 flex-col px-4 pt-5">
      <div className="flex items-center justify-between">
        <h1
          className="text-[32px] font-black leading-none tracking-[-1.28px] text-[var(--color-ink)]"
          style={{ fontFamily: "'Nunito','Poppins',sans-serif" }}
        >
          Tonights picks
        </h1>
        <button
          onClick={() => updateDateNightSession({ configured: false })}
          aria-label="Tonight's settings"
          className="shrink-0 p-1"
        >
          <img src="home/settings.svg" alt="" className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {STAGES.map((s, i) => {
          const active = i === session.stageIndex
          return (
            <div
              key={s.kind}
              className={`flex flex-1 items-center justify-center gap-1 rounded-full py-2 text-[10px] font-medium tracking-[-0.4px] transition-colors ${
                active
                  ? 'bg-[#ff82e0] text-black'
                  : 'bg-black/5 text-[#a5a5a5]'
              }`}
            >
              <s.Icon />
              {s.label}
            </div>
          )
        })}
      </div>

      <div className="flex min-h-0 flex-1 flex-col pt-3">
        {deck.length > 0 ? (
          <>
            <p className="mb-2 shrink-0 text-center text-xs text-[var(--color-muted)]">
              Step {session.stageIndex + 1} of {STAGES.length} — pick the{' '}
              {stage.label.toLowerCase()}
            </p>
            <SwipeDeck cards={deck} onSwipe={handleSwipe} />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
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
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-8 pt-6">
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
