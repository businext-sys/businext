/**
 * Theme unico de MUI para Businext.
 *
 * MUI se usa solo para los date/time pickers de `@mui/x-date-pickers`, que
 * pintan con su propio sistema de estilos y no ven las clases de Tailwind. Este
 * modulo es el puente: mapea la paleta de MUI a los tokens de `globals.css` para
 * que los pickers salgan turquesa (marca) y no azul (default de MUI).
 *
 * Importalo en cualquier sitio que necesite `ThemeProvider`: no se instancian
 * themes ad-hoc en componentes.
 *
 * Por que hay hex aqui y no `var(--color-*)`, a diferencia de
 * `chartjs-dark-theme.ts`: MUI deriva colores de `palette.*` con operaciones que
 * necesitan un color parseable (`alpha()`, `darken()`, `getContrastText()`), y
 * un `var(...)` las rompe. Los tokens se replican en `COLOR_TOKENS` y un chequeo
 * dev-only avisa si divergen de `globals.css` (que sigue siendo la fuente de
 * verdad). Los overrides de `components` si usan `var(--color-*)`, porque ahi el
 * valor viaja intacto al CSS.
 */

import { createTheme } from "@mui/material/styles";

/**
 * Espejo en TS de los tokens de color de `globals.css` que MUI necesita como
 * color literal. Clave = custom property del `@theme`, valor = su mismo hex.
 */
const COLOR_TOKENS = {
  "--color-background": "#0c1117",
  "--color-surface": "#1b2733",
  "--color-surface-raised": "#24333f",
  "--color-primary": "#41d9d6",
  "--color-primary-hover": "#6be5e2",
  "--color-primary-foreground": "#0c1117",
  "--color-secondary": "#22b8c8",
  "--color-secondary-hover": "#3fcddb",
  "--color-secondary-foreground": "#0c1117",
  "--color-foreground": "#f5fafc",
  "--color-foreground-muted": "#c3d5dc",
  "--color-foreground-subtle": "#7e97a1",
  "--color-border": "#24333f",
  "--color-success": "#34d399",
  "--color-success-foreground": "#0c1117",
  "--color-danger": "#f4574b",
  "--color-danger-foreground": "#0c1117",
  "--color-warning": "#f5a623",
  "--color-warning-foreground": "#0c1117",
} as const;

/** Hex de un token, referenciado por el nombre de su custom property. */
function token(property: keyof typeof COLOR_TOKENS): string {
  return COLOR_TOKENS[property];
}

export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: token("--color-primary"),
      light: token("--color-primary-hover"),
      contrastText: token("--color-primary-foreground"),
    },
    secondary: {
      main: token("--color-secondary"),
      light: token("--color-secondary-hover"),
      contrastText: token("--color-secondary-foreground"),
    },
    success: {
      main: token("--color-success"),
      contrastText: token("--color-success-foreground"),
    },
    error: {
      main: token("--color-danger"),
      contrastText: token("--color-danger-foreground"),
    },
    warning: {
      main: token("--color-warning"),
      contrastText: token("--color-warning-foreground"),
    },
    /* `paper` es surface-raised para que el popup del picker flote sobre el
       modal, que ya es `bg-surface`. */
    background: {
      default: token("--color-background"),
      paper: token("--color-surface-raised"),
    },
    text: {
      primary: token("--color-foreground"),
      secondary: token("--color-foreground-muted"),
      disabled: token("--color-foreground-subtle"),
    },
    divider: token("--color-border"),
    action: { active: token("--color-foreground-muted") },
  },

  /* 6px = --radius-md, el mismo `rounded-md` de los inputs de la app. */
  shape: { borderRadius: 6 },

  typography: {
    fontFamily: "var(--font-sans, system-ui, sans-serif)",
    /* Los botones de la app no van en mayusculas (ver components/ui/button). */
    button: { textTransform: "none" },
  },

  components: {
    /* Iguala el input del picker a `ReservationInput`: fondo surface, borde
       input y foco con borde + ring primary. */
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--color-surface)",
          transition: "border-color 150ms var(--ease-snappy), box-shadow 150ms",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-input)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-primary)",
          },
          "&.Mui-focused": {
            boxShadow:
              "0 0 0 2px color-mix(in srgb, var(--color-ring) 25%, transparent)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-primary)",
            borderWidth: 1,
          },
        },
        input: { color: "var(--color-foreground)" },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "var(--color-foreground-subtle)",
          "&.Mui-focused": { color: "var(--color-primary)" },
        },
      },
    },

    /* MUI tinta los Paper de dark mode con un overlay de elevacion; se quita
       para que el popup use exactamente el token de superficie. */
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid var(--color-border)",
        },
      },
    },
  },
});

/**
 * Avisa en dev si `COLOR_TOKENS` se ha quedado desfasado respecto a
 * `globals.css`. Se lee el CSSOM directamente (y no `cssToken()`) para no
 * avisar de tokens que Tailwind no emite: en v4 solo llegan al CSS las
 * variables de `@theme` que usa alguna utilidad, y no tener valor que comparar
 * no es una divergencia.
 */
function warnOnTokenDrift(): void {
  const rootStyle = getComputedStyle(document.documentElement);

  for (const [property, hex] of Object.entries(COLOR_TOKENS)) {
    const emitted = rootStyle.getPropertyValue(property).trim().toLowerCase();
    if (!emitted || emitted === hex) continue;

    console.warn(
      `[mui-theme] ${property} es ${emitted} en globals.css pero ${hex} en ` +
        "COLOR_TOKENS. Actualiza el theme de MUI para seguir la paleta."
    );
  }
}

if (process.env.NODE_ENV !== "production" && typeof document !== "undefined") {
  warnOnTokenDrift();
}
