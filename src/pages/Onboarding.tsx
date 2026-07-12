import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { PrimaryButton, SecondaryButton, Chip } from '../components/ui'
import {
  STREAMING_SERVICES,
  CUISINES,
  DIETARY_TAGS,
  GENRES,
  MOODS,
  MOOD_EMOJI,
  BUDGETS,
  COOKING_EFFORTS,
  SNACK_PREFERENCES,
} from '../data/options'
import type { Preferences } from '../types'

const STEPS = [
  'welcome',
  'names',
  'invite',
  'streaming',
  'cuisines',
  'dietary',
  'snacks',
  'genres',
  'lifestyle',
  'moods',
  'done',
] as const

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

export default function Onboarding() {
  const {
    profile,
    updateProfile,
    updatePreferences,
    setPartnerName,
    joinPartner,
    completeOnboarding,
  } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [dislikedFoodInput, setDislikedFoodInput] = useState('')
  const prefs = profile.preferences

  const stepName = STEPS[step]
  const progress = Math.round((step / (STEPS.length - 1)) * 100)

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1)
  }
  function back() {
    if (step > 0) setStep(step - 1)
  }
  function setPref(updates: Partial<Preferences>) {
    updatePreferences(updates)
  }
  function finish() {
    completeOnboarding()
    navigate('/home')
  }

  return (
    <div className="flex min-h-svh flex-col px-6 pb-8 pt-6">
      {stepName !== 'welcome' && (
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-hot-pink)] to-[var(--color-warm-orange)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex-1">
        {stepName === 'welcome' && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 text-6xl">💕</div>
            <h1 className="mb-2 text-3xl font-bold">DateMatch</h1>
            <p className="mb-1 text-lg font-medium text-[var(--color-ink)]">
              What are we doing tonight?
            </p>
            <p className="mb-10 text-[var(--color-muted)]">
              Swipe until you both agree. Food, movie, snacks — done.
            </p>
          </div>
        )}

        {stepName === 'names' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Let's set up your couple</h1>
            <p className="mb-6 text-[var(--color-muted)]">
              A little about you two.
            </p>
            <label className="mb-1 block text-sm font-medium text-[var(--color-muted)]">
              Couple name
            </label>
            <input
              value={profile.coupleName}
              onChange={(e) => updateProfile({ coupleName: e.target.value })}
              placeholder="e.g. Adam & Sam"
              className="mb-4 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-hot-pink)]"
            />
            <label className="mb-1 block text-sm font-medium text-[var(--color-muted)]">
              Your name
            </label>
            <input
              value={profile.partners.A.name}
              onChange={(e) => setPartnerName('A', e.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-hot-pink)]"
            />
          </div>
        )}

        {stepName === 'invite' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Invite your partner</h1>
            <p className="mb-6 text-[var(--color-muted)]">
              Share this code, or simulate them joining for now.
            </p>
            <div className="mb-4 rounded-2xl border border-dashed border-[var(--color-hot-pink)] bg-[var(--color-surface)] px-4 py-6 text-center">
              <p className="mb-1 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                Invite code
              </p>
              <p className="text-3xl font-bold tracking-[0.3em] text-[var(--color-hot-pink)]">
                {profile.inviteCode}
              </p>
            </div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-muted)]">
              Partner's name
            </label>
            <input
              value={profile.partners.B.name}
              onChange={(e) => setPartnerName('B', e.target.value)}
              placeholder="Partner's name"
              className="mb-4 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-hot-pink)]"
            />
            {!profile.partners.B.joined ? (
              <SecondaryButton onClick={() => joinPartner('B')}>
                {profile.partners.B.name || 'Partner'} joined with the code ✓
              </SecondaryButton>
            ) : (
              <p className="text-center text-sm font-medium text-[var(--color-gold)]">
                {profile.partners.B.name || 'Your partner'} is in! 🎉
              </p>
            )}
          </div>
        )}

        {stepName === 'streaming' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Streaming services</h1>
            <p className="mb-6 text-[var(--color-muted)]">
              What do you both have access to?
            </p>
            <div className="flex flex-wrap gap-2">
              {STREAMING_SERVICES.map((s) => (
                <Chip
                  key={s}
                  selected={prefs.streamingServices.includes(s)}
                  onClick={() =>
                    setPref({
                      streamingServices: toggle(prefs.streamingServices, s),
                    })
                  }
                >
                  {s}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'cuisines' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Favorite cuisines</h1>
            <p className="mb-6 text-[var(--color-muted)]">
              Pick everything you both love.
            </p>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => (
                <Chip
                  key={c}
                  selected={prefs.favoriteCuisines.includes(c)}
                  onClick={() =>
                    setPref({
                      favoriteCuisines: toggle(prefs.favoriteCuisines, c),
                    })
                  }
                >
                  {c}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'dietary' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Dietary needs</h1>
            <p className="mb-6 text-[var(--color-muted)]">
              Restrictions, allergies, and foods to avoid.
            </p>
            <div className="mb-6 flex flex-wrap gap-2">
              {DIETARY_TAGS.map((d) => (
                <Chip
                  key={d}
                  selected={prefs.dietaryRestrictions.includes(d)}
                  onClick={() =>
                    setPref({
                      dietaryRestrictions: toggle(prefs.dietaryRestrictions, d),
                    })
                  }
                >
                  {d}
                </Chip>
              ))}
            </div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-muted)]">
              Disliked foods
            </label>
            <div className="mb-2 flex gap-2">
              <input
                value={dislikedFoodInput}
                onChange={(e) => setDislikedFoodInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && dislikedFoodInput.trim()) {
                    setPref({
                      dislikedFoods: [
                        ...prefs.dislikedFoods,
                        dislikedFoodInput.trim(),
                      ],
                    })
                    setDislikedFoodInput('')
                  }
                }}
                placeholder="e.g. mushrooms"
                className="flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-hot-pink)]"
              />
              <SecondaryButton
                className="w-auto px-4"
                onClick={() => {
                  if (dislikedFoodInput.trim()) {
                    setPref({
                      dislikedFoods: [
                        ...prefs.dislikedFoods,
                        dislikedFoodInput.trim(),
                      ],
                    })
                    setDislikedFoodInput('')
                  }
                }}
              >
                Add
              </SecondaryButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {prefs.dislikedFoods.map((food) => (
                <Chip
                  key={food}
                  selected
                  onClick={() =>
                    setPref({
                      dislikedFoods: prefs.dislikedFoods.filter(
                        (f) => f !== food,
                      ),
                    })
                  }
                >
                  {food} ✕
                </Chip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'snacks' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Snack preferences</h1>
            <p className="mb-6 text-[var(--color-muted)]">
              What do you two reach for?
            </p>
            <div className="flex flex-wrap gap-2">
              {SNACK_PREFERENCES.map((s) => (
                <Chip
                  key={s}
                  selected={prefs.snackPreferences.includes(s)}
                  onClick={() =>
                    setPref({
                      snackPreferences: toggle(prefs.snackPreferences, s),
                    })
                  }
                >
                  {s}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'genres' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Movies & shows</h1>
            <p className="mb-4 text-[var(--color-muted)]">
              Genres you both enjoy.
            </p>
            <div className="mb-6 flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Chip
                  key={g}
                  selected={prefs.favoriteGenres.includes(g)}
                  onClick={() =>
                    setPref({
                      favoriteGenres: toggle(prefs.favoriteGenres, g),
                      dislikedGenres: prefs.dislikedGenres.filter(
                        (x) => x !== g,
                      ),
                    })
                  }
                >
                  {g}
                </Chip>
              ))}
            </div>
            <p className="mb-3 text-sm font-medium text-[var(--color-muted)]">
              Genres to avoid
            </p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Chip
                  key={g}
                  selected={prefs.dislikedGenres.includes(g)}
                  onClick={() =>
                    setPref({
                      dislikedGenres: toggle(prefs.dislikedGenres, g),
                      favoriteGenres: prefs.favoriteGenres.filter(
                        (x) => x !== g,
                      ),
                    })
                  }
                >
                  {g}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'lifestyle' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">A few last things</h1>
            <p className="mb-4 text-[var(--color-muted)]">
              Budget, cooking, and drinks.
            </p>
            <p className="mb-2 text-sm font-medium text-[var(--color-muted)]">
              Typical budget
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <Chip
                  key={b}
                  selected={prefs.budget === b}
                  onClick={() => setPref({ budget: b })}
                >
                  {b}
                </Chip>
              ))}
            </div>
            <p className="mb-2 text-sm font-medium text-[var(--color-muted)]">
              Cooking effort
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {COOKING_EFFORTS.map((c) => (
                <Chip
                  key={c}
                  selected={prefs.cookingEffort === c}
                  onClick={() => setPref({ cookingEffort: c })}
                >
                  {c}
                </Chip>
              ))}
            </div>
            <p className="mb-2 text-sm font-medium text-[var(--color-muted)]">
              Alcohol
            </p>
            <div className="flex flex-wrap gap-2">
              {(['yes', 'no', 'sometimes'] as const).map((a) => (
                <Chip
                  key={a}
                  selected={prefs.alcohol === a}
                  onClick={() => setPref({ alcohol: a })}
                >
                  {a}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'moods' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Date-night moods</h1>
            <p className="mb-6 text-[var(--color-muted)]">
              What vibes are you usually into?
            </p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Chip
                  key={m}
                  selected={prefs.moods.includes(m)}
                  onClick={() => setPref({ moods: toggle(prefs.moods, m) })}
                >
                  {MOOD_EMOJI[m]} {m}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'done' && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 text-6xl">🎉</div>
            <h1 className="mb-2 text-3xl font-bold">You're all set</h1>
            <p className="mb-10 text-[var(--color-muted)]">
              Date night, decided. Let's find something you both want.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        {step > 0 && stepName !== 'done' && (
          <SecondaryButton className="w-auto px-5" onClick={back}>
            Back
          </SecondaryButton>
        )}
        {stepName === 'done' ? (
          <PrimaryButton onClick={finish}>Start planning</PrimaryButton>
        ) : (
          <PrimaryButton onClick={next}>
            {stepName === 'welcome' ? "Let's go" : 'Continue'}
          </PrimaryButton>
        )}
      </div>
    </div>
  )
}
