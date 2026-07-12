import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AnyCard,
  BundleCard,
  CoupleProfile,
  DateNightPlan,
  Match,
  PartnerId,
  Preferences,
  ShoppingItem,
  SwipeRecord,
} from '../types'
import { simulatePartnerSwipe, otherPartner } from '../lib/matching'

const STORAGE_KEY = 'datematch-state-v1'

const defaultPreferences: Preferences = {
  streamingServices: [],
  favoriteCuisines: [],
  dislikedFoods: [],
  dietaryRestrictions: [],
  snackPreferences: [],
  favoriteGenres: [],
  dislikedGenres: [],
  budget: '$$',
  moods: [],
  alcohol: 'sometimes',
  cookingEffort: 'light cooking',
}

function randomInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

const defaultProfile: CoupleProfile = {
  coupleName: '',
  inviteCode: randomInviteCode(),
  partners: {
    A: { id: 'A', name: '', joined: false },
    B: { id: 'B', name: '', joined: false },
  },
  preferences: defaultPreferences,
  onboarded: false,
}

interface PersistedState {
  profile: CoupleProfile
  activePartner: PartnerId
  swipes: SwipeRecord[]
  matches: Match[]
  plans: DateNightPlan[]
  shoppingList: ShoppingItem[]
  favorites: string[]
}

