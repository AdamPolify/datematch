import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { AnyCard, Match } from '../types'
import { useApp } from '../store/AppContext'
import { PrimaryButton, SecondaryButton } from './ui'

function isBundle(card: AnyCard): card is Extract<AnyCard, { kind: 'bundle' }> {
  return card.kind === 'bundle'
}

function Avatar({ name, className }: { name: string; className?: string }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase() || '?'
  return (
    <div
      className={
        'flex items-center justify-center rounded-full bg-gradient-to-b from-[var(--color-hot-pink)] to-[var(--color-warm-orange)] font-black text-white shadow-[0_4px_10px_rgba(0,0,0,0.25)] ' +
        (className ?? '')
      }
    >
      {initial}
    </div>
  )
}

export default function MatchOverlay({
  match,
  onClose,
}: {
  match: Match
  onClose: () => void
}) {
  const { profile, toggleFavorite, isFavorite, addShoppingItem, createPlanFromBundle } =
    useApp()
  const navigate = useNavigate()
  const [toast, setToast] = useState<string | null>(null)
  const card = match.card

  function flash(message: string) {
    setToast(message)
    setTimeout(() => setToast(null), 1800)
  }

  function startDateNight() {
    if (isBundle(card)) {
      const plan = createPlanFromBundle(card)
      navigate(`/plan/${plan.id}`)
    } else {
      flash('Match a full date-night bundle to build a plan')
    }
  }

  function addToShoppingList() {
    if (isBundle(card)) {
      addShoppingItem(card.food.title)
      addShoppingItem(card.snack.title)
      addShoppingItem(card.drink.title)
    } else {
      addShoppingItem(card.title)
    }
    flash('Added to shopping list')
  }

  function share() {
    const text = `We matched on: ${card.title} 💕`
    if (navigator.share) {
      navigator.share({ text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text).catch(() => {})
      flash('Copied to clipboard')
    }
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[480px] flex-col overflow-y-auto bg-gradient-to-b from-[rgba(255,131,168,0.55)] to-[#ffc5d6] backdrop-blur-[10px]">
      <div className="relative flex shrink-0 flex-col items-center pt-16 text-center">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 px-8"
        >
          <p
            className="text-[44px] font-black leading-tight tracking-[-1.76px] text-black"
            style={{ fontFamily: "'Nunito','Poppins',sans-serif" }}
          >
            It&rsquo;s a match!
          </p>
          <p className="mt-2 text-lg font-bold tracking-[-0.02em] text-black/50">
            You both want {card.title.toLowerCase()}
          </p>
        </motion.div>

        <div className="relative mb-6 flex h-[300px] w-full items-center justify-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0, rotate: -14 }}
            animate={{ scale: 1, opacity: 1, rotate: -4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="relative h-[280px] w-[200px] overflow-hidden rounded-[36px] shadow-[0_11px_24px_rgba(0,0,0,0.5)]"
          >
            {card.image.startsWith('http') ? (
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[var(--color-surface-2)] to-[var(--color-base-2)]">
                <span className="text-7xl">{card.image}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-transparent" />
            <p className="absolute inset-x-3 top-6 text-center text-xl font-black leading-tight tracking-[-0.8px] text-white">
              {card.title}
            </p>
          </motion.div>

          <Avatar
            name={profile.partners.A.name}
            className="absolute left-3 top-6 h-[52px] w-[52px] text-lg"
          />
          <Avatar
            name={profile.partners.B.name}
            className="absolute bottom-4 right-4 h-12 w-12 text-base"
          />

          <motion.span
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 9 }}
            transition={{ delay: 0.15 }}
            className="absolute right-6 top-16 text-3xl drop-shadow-lg"
          >
            💕
          </motion.span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: -26 }}
            transition={{ delay: 0.25 }}
            className="absolute bottom-16 left-2 text-2xl drop-shadow-lg"
          >
            🩷
          </motion.span>
        </div>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-auto rounded-t-[32px] bg-white p-6 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]"
      >
        <p className="mb-4 line-clamp-2 text-center text-sm italic text-[var(--color-muted)]">
          "{card.reason}"
        </p>
        <div className="space-y-2.5">
          <PrimaryButton onClick={startDateNight}>
            Start date night
          </PrimaryButton>
          <div className="grid grid-cols-2 gap-2.5">
            <SecondaryButton
              onClick={() => {
                toggleFavorite(card.id)
                flash(isFavorite(card.id) ? 'Removed' : 'Saved for later')
              }}
            >
              {isFavorite(card.id) ? '★ Saved' : '☆ Save for later'}
            </SecondaryButton>
            <SecondaryButton onClick={addToShoppingList}>
              🛒 Add to list
            </SecondaryButton>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <SecondaryButton
              onClick={() =>
                flash(
                  isBundle(card) || card.kind === 'food'
                    ? 'Ordering isn\'t connected in this MVP'
                    : 'Opening streaming isn\'t connected in this MVP',
                )
              }
            >
              {isBundle(card) || card.kind === 'food' ? '🧾 Order food' : '📺 Open app'}
            </SecondaryButton>
            <SecondaryButton onClick={share}>🔗 Share plan</SecondaryButton>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-sm font-medium text-[var(--color-muted)]"
        >
          Keep swiping
        </button>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
