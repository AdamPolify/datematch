import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const tabs = [
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/browse', label: 'Browse', icon: '🔍' },
  { to: '/matches', label: 'Matches', icon: '💘' },
  { to: '/shopping', label: 'List', icon: '🛒' },
  { to: '/preferences', label: 'Us', icon: '⚙️' },
]

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 flex justify-around border-t border-[var(--color-border)] bg-[var(--color-base-2)]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            clsx(
              'flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'text-[var(--color-hot-pink)]'
                : 'text-[var(--color-muted)]',
            )
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
