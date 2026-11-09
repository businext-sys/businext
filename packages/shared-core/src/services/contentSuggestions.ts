import type { ContentSuggestion } from "../trends";

/**
 * Una idea sigue vigente hasta que acaba su dia (hora local) y mientras no se
 * haya descartado ni publicado.
 */
export function isCurrentSuggestion(
  suggestion: ContentSuggestion,
  now: Date = new Date()
): boolean {
  if (suggestion.status === "dismissed" || suggestion.status === "published") return false;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return new Date(suggestion.publishAt) >= startOfToday;
}

/** Ideas enviadas que el negocio aun no ha abierto: el badge de avisos. */
export function countNewSuggestions(
  suggestions: ContentSuggestion[],
  now: Date = new Date()
): number {
  return suggestions.filter((s) => s.status === "sent" && isCurrentSuggestion(s, now)).length;
}
