import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { AnyCard, Match } from '../types'
import { useApp } from '../store/AppContext'
import { PrimaryButton, SecondaryButton } from './ui'

function isBundle(card: AnyCard): card is Extract<AnyCard, { kind: 'bundle' }> {
  return card.kind === 'bundle'
}

export default function MatchOverlay({
  match,
  onClose,
}: {
  match: Match
  onClose: () => void
}) {
  const { toggleFavorite, isFavorite, addShoppingItem, createPlanFromBundle } =
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
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[480px] flex-col items-center justify-center bg-black/80 px-6 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.7, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="w-full rounded-[28px] bg-gradient-to-b from-[var(--color-surface-2)] to-[var(--color-base-2)] p-6 text-center shadow-2xl"
      >
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-1 bg-gradient-to-r from-[var(--color-hot-pink)] to-[var(--color-warm-orange)] bg-clip-text text-3xl font-extrabold text-transparent"
        >
          It's a match.
        </motion.p>
        <p className="mb-5 text-sm text-[var(--color-muted)]">
          You both want this.
        </p>

        <div className="mb-5 rounded-2xl bg-[var(--color-surface)] p-5">
          <div className="mb-2 text-6xl">{card.image}</div>
          <h3 className="text-xl font-bold text-[var(--color-ink)]">
            {card.title}
          </h3>
          <p className="mt-1 text-xs italic text-[var(--color-muted)]">
            "{card.reason}"
          </p>
        </div>

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
          className="mt-5 text-sm font-medium text-[var(--color-muted)]"
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
            className="fixed bottom-10 rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
