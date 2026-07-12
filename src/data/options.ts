import type {
  StreamingService,
  Cuisine,
  DietaryTag,
  Genre,
  Mood,
  Budget,
  CookingEffort,
} from '../types'

export const STREAMING_SERVICES: StreamingService[] = [
  'Netflix',
  'HBO Max',
  'Disney+',
  'Prime Video',
  'Hulu',
  'Apple TV+',
  'Paramount+',
  'YouTube',
]

export const CUISINES: Cuisine[] = [
  'Italian',
  'Japanese',
  'Mexican',
  'American',
  'Thai',
  'Indian',
  'Mediterranean',
  'Chinese',
  'French',
  'Homemade',
]

export const DIETARY_TAGS: DietaryTag[] = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'halal',
  'kosher',
]

export const GENRES: Genre[] = [
  'romance',
  'comedy',
  'thriller',
  'horror',
  'documentary',
  'stand-up',
  'drama',
  'action',
  'sci-fi',
  'animated',
]

export const MOODS: Mood[] = [
  'cozy',
  'romantic',
  'funny',
  'scary',
  'fancy',
  'lazy',
  'nostalgic',
  'spontaneous',
]

export const MOOD_EMOJI: Record<Mood, string> = {
  cozy: '🕯️',
  romantic: '💕',
  funny: '😂',
  scary: '🎃',
  fancy: '🥂',
  lazy: '🛋️',
  nostalgic: '📼',
  spontaneous: '⚡',
}

export const BUDGETS: Budget[] = ['$', '$$', '$$$']

export const COOKING_EFFORTS: CookingEffort[] = [
  'no cooking',
  'light cooking',
  'full cooking',
]

export const SNACK_PREFERENCES = [
  'sweet',
  'salty',
  'spicy',
  'chocolate',
  'candy',
  'chips',
  'ice cream',
  'baked goods',
]
