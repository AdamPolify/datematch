import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { AnyCard } from '../types'
import { DateCardFront, DateCardBack } from './DateCard'

const TAP_DISTANCE = 10
const TAP_DURATION = 400

export default function FlippableCard({
  card,
  interactive = true,
}: {
  card: AnyCard
  interactive?: boolean
}) {
  const [flipped, setFlipped] = useState(false)
  const pointerStart = useRef<{ x: number; y: number; t: number } | null>(null)

  function handlePointerDown(e: React.PointerEvent) {
    pointerStart.current = { x: e.clientX, y: e.clientY, t: Date.now() }
  }

  function handlePointerUp(e: React.PointerEvent) {
    const start = pointerStart.current
    pointerStart.current = null
    if (!start || !interactive) return
    const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y)
    const dt = Date.now() - start.t
    if (dist < TAP_DISTANCE && dt < TAP_DURATION) {
      setFlipped((f) => !f)
    }
  }

  return (
    <div
      className="h-full w-full"
      style={{ perspective: 1400 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <DateCardFront card={card} />
        </div>
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <DateCardBack card={card} />
        </div>
      </motion.div>
    </div>
  )
}
