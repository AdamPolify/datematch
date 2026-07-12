import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AppProvider, useApp } from './store/AppContext'
import BottomNav from './components/BottomNav'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Swipe from './pages/Swipe'
import FullDateNight from './pages/FullDateNight'
import Matches from './pages/Matches'
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

const TAB_ROUTES = ['/home', '/matches', '/shopping', '/preferences']

function Shell() {
  const location = useLocation()
  const showNav = TAB_ROUTES.some((r) => location.pathname.startsWith(r))

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="flex-1">
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
            path="/full-date-night"
            element={
              <Gate>
                <FullDateNight />
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
