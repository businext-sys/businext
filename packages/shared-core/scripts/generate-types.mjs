#!/usr/bin/env node
/**
 * Genera packages/shared-core/src/api/generated-types.ts a partir del
 * OpenAPI schema del backend (businext-backend), usando openapi-typescript.
 *
 * Issue #018 (Fase 3).
 *
 * Uso:
 *   OPENAPI_URL=https://api.businext.app/openapi.json pnpm generate:types
 *   pnpm generate:types --from-file ./openapi.json
 *   pnpm generate:types   (usa OPENAPI_URL o el default de localhost)
 *
 * IMPORTANTE: este archivo se genera automaticamente (via este script, ya
 * sea localmente o desde el workflow .github/workflows/generate-types.yml).
 * No se edita a mano — cualquier cambio debe hacerse en el backend
 * (businext-backend) y regenerarse.
 */
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import openapiTS, { astToString } from "openapi-typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "src",
  "api",
  "generated-types.ts"
);

const DEFAULT_OPENAPI_URL = "http://localhost:8000/openapi.json";

const HEADER = `/**
 * ARCHIVO GENERADO AUTOMATICAMENTE — NO EDITAR A MANO.
 *
 * Generado desde el OpenAPI schema de businext-backend via
 * \`pnpm generate:types\` (packages/shared-core/scripts/generate-types.mjs).
 * Ver issue #018 y .github/workflows/generate-types.yml.
 */
`;

async function loadSchemaSource() {
  const fromFileFlagIndex = process.argv.indexOf("--from-file");
  if (fromFileFlagIndex !== -1) {
    const filePath = process.argv[fromFileFlagIndex + 1];
    if (!filePath) {
      throw new Error("--from-file requiere una ruta, ej: --from-file ./openapi.json");
    }
    const raw = await readFile(path.resolve(filePath), "utf-8");
    return JSON.parse(raw);
  }

  const url = process.env.OPENAPI_URL || DEFAULT_OPENAPI_URL;
  console.log(`Descargando OpenAPI schema desde ${url} ...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `No se pudo descargar el OpenAPI schema (${url}): HTTP ${response.status}`
    );
  }
  return response.json();
}

async function main() {
  const schema = await loadSchemaSource();
  const ast = await openapiTS(schema);
  const contents = astToString(ast);

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, HEADER + contents, "utf-8");

  console.log(`Tipos generados en ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
