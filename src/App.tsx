import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AppProvider, useApp } from './store/AppContext'
import BottomNav from './components/BottomNav'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Swipe from './pages/Swipe'
import Matches from './pages/Matches'
import Dates from './pages/Dates'
import Plan from './pages/Plan'
import Shopping from './pages/Shopping'
import Preferences from './pages/Preferences'

function Gate({ children }: { children: ReactNode }) {
  const { profile } = useApp()
  const location = useLocation()
  if (!profile.onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  return <>{children}</>
}

const TAB_ROUTES = [
  '/home',
  '/browse',
  '/matches',
  '/dates',
  '/shopping',
  '/preferences',
]

function Shell() {
  const location = useLocation()
  const showNav = TAB_ROUTES.some((r) => location.pathname.startsWith(r))

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/home"
            element={
              <Gate>
                <Home />
              </Gate>
            }
          />
          <Route
            path="/swipe/:mode"
            element={
              <Gate>
                <Swipe />
              </Gate>
            }
          />
          <Route
            path="/browse"
            element={
              <Gate>
                <Browse />
              </Gate>
            }
          />
          <Route
            path="/matches"
            element={
              <Gate>
                <Matches />
              </Gate>
            }
          />
          <Route
            path="/dates"
            element={
              <Gate>
                <Dates />
              </Gate>
            }
          />
          <Route
            path="/plan/:planId"
            element={
              <Gate>
                <Plan />
              </Gate>
            }
          />
          <Route
            path="/shopping"
            element={
              <Gate>
                <Shopping />
              </Gate>
            }
          />
          <Route
            path="/preferences"
            element={
              <Gate>
                <Preferences />
              </Gate>
            }
          />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
      {showNav && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
