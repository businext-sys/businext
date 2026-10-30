# Radar de tendencias · shared-core (`packages/shared-core`)

> Visión general en [README.md](README.md). Lo que va aquí es lo que web y móvil
> necesitan por igual: tipos, schemas, cliente de API y hooks puros.

## Tipos (`src/trends/index.ts`, nuevo dominio)

Se derivan de `src/api/generated-types.ts` tras regenerarlo con
`export_schema.py` del backend; este fichero solo exporta alias con nombres de
dominio y las uniones literales:

```ts
export type SocialNetwork = "instagram" | "tiktok";
export type ContentFormat = "reel" | "short" | "carrusel" | "story";
export type SuggestionStatus = "pending" | "sent" | "opened" | "dismissed" | "published";
export type SocialAccountStatus = "pending" | "connected" | "expired" | "revoked";
export type PostFormat = "reel" | "trial_reel" | "tiktok";
export type PostStatus = "draft" | "scheduled" | "published" | "failed" | "cancelled";

export interface TrendItem {
  id: string;
  title: string;
  network: SocialNetwork;
  growthPct: number | null;
  url: string | null;
  observedAt: string;
}

export interface TrendInsight {
  date: string;
  analysis: string;
  matchedServices: string[];
  trends: TrendItem[];
}

export interface ContentSuggestion {
  id: number;
  network: SocialNetwork;
  format: ContentFormat;
  idea: string;
  captionHint: string;
  audioHint: string | null;
  publishAt: string;
  status: SuggestionStatus;
  sourceTrendIds: string[];
}

export interface ContentPreferences {
  enabled: boolean;
  networks: SocialNetwork[];
  maxPerDay: number;
  quietFrom: string; // "22:00"
  quietTo: string;   // "09:00"
  timezone: string;
  language: string;  // "es"
  country: string;   // "ES"
}

export interface SocialAccount {
  id: number;
  network: SocialNetwork;
  handle: string | null;
  status: SocialAccountStatus;
  connectedAt: string | null;
}

export interface ContentPost {
  id: number;
  suggestionId: number | null;
  network: SocialNetwork;
  format: PostFormat;
  caption: string;
  isAiGenerated: boolean;
  publishAt: string;
  status: PostStatus;
  error: string | null;
  publishedUrl: string | null;
}
```

Mappers snake_case → camelCase en `src/mappers/`, como el resto de dominios.

## Schemas (`src/schemas/trends.ts`)

Zod para el formulario de preferencias: `maxPerDay` 1-3, al menos una red,
horas `HH:mm`, `quietFrom !== quietTo`.

Zod para aprobar una publicación: `caption` no vacío y como máximo 2.200
caracteres (límite de Instagram), `publishAt` en el futuro, `trial_reel` solo
con `network === "instagram"`.

## API (`src/api/trendsApi.ts`)

Mismo patrón que `weeklySummaryApi.ts` (cliente inyectable):

| Método | Llama a |
|---|---|
| `getInsight()` | `GET /trends/insight` |
| `refreshInsight()` | `POST /trends/insight/refresh` (mensaje de error del `detail`, como `generate`) |
| `listSuggestions(status?)` | `GET /trends/suggestions` |
| `updateSuggestion(id, status)` | `PATCH /trends/suggestions/{id}` |
| `getPreferences()` / `savePreferences(p)` | `GET` / `PUT /trends/preferences` |
| `listSocialAccounts()` | `GET /social/accounts` |
| `connectSocialAccount(network)` | `POST /social/accounts/{network}/connect` (devuelve el enlace) |
| `disconnectSocialAccount(id)` | `DELETE /social/accounts/{id}` |
| `createUploadUrl()` | `POST /trends/posts/upload-url` |
| `listPosts(status?)` | `GET /trends/posts` |
| `createPost(p)` / `updatePost(id, p)` | `POST /trends/posts` / `PATCH /trends/posts/{id}` |
| `approvePost(id)` / `cancelPost(id)` | `POST /trends/posts/{id}/approve` / `.../cancel` (mensaje de error del `detail`, que trae el error de Metricool) |

La subida del vídeo a la URL firmada la hace cada app con su API de ficheros
(`fetch` con `File` en web, `expo-file-system` en móvil): shared-core solo
pide la URL.

## Hooks (`src/hooks/`)

- `useTrendInsight()`: SWR, sin refetch al foco (el análisis cambia una vez al
  día).
- `useContentSuggestions()`: SWR; `dismiss(id)` y `markPublished(id)` con UI
  optimista (`mutate` + `rollbackOnError`), como el resto de hooks CRUD.
- `useContentPreferences()`: lectura + guardado optimista.
- `useSocialAccounts()`: SWR; revalida al foco para ver la red conectada al
  volver de la autorización.
- `useContentPosts()`: SWR; `approve(id)` y `cancel(id)` sin UI optimista (el
  resultado depende de Metricool) y revalidación cada minuto mientras haya
  posts `scheduled` con `publishAt` pasado.

## Access

Añadir `canViewTrends` a `src/access/index.ts`, espejo de la capability del
backend (owner y manager).

## Tests

Self-checks de los mappers y de los schemas de preferencias y de aprobación, en
la misma forma que los existentes del paquete.
