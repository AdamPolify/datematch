import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const tabs = [
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/dates', label: 'Dates', icon: '📅' },
  { to: '/preferences', label: 'Us', icon: '👥' },
]

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 flex justify-around border-t border-black/5 bg-white px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            clsx(
              'flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition-colors',
              isActive ? 'text-black' : 'text-black/30',
            )
          }
        >
          <span className="text-2xl leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
