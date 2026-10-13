# Radar de tendencias · shared-core (`packages/shared-core`)

> Visión general en [README.md](README.md). Lo que va aquí es lo que web y móvil
> necesitan por igual: tipos, schemas, cliente de API y hooks puros.

## Tipos (`src/trends/index.ts`, nuevo dominio)

Se derivan de `src/api/generated-types.ts` tras regenerarlo con
`export_schema.py` del backend; este fichero solo exporta alias con nombres de
dominio y las uniones literales:

```ts
export type SocialNetwork = "tiktok" | "instagram" | "youtube";
export type ContentFormat = "reel" | "short" | "carrusel" | "story";
export type SuggestionStatus = "pending" | "sent" | "opened" | "dismissed" | "published";

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
  region: string;
}
```

Mappers snake_case → camelCase en `src/mappers/`, como el resto de dominios.

## Schemas (`src/schemas/trends.ts`)

Zod para el formulario de preferencias: `maxPerDay` 1-3, al menos una red,
horas `HH:mm`, `quietFrom !== quietTo`.

## API (`src/api/trendsApi.ts`)

Mismo patrón que `weeklySummaryApi.ts` (cliente inyectable):

| Método | Llama a |
|---|---|
| `getInsight()` | `GET /trends/insight` |
| `refreshInsight()` | `POST /trends/insight/refresh` (mensaje de error del `detail`, como `generate`) |
| `listSuggestions(status?)` | `GET /trends/suggestions` |
| `updateSuggestion(id, status)` | `PATCH /trends/suggestions/{id}` |
| `getPreferences()` / `savePreferences(p)` | `GET` / `PUT /trends/preferences` |

## Hooks (`src/hooks/`)

- `useTrendInsight()`: SWR, sin refetch al foco (el análisis cambia una vez al
  día).
- `useContentSuggestions()`: SWR; `dismiss(id)` y `markPublished(id)` con UI
  optimista (`mutate` + `rollbackOnError`), como el resto de hooks CRUD.
- `useContentPreferences()`: lectura + guardado optimista.

## Access

Añadir `canViewTrends` a `src/access/index.ts`, espejo de la capability del
backend (owner y manager).

## Tests

Self-checks de los mappers y del schema de preferencias, en la misma forma que
los existentes del paquete.
