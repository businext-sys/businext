import type {
  ContentPreferencesParsed,
  ContentSuggestionParsed,
  TrendInsightParsed,
  TrendItemParsed,
} from "../schemas/trends";

export type TrendItem = TrendItemParsed;
export type TrendInsight = TrendInsightParsed;
export type ContentSuggestion = ContentSuggestionParsed;
export type ContentPreferences = ContentPreferencesParsed;

export type SocialNetwork = ContentSuggestion["network"];
export type ContentFormat = ContentSuggestion["format"];
export type SuggestionStatus = ContentSuggestion["status"];

/** Lo que la app puede cambiar de una sugerencia; el resto lo marca el backend. */
export type SuggestionStatusUpdate = Extract<
  SuggestionStatus,
  "opened" | "dismissed" | "published"
>;
