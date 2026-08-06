export const SHARED_CORE_VERSION = "0.0.0";

// Tipos y funciones de dominio puros, compartidos entre apps/web y el futuro
// apps/mobile. Ver el criterio de que va aqui vs en cada app en README.md.
// Referencias: specs/001-extraer-core-compartido/{data-model,research,contracts}.md

export * from "./reservation";
export * from "./finances";
export * from "./configuration";
export * from "./product";
export * from "./location";
export * from "./working-hours";
export * from "./booking-request";
export * from "./employee";
export * from "./access";
export * from "./intelligence";
export * from "./google-reviews";
export * from "./schemas";

// Pendientes de issues siguientes de la Fase 3:
// - #14 schemas zod
// - #15 mappers snake_case <-> camelCase adicionales (reservation, configuration)
// - #16 apiClient + hooks
// - #17 servicios de negocio (scheduling/availability.ts, intelligence/client-scoring.ts)
// - #18 tipos generados desde OpenAPI
// - #19 migracion moment-timezone -> dayjs
