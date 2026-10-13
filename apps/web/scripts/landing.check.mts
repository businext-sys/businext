// Self-check of the landing, following businext-sys/businext-web-system:
// contrast of every text/background pair it renders (WCAG AA), page weight per orientation
// against the budget, and one manifest entry per generated asset.
// It warns, never corrects or blocks: exit code is 0 unless a file is missing.
//
//   node --experimental-strip-types apps/web/scripts/landing.check.mts

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Tokens read straight from globals.css, so the check follows any palette change. */
function tokens(): Record<string, string> {
  const css = readFileSync(join(root, "src/app/globals.css"), "utf8");
  const out: Record<string, string> = {};
  for (const m of css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})\s*;/gi)) out[m[1]!] = m[2]!;
  return out;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

// [text token, background token, minimum]: 4.5 body text, 3 large text and UI.
const PAIRS: [string, string, number][] = [
  ["foreground", "background", 4.5],
  ["foreground-muted", "background", 4.5],
  ["foreground-muted", "surface", 4.5],
  ["foreground-muted", "surface-raised", 4.5],
  ["foreground-subtle", "background", 4.5],
  ["foreground-subtle", "surface", 4.5],
  ["primary", "background", 4.5],
  ["primary", "surface", 4.5],
  ["primary", "accent", 4.5],
  ["primary-foreground", "primary", 4.5],
  ["success", "surface", 4.5],
  ["success", "surface-raised", 4.5],
  ["warning", "surface", 3],
];

const BUDGET_KB = 1.5 * 1024; // no video on the page
const IMAGES = /\.(webp|png|jpe?g|avif)$/i;

const warnings: string[] = [];
const t = tokens();

for (const [fg, bg, min] of PAIRS) {
  if (!t[fg] || !t[bg]) {
    warnings.push(`contraste: falta el token --color-${!t[fg] ? fg : bg} en globals.css`);
    continue;
  }
  const ratio = contrastRatio(t[fg]!, t[bg]!);
  if (ratio < min)
    warnings.push(`contraste: ${fg} sobre ${bg} (${t[fg]} / ${t[bg]}) da ${ratio.toFixed(2)}:1, por debajo de ${min}:1`);
}

const dir = join(root, "public/landing");
const files = readdirSync(dir).filter((f) => IMAGES.test(f));
const kb = (f: string) => statSync(join(dir, f)).size / 1024;
const desktop = files.filter((f) => f.includes("-desktop")).reduce((s, f) => s + kb(f), 0);
const mobile = files.filter((f) => f.includes("-mobile")).reduce((s, f) => s + kb(f), 0);
for (const [label, total] of [["escritorio", desktop], ["móvil", mobile]] as const)
  if (total > BUDGET_KB) warnings.push(`peso: ${label} baja ${Math.round(total)} KB de planchas, presupuesto ${BUDGET_KB} KB`);

const manifest = JSON.parse(readFileSync(join(root, "public/assets.manifest.json"), "utf8")) as {
  assets: { path: string; prompt?: string; model?: string; generation_id?: string }[];
};
const listed = new Set(manifest.assets.map((a) => a.path));
for (const f of files) if (!listed.has(`/landing/${f}`)) warnings.push(`manifest: /landing/${f} no tiene entrada`);
for (const a of manifest.assets) {
  if (!files.includes(a.path.replace("/landing/", ""))) warnings.push(`manifest: ${a.path} no existe en public/`);
  if (!a.prompt || !a.model || !a.generation_id) warnings.push(`manifest: ${a.path} sin prompt, modelo o id de generación`);
}

console.log(`planchas: escritorio ${Math.round(desktop)} KB · móvil ${Math.round(mobile)} KB (presupuesto ${BUDGET_KB} KB sin vídeo)`);
console.log(warnings.length ? `avisos:\n- ${warnings.join("\n- ")}` : "sin avisos");
