/**
 * Lectura en runtime de los design tokens definidos en `globals.css` (@theme).
 *
 * Existe para el codigo que pinta sobre canvas (Chart.js) y no puede usar
 * `var(--color-*)`: en vez de duplicar los hex en TS, los resuelve desde el
 * CSSOM, de modo que `globals.css` sigue siendo la unica fuente de verdad.
 *
 * En SSR no hay CSSOM: los lectores devuelven "" y el valor real se resuelve en
 * el primer render de cliente, que es donde se pinta el canvas.
 *
 * Los valores se cachean tras la primera lectura en el navegador porque la app
 * tiene un unico theme (dark). Si algun dia hay theme switching, habra que
 * invalidar `cache` / `paletteCache` al cambiar de theme.
 */

/** Tope de series que se intenta leer de la paleta (`--color-chart-N`). */
const MAX_CHART_SERIES = 12;

const cache = new Map<string, string>();

/** Lectura cruda de una custom property de `:root`, sin avisos. */
function read(property: string): string {
  if (typeof document === "undefined") return "";

  const cached = cache.get(property);
  if (cached !== undefined) return cached;

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim();

  if (value) cache.set(property, value);
  return value;
}

/**
 * Valor de una CSS custom property de `:root` (ej. `--color-foreground`).
 * Avisa en dev si el token no llego al CSS emitido.
 */
export function cssToken(property: string): string {
  const value = read(property);

  const inBrowser = typeof document !== "undefined";
  if (!value && inBrowser && process.env.NODE_ENV !== "production") {
    console.warn(
      `[theme-tokens] ${property} no esta en el CSS emitido. Tailwind v4 solo ` +
        "emite las variables de @theme que usa alguna utilidad: declarala en " +
        "@theme static si solo se consume desde JS."
    );
  }

  return value;
}

/** Color del theme por nombre corto: `colorToken("foreground-muted")`. */
export function colorToken(name: string): string {
  return cssToken(`--color-${name}`);
}

let paletteCache: readonly string[] | null = null;

/**
 * Paleta categorica de charts (`--color-chart-1..N`) en orden de prioridad.
 * Anadir un `--color-chart-6` en `globals.css` lo incorpora sin tocar TS.
 */
export function chartPalette(): readonly string[] {
  if (paletteCache) return paletteCache;

  const colors: string[] = [];
  for (let index = 1; index <= MAX_CHART_SERIES; index++) {
    const color = read(`--color-chart-${index}`);
    if (!color) break;
    colors.push(color);
  }

  if (colors.length) paletteCache = colors;
  return colors;
}

/**
 * Mismo color con opacidad, para rellenos de area sobre canvas (donde no se
 * puede usar `color-mix()`). Devuelve el color intacto si no sabe parsearlo.
 */
export function withAlpha(color: string, alpha: number): string {
  const clamped = Math.min(Math.max(alpha, 0), 1);

  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color);
  const expanded = short
    ? `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`
    : color;

  const hex = /^#([0-9a-f]{6})$/i.exec(expanded);
  if (hex) {
    const suffix = Math.round(clamped * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${hex[1]}${suffix}`;
  }

  const rgb = /^rgba?\(([^)]+)\)$/i.exec(color);
  if (rgb) {
    const [r, g, b] = rgb[1].split(/[\s,/]+/).filter(Boolean);
    if (r && g && b) return `rgba(${r}, ${g}, ${b}, ${clamped})`;
  }

  return color;
}
