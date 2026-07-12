import type { AnyCard, Preferences, PartnerId } from '../types'

function scoreCard(card: AnyCard, prefs: Preferences): number {
  let score = 0

  const moodOverlap = card.mood.filter((m) => prefs.moods.includes(m)).length
  score += moodOverlap * 2

  if (card.kind === 'movie') {
    if (prefs.streamingServices.includes(card.platform)) score += 2
    const genreHit = card.genre.some((g) => prefs.favoriteGenres.includes(g))
    const genreMiss = card.genre.some((g) => prefs.dislikedGenres.includes(g))
    if (genreHit) score += 2
    if (genreMiss) score -= 3
  }

  if (card.kind === 'food') {
    if (prefs.favoriteCuisines.includes(card.cuisine)) score += 2
    const dislikeHit = prefs.dislikedFoods.some((d) =>
      card.title.toLowerCase().includes(d.toLowerCase()),
    )
    if (dislikeHit) score -= 4
    const restrictionsMet = prefs.dietaryRestrictions.every((r) =>
      card.dietaryTags.includes(r),
    )
    if (prefs.dietaryRestrictions.length > 0 && !restrictionsMet) score -= 5
    if (
      card.priceLevel === '$$$' &&
      prefs.budget !== '$$$'
    ) {
      score -= 1
    }
    if (card.method === 'cook at home' && prefs.cookingEffort === 'no cooking') {
      score -= 2
    }
  }

  if (card.kind === 'snack') {
    if (prefs.snackPreferences.includes(card.flavor)) score += 2
  }

  if (card.kind === 'drink') {
    if (!card.alcoholic && prefs.alcohol === 'no') score += 1
    if (card.alcoholic && prefs.alcohol === 'no') score -= 3
  }

  if (card.kind === 'bundle') {
    score +=
      scoreCard(card.food, prefs) * 0.4 +
      scoreCard(card.movie, prefs) * 0.4 +
      scoreCard(card.snack, prefs) * 0.1 +
      scoreCard(card.drink, prefs) * 0.1
  }

  return score
}

export function simulatePartnerSwipe(
  card: AnyCard,
  prefs: Preferences,
): 'left' | 'right' {
  const score = scoreCard(card, prefs)
  const probability = 1 / (1 + Math.exp(-score / 2.5))
  return Math.random() < probability ? 'right' : 'left'
}

export function sortByPreferenceFit<T extends AnyCard>(
  cards: T[],
  prefs: Preferences,
): T[] {
  return [...cards].sort((a, b) => scoreCard(b, prefs) - scoreCard(a, prefs))
}

export function otherPartner(partner: PartnerId): PartnerId {
  return partner === 'A' ? 'B' : 'A'
}
