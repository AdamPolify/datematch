import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useApp } from '../store/AppContext'
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
import { COUNTRIES } from '../data/countries'
import { PLATFORM_STYLE } from '../data/platformStyles'
import { foods, movies, snacks, drinks } from '../data'
import type { Preferences } from '../types'

const STEPS = [
  'welcome',
  'stat',
  'feature1',
  'feature2',
  'social',
  'names',
  'country',
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

const NO_DOT_STEPS = new Set(['welcome', 'done'])

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

function DotProgress({ index, total }: { index: number; total: number }) {
  return (
    <div className="mb-8 flex flex-wrap gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'h-1.5 rounded-full transition-all',
            i === index ? 'w-5 bg-black' : 'w-1.5 bg-black/20',
          )}
        />
      ))}
    </div>
  )
}

function OnboardButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full rounded-full bg-white/70 px-6 py-4 text-center font-bold text-black shadow-[inset_0_0_38px_white,inset_0_0_11px_#edc8f9] backdrop-blur transition-transform active:scale-[0.98]',
        className,
      )}
    >
      {children}
    </button>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Back"
      className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-black"
    >
      ←
    </button>
  )
}

function DarkChip({
  selected,
  children,
  onClick,
}: {
  selected?: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
        selected
          ? 'border-transparent bg-gradient-to-r from-[var(--color-hot-pink)] to-[var(--color-warm-orange)] text-white'
          : 'border-black/10 bg-white/40 text-black/70',
      )}
    >
      {children}
    </button>
  )
}

function DarkInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        'w-full rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-black placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-[var(--color-hot-pink)]',
        props.className,
      )}
    />
  )
}

