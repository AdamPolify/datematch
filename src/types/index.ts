export type Mood =
  | 'cozy'
  | 'romantic'
  | 'funny'
  | 'scary'
  | 'fancy'
  | 'lazy'
  | 'nostalgic'
  | 'spontaneous'

export type Budget = '$' | '$$' | '$$$'

export type CookingEffort = 'no cooking' | 'light cooking' | 'full cooking'

export type StreamingService =
  | 'Netflix'
  | 'HBO Max'
  | 'Disney+'
  | 'Prime Video'
  | 'Hulu'
  | 'Apple TV+'
  | 'Paramount+'
  | 'YouTube'

export type Cuisine =
  | 'Italian'
  | 'Japanese'
  | 'Mexican'
  | 'American'
  | 'Thai'
  | 'Indian'
  | 'Mediterranean'
  | 'Chinese'
  | 'French'
  | 'Homemade'

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'halal'
  | 'kosher'

export type Genre =
  | 'romance'
  | 'comedy'
  | 'thriller'
  | 'horror'
  | 'documentary'
  | 'stand-up'
  | 'drama'
  | 'action'
  | 'sci-fi'
  | 'animated'

export type CardKind = 'movie' | 'food' | 'snack' | 'drink' | 'bundle'

export interface BaseCard {
  id: string
  kind: CardKind
  title: string
  image: string
  mood: Mood[]
  reason: string
}

export interface MovieCard extends BaseCard {
  kind: 'movie'
  genre: Genre[]
  runtimeMinutes: number
  platform: StreamingService
  rating: string
  synopsis: string
  cast: string[]
}

export interface FoodCard extends BaseCard {
  kind: 'food'
  cuisine: Cuisine
  priceLevel: Budget
  method: 'delivery' | 'pickup' | 'cook at home'
  timeMinutes: number
  dietaryTags: DietaryTag[]
  ingredients: string[]
  steps: string[]
}

export interface SnackCard extends BaseCard {
  kind: 'snack'
  flavor: 'sweet' | 'salty' | 'spicy'
  source: 'store' | 'homemade'
  pairing: string
  ingredients: string[]
  steps: string[]
}

export interface DrinkCard extends BaseCard {
  kind: 'drink'
  alcoholic: boolean
  pairing: string
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: string[]
  steps: string[]
}

export interface BundleCard extends BaseCard {
  kind: 'bundle'
  food: FoodCard
  movie: MovieCard
  snack: SnackCard
  drink: DrinkCard
  estimatedTimeMinutes: number
  estimatedCost: Budget
}

export type AnyCard = MovieCard | FoodCard | SnackCard | DrinkCard | BundleCard

export type SwipeMode = 'bundle' | 'movie' | 'food' | 'snack' | 'drink' | 'quick'

export type PartnerId = 'A' | 'B'

export interface Preferences {
  streamingServices: StreamingService[]
  favoriteCuisines: Cuisine[]
  dislikedFoods: string[]
  dietaryRestrictions: DietaryTag[]
  snackPreferences: string[]
  favoriteGenres: Genre[]
  dislikedGenres: Genre[]
  budget: Budget
  moods: Mood[]
  alcohol: 'yes' | 'no' | 'sometimes'
  cookingEffort: CookingEffort
}

export interface PartnerProfile {
  id: PartnerId
  name: string
  joined: boolean
}

export interface CoupleProfile {
  coupleName: string
  inviteCode: string
  partners: Record<PartnerId, PartnerProfile>
  preferences: Preferences
  onboarded: boolean
}

export interface SwipeRecord {
  cardId: string
  cardKind: CardKind
  partner: PartnerId
  direction: 'left' | 'right'
}

export interface Match {
  id: string
  card: AnyCard
  matchedAt: number
}

export interface DateNightPlan {
  id: string
  createdAt: number
  bundle: BundleCard
  startTime: string
  notes: string
  shoppingListIds: string[]
}

export interface ShoppingItem {
  id: string
  label: string
  checked: boolean
  source: 'auto' | 'manual'
}
