import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  title: string
  subtitle?: string
  onBack?: () => void
  right?: React.ReactNode
}

export default function TopBar({ title, subtitle, onBack, right }: TopBarProps) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-base)]/90 px-4 py-3 backdrop-blur">
      {onBack && (
        <button
          onClick={onBack ?? (() => navigate(-1))}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-ink)]"
          aria-label="Back"
        >
          ←
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold text-[var(--color-ink)]">
          {title}
        </h1>
        {subtitle && (
          <p className="truncate text-xs text-[var(--color-muted)]">{subtitle}</p>
        )}
      </div>
      {right}
    </header>
  )
}