function StackCard({
  label,
  title,
  icon,
  style,
}: {
  label: string
  title: string
  icon: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className="relative w-full shrink-0 rounded-[24px] bg-white p-4 shadow-[0_-16px_45px_-2px_rgba(152,0,55,0.1)]"
      style={style}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-black/40">
            {label}
          </p>
          <p className="text-base font-extrabold tracking-tight text-black">
            {title}
          </p>
        </div>
      </div>
    </div>
  )
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
  const [countrySearch, setCountrySearch] = useState('')
  const prefs = profile.preferences

  const stepName = STEPS[step]
  const dotIndex = STEPS.slice(0, step).filter((s) => !NO_DOT_STEPS.has(s)).length
  const dotTotal = STEPS.filter((s) => !NO_DOT_STEPS.has(s)).length

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES
    const q = countrySearch.trim().toLowerCase()
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q))
  }, [countrySearch])

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

  const isWelcome = stepName === 'welcome'

  return (
    <div
      className={clsx(
        'relative flex min-h-svh flex-col px-6 pb-8 pt-6 text-black',
        isWelcome && 'overflow-hidden',
      )}
      style={{
        background: isWelcome
          ? 'linear-gradient(225deg, #FF8AA5 18.5%, #ECCCFF 48.3%, #B5DFFF 49.4%, #82BBFF 81.5%)'
          : 'linear-gradient(180deg, #fcbddb 5%, #ff95bd 47.4%, #ff82a8 100%)',
      }}
    >
      {step > 0 && stepName !== 'done' && <BackButton onClick={back} />}
      {!NO_DOT_STEPS.has(stepName) && <DotProgress index={dotIndex} total={dotTotal} />}

      <div className="flex-1">
        {isWelcome && (
          <div className="pointer-events-none absolute inset-0">
            {/* soft cloud accents */}
            <div className="absolute -left-10 top-[8%] h-28 w-44 rounded-full bg-white/50 blur-2xl" />
            <div className="absolute -right-8 top-0 h-32 w-48 rounded-full bg-white/45 blur-2xl" />
            <div className="absolute -left-6 bottom-[2%] h-36 w-56 rounded-full bg-white/55 blur-2xl" />
            <div className="absolute right-[-10%] bottom-[6%] h-40 w-60 rounded-full bg-white/40 blur-2xl" />

            {/* sparkles */}
            <img
              src="onboarding/star1.svg"
              alt=""
              className="absolute h-6 w-6"
              style={{ left: '75.1%', top: '34.7%' }}
            />
            <img
              src="onboarding/star3.svg"
              alt=""
              className="absolute h-[13%] w-[13%]"
              style={{ left: '10.9%', top: '43.4%' }}
            />
            <img
              src="onboarding/star2.svg"
              alt=""
              className="absolute h-5 w-5"
              style={{ left: '65.4%', top: '61.2%' }}
            />

            {/* blob mascots */}
            <img
              src="onboarding/blob-mascots.png"
              alt=""
              className="absolute w-[68%] drop-shadow-[0_20px_40px_rgba(60,20,60,0.25)]"
              style={{ left: '16.2%', top: '33.9%' }}
            />

            <p
              className="absolute left-1/2 w-[80%] -translate-x-1/2 text-center text-[56px] font-black tracking-tight text-black"
              style={{
                top: '65%',
                fontFamily: "'Nunito', 'Poppins', sans-serif",
                fontWeight: 900,
                backgroundImage:
                  'linear-gradient(180deg, #000 0%, rgba(0,0,0,0.6) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              DateMatch
            </p>
            <p
              className="absolute left-1/2 w-[80%] -translate-x-1/2 text-center text-base font-medium text-black/60"
              style={{ top: '76%' }}
            >
              Swipe until date night is planned.
            </p>
          </div>
        )}

        {stepName === 'stat' && (
          <div className="flex flex-col items-center">
            <img
              src="onboarding/stopwatch-23.png"
              alt=""
              className="mb-10 mt-2 w-[260px] drop-shadow-xl"
            />
            <h1
              className="text-center text-[32px] font-black leading-[1.15] tracking-[-1.28px] text-black"
              style={{ fontFamily: "'Nunito','Poppins',sans-serif" }}
            >
              Most couples spend longer deciding than actually watching
            </h1>
            <p className="mt-4 text-center text-sm font-bold text-black/70">
              That's 23 minutes you could already be on the couch
            </p>
          </div>
        )}

        {stepName === 'feature1' && (
          <div className="flex h-full flex-col">
            <h1
              className="mb-10 text-center text-[32px] font-black leading-[1.15] tracking-[-1.28px] text-black"
              style={{ fontFamily: "'Nunito','Poppins',sans-serif" }}
            >
              Swipe through your best picks
            </h1>
            <div className="relative mx-auto h-[300px] w-[220px]">
              <div className="absolute inset-x-4 top-4 h-full rounded-[32px] bg-white/50" />
              <div className="absolute inset-x-2 top-2 h-full rounded-[32px] bg-white/70" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-[32px] bg-white p-6 shadow-[0_11px_20px_-4px_rgba(0,0,0,0.35)]"
                animate={{ x: [0, -80, 0, 80, 0], rotate: [0, -12, 0, 12, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: 'easeInOut',
                }}
              >
                <p
                  className="text-center text-2xl font-black leading-tight tracking-[-0.96px] text-black"
                  style={{ fontFamily: "'Nunito','Poppins',sans-serif" }}
                >
                  {foods[0]?.title ?? 'Homemade pasta al limone'}
                </p>
              </motion.div>
            </div>
          </div>
        )}

        {stepName === 'feature2' && (
          <div className="flex h-full flex-col">
            <h1
              className="mb-8 text-center text-[32px] font-black leading-[1.15] tracking-[-1.28px] text-black"
              style={{ fontFamily: "'Nunito','Poppins',sans-serif" }}
            >
              Find a match with your partner
            </h1>
            <div className="relative mx-auto h-[300px] w-[260px]">
              <div className="absolute inset-0 overflow-hidden rounded-[36px] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
                {foods[0]?.image?.startsWith('http') ? (
                  <img
                    src={foods[0].image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-b from-[var(--color-surface-2)] to-[var(--color-base-2)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-transparent" />
                <p
                  className="absolute inset-x-4 top-16 text-center text-2xl font-black leading-tight tracking-[-0.96px] text-white"
                  style={{ fontFamily: "'Nunito','Poppins',sans-serif" }}
                >
                  {foods[0]?.title ?? 'Homemade pasta al limone'}
                </p>
              </div>
              <img
                src="onboarding/avatar-a.png"
                alt=""
                className="absolute -left-3 top-2 h-14 w-14 rounded-full object-cover shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
              />
              <img
                src="onboarding/avatar-b.jpg"
                alt=""
                className="absolute -right-3 bottom-2 h-12 w-12 rounded-full object-cover shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
              />
              <span className="absolute -right-4 top-16 rotate-12 text-3xl drop-shadow-lg">
                💕
              </span>
              <span className="absolute -left-4 bottom-16 -rotate-[26deg] text-2xl drop-shadow-lg">
                🩷
              </span>
            </div>
          </div>
        )}

        {stepName === 'social' && (
          <div className="flex h-full flex-col">
            <h1
              className="mb-8 text-center text-[32px] font-black leading-[1.15] tracking-[-1.28px] text-black"
              style={{ fontFamily: "'Nunito','Poppins',sans-serif" }}
            >
              Create a full plan for the night
            </h1>
            <div className="mx-auto flex w-full max-w-[300px] flex-col items-center">
              <StackCard
                label="Food"
                title={foods[0]?.title ?? 'Homemade pasta al limone'}
                icon="🍽️"
                style={{ marginBottom: -48, zIndex: 1 }}
              />
              <StackCard
                label="Movie"
                title={movies[0]?.title ?? 'Movie night'}
                icon="🎬"
                style={{ marginBottom: -48, zIndex: 2 }}
              />
              <StackCard
                label="Snack"
                title={snacks[0]?.title ?? 'Sweet treat'}
                icon="🍿"
                style={{ marginBottom: -48, zIndex: 3 }}
              />
              <StackCard
                label="Drink"
                title={drinks[0]?.title ?? 'Something to sip'}
                icon="🍹"
                style={{ zIndex: 4 }}
              />
            </div>
          </div>
        )}

        {stepName === 'names' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Let's set up your couple</h1>
            <p className="mb-6 text-black/50">A little about you two.</p>
            <label className="mb-1 block text-sm font-medium text-black/50">
              Couple name
            </label>
            <DarkInput
              value={profile.coupleName}
              onChange={(e) => updateProfile({ coupleName: e.target.value })}
              placeholder="e.g. Adam & Sam"
              className="mb-4"
            />
            <label className="mb-1 block text-sm font-medium text-black/50">
              Your name
            </label>
            <DarkInput
              value={profile.partners.A.name}
              onChange={(e) => setPartnerName('A', e.target.value)}
              placeholder="Your name"
            />
          </div>
        )}

        {stepName === 'country' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Where are you based?</h1>
            <p className="mb-6 text-black/50">
              So we can show you movies actually streaming near you.
            </p>
            <DarkInput
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="Search countries"
              className="mb-4"
            />
            <div className="no-scrollbar max-h-[360px] space-y-1.5 overflow-y-auto">
              {filteredCountries.map((c) => (
                <button
                  key={c.name}
                  onClick={() => updateProfile({ country: c.name })}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors',
                    profile.country === c.name
                      ? 'bg-gradient-to-r from-[var(--color-hot-pink)] to-[var(--color-warm-orange)] text-white'
                      : 'bg-white/40 text-black/70',
                  )}
                >
                  <span className="text-xl">{c.flag}</span>
                  <span className="font-medium">{c.name}</span>
                  {profile.country === c.name && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {stepName === 'invite' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Invite your partner</h1>
            <p className="mb-6 text-black/50">
              Share this code, or simulate them joining for now.
            </p>
            <div className="mb-4 rounded-2xl border border-dashed border-[var(--color-hot-pink)] bg-white/40 px-4 py-6 text-center">
              <p className="mb-1 text-xs uppercase tracking-widest text-black/50">
                Invite code
              </p>
              <p className="text-3xl font-bold tracking-[0.3em] text-[var(--color-hot-pink)]">
                {profile.inviteCode}
              </p>
            </div>
            <label className="mb-1 block text-sm font-medium text-black/50">
              Partner's name
            </label>
            <DarkInput
              value={profile.partners.B.name}
              onChange={(e) => setPartnerName('B', e.target.value)}
              placeholder="Partner's name"
              className="mb-4"
            />
            {!profile.partners.B.joined ? (
              <button
                onClick={() => joinPartner('B')}
                className="w-full rounded-2xl border border-black/10 bg-white/40 px-5 py-3.5 text-center font-medium text-black"
              >
                {profile.partners.B.name || 'Partner'} joined with the code ✓
              </button>
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
            <p className="mb-6 text-black/50">
              Which do you both have access to? Choose all that apply.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {STREAMING_SERVICES.map((s) => {
                const style = PLATFORM_STYLE[s]
                const selected = prefs.streamingServices.includes(s)
                return (
                  <button
                    key={s}
                    onClick={() =>
                      setPref({
                        streamingServices: toggle(prefs.streamingServices, s),
                      })
                    }
                    className={clsx(
                      'relative flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 text-center transition-transform active:scale-95',
                      selected ? 'border-[var(--color-hot-pink)]' : 'border-transparent',
                    )}
                    style={{ backgroundColor: style.bg }}
                  >
                    {selected && (
                      <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-hot-pink)] text-[10px] text-white">
                        ✓
                      </span>
                    )}
                    <span
                      className="text-sm font-bold"
                      style={{ color: style.fg }}
                    >
                      {style.label || s}
                    </span>
                    <span className="px-1 text-[9px] leading-tight text-black/60">
                      {s}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {stepName === 'cuisines' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Favorite cuisines</h1>
            <p className="mb-6 text-black/50">Pick everything you both love.</p>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => (
                <DarkChip
                  key={c}
                  selected={prefs.favoriteCuisines.includes(c)}
                  onClick={() =>
                    setPref({
                      favoriteCuisines: toggle(prefs.favoriteCuisines, c),
                    })
                  }
                >
                  {c}
                </DarkChip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'dietary' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Dietary needs</h1>
            <p className="mb-6 text-black/50">
              Restrictions, allergies, and foods to avoid.
            </p>
            <div className="mb-6 flex flex-wrap gap-2">
              {DIETARY_TAGS.map((d) => (
                <DarkChip
                  key={d}
                  selected={prefs.dietaryRestrictions.includes(d)}
                  onClick={() =>
                    setPref({
                      dietaryRestrictions: toggle(prefs.dietaryRestrictions, d),
                    })
                  }
                >
                  {d}
                </DarkChip>
              ))}
            </div>
            <label className="mb-1 block text-sm font-medium text-black/50">
              Disliked foods
            </label>
            <div className="mb-2 flex gap-2">
              <DarkInput
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
                className="flex-1"
              />
              <button
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
                className="w-auto shrink-0 rounded-2xl border border-black/10 bg-white/40 px-4 py-3 font-medium text-black"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {prefs.dislikedFoods.map((food) => (
                <DarkChip
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
                </DarkChip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'snacks' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Snack preferences</h1>
            <p className="mb-6 text-black/50">What do you two reach for?</p>
            <div className="flex flex-wrap gap-2">
              {SNACK_PREFERENCES.map((s) => (
                <DarkChip
                  key={s}
                  selected={prefs.snackPreferences.includes(s)}
                  onClick={() =>
                    setPref({
                      snackPreferences: toggle(prefs.snackPreferences, s),
                    })
                  }
                >
                  {s}
                </DarkChip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'genres' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Movies & shows</h1>
            <p className="mb-4 text-black/50">Genres you both enjoy.</p>
            <div className="mb-6 flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <DarkChip
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
                </DarkChip>
              ))}
            </div>
            <p className="mb-3 text-sm font-medium text-black/50">
              Genres to avoid
            </p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <DarkChip
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
                </DarkChip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'lifestyle' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">A few last things</h1>
            <p className="mb-4 text-black/50">Budget, cooking, and drinks.</p>
            <p className="mb-2 text-sm font-medium text-black/50">
              Typical budget
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <DarkChip
                  key={b}
                  selected={prefs.budget === b}
                  onClick={() => setPref({ budget: b })}
                >
                  {b}
                </DarkChip>
              ))}
            </div>
            <p className="mb-2 text-sm font-medium text-black/50">
              Cooking effort
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {COOKING_EFFORTS.map((c) => (
                <DarkChip
                  key={c}
                  selected={prefs.cookingEffort === c}
                  onClick={() => setPref({ cookingEffort: c })}
                >
                  {c}
                </DarkChip>
              ))}
            </div>
            <p className="mb-2 text-sm font-medium text-black/50">Alcohol</p>
            <div className="flex flex-wrap gap-2">
              {(['yes', 'no', 'sometimes'] as const).map((a) => (
                <DarkChip
                  key={a}
                  selected={prefs.alcohol === a}
                  onClick={() => setPref({ alcohol: a })}
                >
                  {a}
                </DarkChip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'moods' && (
          <div>
            <h1 className="mb-1 text-2xl font-bold">Date-night moods</h1>
            <p className="mb-6 text-black/50">
              What vibes are you usually into?
            </p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <DarkChip
                  key={m}
                  selected={prefs.moods.includes(m)}
                  onClick={() => setPref({ moods: toggle(prefs.moods, m) })}
                >
                  {MOOD_EMOJI[m]} {m}
                </DarkChip>
              ))}
            </div>
          </div>
        )}

        {stepName === 'done' && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 text-6xl">🎉</div>
            <h1 className="mb-2 text-3xl font-bold">You're all set</h1>
            <p className="mb-10 text-black/50">
              Date night, decided. Let's find something you both want.
            </p>
          </div>
        )}
      </div>

      <div className="relative mt-8 flex gap-3">
        {stepName === 'done' ? (
          <OnboardButton onClick={finish}>Start planning →</OnboardButton>
        ) : (
          <OnboardButton onClick={next}>
            {isWelcome ? 'Get started →' : 'Next →'}
          </OnboardButton>
        )}
      </div>
      <div
        className={clsx(
          'relative mx-auto mt-4 h-1 w-32 rounded-full',
          'bg-black/25',
        )}
      />
    </div>
  )
}
