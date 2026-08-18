const FAVORITES_KEY = "agmerz_favorites";
export const FAVORITES_CHANGED_EVENT = "favorites-changed";

function notifyFavoritesChange(favorites: string[]): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: favorites }));
}

function getStoredFavorites(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  notifyFavoritesChange(ids);
}

export function pruneInvalidFavorites(validIds: string[]): string[] {
  const validSet = new Set(validIds);
  const favorites = getStoredFavorites();
  const pruned = favorites.filter((id) => validSet.has(id));

  if (pruned.length !== favorites.length) {
    saveFavorites(pruned);
  }

  return pruned;
}

export function getFavorites(): string[] {
  return getStoredFavorites();
}

export function isFavorite(propertyId: string): boolean {
  return getStoredFavorites().includes(propertyId);
}

export function addFavorite(propertyId: string): string[] {
  const favorites = getStoredFavorites();
  if (!favorites.includes(propertyId)) {
    favorites.push(propertyId);
    saveFavorites(favorites);
  }
  return favorites;
}

export function removeFavorite(propertyId: string): string[] {
  const favorites = getStoredFavorites().filter((id) => id !== propertyId);
  saveFavorites(favorites);
  return favorites;
}

export function toggleFavorite(propertyId: string): { favorites: string[]; isFavorite: boolean } {
  const currentlyFavorite = isFavorite(propertyId);
  const favorites = currentlyFavorite
    ? removeFavorite(propertyId)
    : addFavorite(propertyId);

  return { favorites, isFavorite: !currentlyFavorite };
}
