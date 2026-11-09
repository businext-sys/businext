import { z } from "zod";

/**
 * Radar de tendencias (businext-sys/businext#161): analisis del dia,
 * sugerencias de contenido y preferencias del negocio, de `/trends/*` del
 * backend. Solo owner y manager (`canViewTrends`).
 */
export const SocialNetworkSchema = z.enum(["instagram", "tiktok"]);
export const ContentFormatSchema = z.enum(["reel", "short", "carrusel", "story"]);
export const SuggestionStatusSchema = z.enum([
  "pending",
  "sent",
  "opened",
  "dismissed",
  "published",
]);

/** Tendencia en la que se apoya el analisis, con el enlace a la fuente. */
export const TrendItemSchema = z.object({
  title: z.string(),
  network: SocialNetworkSchema,
  url: z.string(),
});

export const TrendInsightSchema = z.object({
  id: z.number(),
  day: z.string(),
  analysis: z.string(),
  matchedServices: z.array(z.string()),
  trends: z.array(TrendItemSchema),
  createdAt: z.string(),
  refreshedAt: z.string().nullable(),
});

/** `publishAt` y `sentAt` vienen en ISO con zona (UTC). */
export const ContentSuggestionSchema = z.object({
  id: z.number(),
  network: SocialNetworkSchema,
  format: ContentFormatSchema,
  idea: z.string(),
  script: z.array(z.string()),
  captionHint: z.string(),
  audioHint: z.string().nullable(),
  publishAt: z.string(),
  sourceTrendIds: z.array(z.string()),
  status: SuggestionStatusSchema,
  sentAt: z.string().nullable(),
});

/** Preferencias tal como las guarda el backend. */
export const ContentPreferencesSchema = z.object({
  enabled: z.boolean(),
  networks: z.array(SocialNetworkSchema),
  maxPerDay: z.number().int(),
  quietFrom: z.string(),
  quietTo: z.string(),
  timezone: z.string(),
  niche: z.string(),
  language: z.string(),
  country: z.string(),
});

const HOUR = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Formulario de preferencias: horas `HH:mm` y silencio con inicio y fin distintos. */
export const ContentPreferencesFormSchema = ContentPreferencesSchema.extend({
  networks: z.array(SocialNetworkSchema).min(1, "Elige al menos una red"),
  maxPerDay: z.number().int().min(1).max(3),
  quietFrom: z.string().regex(HOUR, "Hora no válida"),
  quietTo: z.string().regex(HOUR, "Hora no válida"),
  timezone: z.string().min(1),
  niche: z.string().min(1),
  language: z.string().min(2).max(5),
  country: z.string().length(2),
}).refine((p) => p.quietFrom !== p.quietTo, {
  message: "El silencio debe empezar y acabar a horas distintas",
  path: ["quietTo"],
});

export type TrendItemParsed = z.infer<typeof TrendItemSchema>;
export type TrendInsightParsed = z.infer<typeof TrendInsightSchema>;
export type ContentSuggestionParsed = z.infer<typeof ContentSuggestionSchema>;
export type ContentPreferencesParsed = z.infer<typeof ContentPreferencesSchema>;
