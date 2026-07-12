import clsx from 'clsx'
import { useApp } from '../store/AppContext'

export default function PartnerSwitcher() {
  const { profile, activePartner, setActivePartner } = useApp()

  return (
    <div className="flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1 text-xs">
      {(['A', 'B'] as const).map((id) => (
        <button
          key={id}
          onClick={() => setActivePartner(id)}
          className={clsx(
            'rounded-full px-2.5 py-1 font-medium transition-colors',
            activePartner === id
              ? 'bg-[var(--color-hot-pink)] text-white'
              : 'text-[var(--color-muted)]',
          )}
        >
          {profile.partners[id].name || `Partner ${id}`}
        </button>
      ))}
    </div>
  )
}
