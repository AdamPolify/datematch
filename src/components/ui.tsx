import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

export function PrimaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={clsx(
        'w-full rounded-2xl bg-gradient-to-r from-[var(--color-hot-pink)] to-[var(--color-warm-orange)] px-5 py-3.5 text-center font-semibold text-white shadow-lg shadow-[rgba(255,93,143,0.25)] transition-transform active:scale-[0.98] disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={clsx(
        'w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3.5 text-center font-medium text-[var(--color-ink)] transition-transform active:scale-[0.98]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Chip({
  selected,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={clsx(
        'rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
        selected
          ? 'border-transparent bg-gradient-to-r from-[var(--color-hot-pink)] to-[var(--color-purple)] text-white'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Card({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
      {children}
    </h2>
  )
}
