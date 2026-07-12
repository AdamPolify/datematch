import { useState } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import type { AnyCard } from '../types'
import FlippableCard from './FlippableCard'

const SWIPE_THRESHOLD = 100

function SwipeableTopCard({
  card,
  onSwiped,
}: {
  card: AnyCard
  onSwiped: (direction: 'left' | 'right') => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const likeOpacity = useTransform(x, [20, 120], [0, 1])
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0])
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null)

  function handleDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 600) {
      setExiting('right')
      onSwiped('right')
    } else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -600) {
      setExiting('left')
      onSwiped('left')
    }
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      animate={
        exiting
          ? { x: exiting === 'right' ? 500 : -500, opacity: 0, rotate: exiting === 'right' ? 20 : -20 }
          : { x: 0 }
      }
      transition={{ duration: 0.35 }}
    >
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute left-5 top-8 z-10 rotate-[-12deg] rounded-lg border-4 border-[var(--color-gold)] px-3 py-1 text-xl font-extrabold text-[var(--color-gold)]"
      >
        YES
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute right-5 top-8 z-10 rotate-[12deg] rounded-lg border-4 border-white/70 px-3 py-1 text-xl font-extrabold text-white/70"
      >
        NO
      </motion.div>
      <FlippableCard card={card} />
    </motion.div>
  )
}

export default function SwipeDeck({
  cards,
  onSwipe,
}: {
  cards: AnyCard[]
  onSwipe: (card: AnyCard, direction: 'left' | 'right') => void
}) {
  const visible = cards.slice(0, 3)

  return (
    <div className="relative mx-auto aspect-[3/4.6] w-full max-w-sm">
      <AnimatePresence>
        {visible
          .slice()
          .reverse()
          .map((card, i) => {
            const depth = visible.length - 1 - i
            const isTop = depth === 0
            return (
              <motion.div
                key={card.id}
                className="absolute inset-0"
                initial={false}
                animate={{
                  scale: 1 - depth * 0.04,
                  y: depth * 12,
                  opacity: depth > 2 ? 0 : 1,
                }}
                exit={{ opacity: 0, transition: { delay: 0.3, duration: 0.05 } }}
                style={{ zIndex: 10 - depth }}
              >
                {isTop ? (
                  <SwipeableTopCard
                    card={card}
                    onSwiped={(dir) => onSwipe(card, dir)}
                  />
                ) : (
                  <FlippableCard card={card} interactive={false} />
                )}
              </motion.div>
            )
          })}
      </AnimatePresence>
    </div>
  )
}
