import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { SectionTitle, Chip, Card } from '../components/ui'
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
import type { Preferences as PreferencesType } from '../types'

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

export default function Preferences() {
  const { profile, updatePreferences, setPartnerName } = useApp()
  const [dislikedFoodInput, setDislikedFoodInput] = useState('')
  const prefs = profile.preferences

  function setPref(updates: Partial<PreferencesType>) {
    updatePreferences(updates)
  }

  return (
    <div className="px-5 pb-10 pt-6">
      <h1 className="mb-1 text-2xl font-bold text-[var(--color-ink)]">
        Couple preferences
      </h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        {profile.partners.A.name || 'Partner A'} &amp;{' '}
        {profile.partners.B.name || 'Partner B'} · Code {profile.inviteCode}
      </p>

      <Card className="mb-6 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[10px] uppercase text-[var(--color-muted)]">
            Your name
          </label>
          <input
            value={profile.partners.A.name}
            onChange={(e) => setPartnerName('A', e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base-2)] px-3 py-2 text-sm text-[var(--color-ink)] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] uppercase text-[var(--color-muted)]">
            Partner's name
          </label>
          <input
            value={profile.partners.B.name}
            onChange={(e) => setPartnerName('B', e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base-2)] px-3 py-2 text-sm text-[var(--color-ink)] focus:outline-none"
          />
        </div>
      </Card>

      <SectionTitle>Streaming services</SectionTitle>
      <div className="mb-6 flex flex-wrap gap-2">
        {STREAMING_SERVICES.map((s) => (
          <Chip
            key={s}
            selected={prefs.streamingServices.includes(s)}
            onClick={() =>
              setPref({ streamingServices: toggle(prefs.streamingServices, s) })
            }
          >
            {s}
          </Chip>
        ))}
      </div>

      <SectionTitle>Favorite cuisines</SectionTitle>
      <div className="mb-6 flex flex-wrap gap-2">
        {CUISINES.map((c) => (
          <Chip
            key={c}
            selected={prefs.favoriteCuisines.includes(c)}
            onClick={() =>
              setPref({ favoriteCuisines: toggle(prefs.favoriteCuisines, c) })
            }
          >
            {c}
          </Chip>
        ))}
      </div>

      <SectionTitle>Dietary restrictions</SectionTitle>
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

      <SectionTitle>Disliked foods</SectionTitle>
      <div className="mb-2 flex gap-2">
        <input
          value={dislikedFoodInput}
          onChange={(e) => setDislikedFoodInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && dislikedFoodInput.trim()) {
              setPref({
                dislikedFoods: [...prefs.dislikedFoods, dislikedFoodInput.trim()],
              })
              setDislikedFoodInput('')
            }
          }}
          placeholder="e.g. mushrooms"
          className="flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-hot-pink)]"
        />
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {prefs.dislikedFoods.map((food) => (
          <Chip
            key={food}
            selected
            onClick={() =>
              setPref({
                dislikedFoods: prefs.dislikedFoods.filter((f) => f !== food),
              })
            }
          >
            {food} ✕
          </Chip>
        ))}
      </div>

      <SectionTitle>Snack preferences</SectionTitle>
      <div className="mb-6 flex flex-wrap gap-2">
        {SNACK_PREFERENCES.map((s) => (
          <Chip
            key={s}
            selected={prefs.snackPreferences.includes(s)}
            onClick={() =>
              setPref({ snackPreferences: toggle(prefs.snackPreferences, s) })
            }
          >
            {s}
          </Chip>
        ))}
      </div>

      <SectionTitle>Favorite genres</SectionTitle>
      <div className="mb-6 flex flex-wrap gap-2">
        {GENRES.map((g) => (
          <Chip
            key={g}
            selected={prefs.favoriteGenres.includes(g)}
            onClick={() =>
              setPref({
                favoriteGenres: toggle(prefs.favoriteGenres, g),
                dislikedGenres: prefs.dislikedGenres.filter((x) => x !== g),
              })
            }
          >
            {g}
          </Chip>
        ))}
      </div>

      <SectionTitle>Genres to avoid</SectionTitle>
      <div className="mb-6 flex flex-wrap gap-2">
        {GENRES.map((g) => (
          <Chip
            key={g}
            selected={prefs.dislikedGenres.includes(g)}
            onClick={() =>
              setPref({
                dislikedGenres: toggle(prefs.dislikedGenres, g),
                favoriteGenres: prefs.favoriteGenres.filter((x) => x !== g),
              })
            }
          >
            {g}
          </Chip>
        ))}
      </div>

      <SectionTitle>Budget</SectionTitle>
      <div className="mb-6 flex flex-wrap gap-2">
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

      <SectionTitle>Cooking effort</SectionTitle>
      <div className="mb-6 flex flex-wrap gap-2">
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

      <SectionTitle>Alcohol</SectionTitle>
      <div className="mb-6 flex flex-wrap gap-2">
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

      <SectionTitle>Date-night moods</SectionTitle>
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
  )
}