const defaultState: PersistedState = {
  profile: defaultProfile,
  activePartner: 'A',
  swipes: [],
  matches: [],
  plans: [],
  shoppingList: [],
  favorites: [],
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

interface AppContextValue extends PersistedState {
  setActivePartner: (partner: PartnerId) => void
  updateProfile: (updates: Partial<CoupleProfile>) => void
  updatePreferences: (updates: Partial<Preferences>) => void
  setPartnerName: (partner: PartnerId, name: string) => void
  joinPartner: (partner: PartnerId) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  swipe: (card: AnyCard, direction: 'left' | 'right') => Match | null
  hasSwiped: (cardId: string, partner: PartnerId) => boolean
  myDirection: (cardId: string) => 'left' | 'right' | undefined
  toggleFavorite: (cardId: string) => void
  isFavorite: (cardId: string) => boolean
  createPlanFromBundle: (bundle: BundleCard) => DateNightPlan
  updatePlan: (planId: string, updates: Partial<DateNightPlan>) => void
  addShoppingItem: (label: string) => void
  toggleShoppingItem: (id: string) => void
  removeShoppingItem: (id: string) => void
  clearMatches: () => void
  resetSwipesForKind: (kind: AnyCard['kind']) => void
  registerMatch: (card: AnyCard) => Match
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<AppContextValue>(() => {
    return {
      ...state,

      setActivePartner: (partner) =>
        setState((s) => ({ ...s, activePartner: partner })),

      updateProfile: (updates) =>
        setState((s) => ({ ...s, profile: { ...s.profile, ...updates } })),

      updatePreferences: (updates) =>
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            preferences: { ...s.profile.preferences, ...updates },
          },
        })),

      setPartnerName: (partner, name) =>
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            partners: {
              ...s.profile.partners,
              [partner]: { ...s.profile.partners[partner], name },
            },
          },
        })),

      joinPartner: (partner) =>
        setState((s) => ({
          ...s,
          profile: {
            ...s.profile,
            partners: {
              ...s.profile.partners,
              [partner]: { ...s.profile.partners[partner], joined: true },
            },
          },
        })),

      completeOnboarding: () =>
        setState((s) => ({
          ...s,
          profile: { ...s.profile, onboarded: true },
        })),

      resetOnboarding: () =>
        setState(() => ({
          ...defaultState,
          profile: { ...defaultProfile, inviteCode: randomInviteCode() },
        })),

      hasSwiped: (cardId, partner) =>
        state.swipes.some((sw) => sw.cardId === cardId && sw.partner === partner),

      myDirection: (cardId) =>
        state.swipes.find(
          (sw) => sw.cardId === cardId && sw.partner === state.activePartner,
        )?.direction,

      swipe: (card, direction) => {
        let matchResult: Match | null = null
        setState((s) => {
          const partner = s.activePartner
          const already = s.swipes.some(
            (sw) => sw.cardId === card.id && sw.partner === partner,
          )
          if (already) return s

          const newSwipes: SwipeRecord[] = [
            ...s.swipes,
            { cardId: card.id, cardKind: card.kind, partner, direction },
          ]

          const partner2 = otherPartner(partner)
          const partner2Already = s.swipes.some(
            (sw) => sw.cardId === card.id && sw.partner === partner2,
          )

          let partner2Direction: 'left' | 'right' | undefined
          if (!partner2Already) {
            partner2Direction = simulatePartnerSwipe(
              card,
              s.profile.preferences,
            )
            newSwipes.push({
              cardId: card.id,
              cardKind: card.kind,
              partner: partner2,
              direction: partner2Direction,
            })
          } else {
            partner2Direction = s.swipes.find(
              (sw) => sw.cardId === card.id && sw.partner === partner2,
            )?.direction
          }

          const isMatch =
            direction === 'right' && partner2Direction === 'right'

          let newMatches = s.matches
          if (isMatch && !s.matches.some((m) => m.card.id === card.id)) {
            const match: Match = {
              id: `match-${card.id}-${Date.now()}`,
              card,
              matchedAt: Date.now(),
            }
            newMatches = [match, ...s.matches]
            matchResult = match
          }

          return { ...s, swipes: newSwipes, matches: newMatches }
        })
        return matchResult
      },

      toggleFavorite: (cardId) =>
        setState((s) => ({
          ...s,
          favorites: s.favorites.includes(cardId)
            ? s.favorites.filter((id) => id !== cardId)
            : [...s.favorites, cardId],
        })),

      isFavorite: (cardId) => state.favorites.includes(cardId),

      createPlanFromBundle: (bundle) => {
        const plan: DateNightPlan = {
          id: `plan-${bundle.id}-${Date.now()}`,
          createdAt: Date.now(),
          bundle,
          startTime: '7:30 PM',
          notes: '',
          shoppingListIds: [],
        }
        const autoItems: ShoppingItem[] =
          bundle.food.method === 'cook at home'
            ? [
                {
                  id: `item-${Date.now()}-food`,
                  label: `Ingredients for ${bundle.food.title}`,
                  checked: false,
                  source: 'auto' as const,
                },
              ]
            : []
        autoItems.push(
          {
            id: `item-${Date.now()}-snack`,
            label: bundle.snack.title,
            checked: false,
            source: 'auto',
          },
          {
            id: `item-${Date.now()}-drink`,
            label: bundle.drink.title,
            checked: false,
            source: 'auto',
          },
        )
        plan.shoppingListIds = autoItems.map((i) => i.id)
        setState((s) => ({
          ...s,
          plans: [plan, ...s.plans],
          shoppingList: [...s.shoppingList, ...autoItems],
        }))
        return plan
      },

      updatePlan: (planId, updates) =>
        setState((s) => ({
          ...s,
          plans: s.plans.map((p) =>
            p.id === planId ? { ...p, ...updates } : p,
          ),
        })),

      addShoppingItem: (label) =>
        setState((s) => ({
          ...s,
          shoppingList: [
            ...s.shoppingList,
            {
              id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              label,
              checked: false,
              source: 'manual',
            },
          ],
        })),

      toggleShoppingItem: (id) =>
        setState((s) => ({
          ...s,
          shoppingList: s.shoppingList.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item,
          ),
        })),

      removeShoppingItem: (id) =>
        setState((s) => ({
          ...s,
          shoppingList: s.shoppingList.filter((item) => item.id !== id),
        })),

      clearMatches: () => setState((s) => ({ ...s, matches: [] })),

      resetSwipesForKind: (kind) =>
        setState((s) => ({
          ...s,
          swipes: s.swipes.filter((sw) => sw.cardKind !== kind),
        })),

      registerMatch: (card) => {
        let result: Match = {
          id: `match-${card.id}`,
          card,
          matchedAt: Date.now(),
        }
        setState((s) => {
          const existing = s.matches.find((m) => m.card.id === card.id)
          if (existing) {
            result = existing
            return s
          }
          result = { id: `match-${card.id}-${Date.now()}`, card, matchedAt: Date.now() }
          return { ...s, matches: [result, ...s.matches] }
        })
        return result
      },
    }
  }, [state])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
