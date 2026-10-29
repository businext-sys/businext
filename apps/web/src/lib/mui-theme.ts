/**
 * Theme de MUI para Businext, uno por modo (oscuro y claro).
 *
 * MUI se usa solo para los date/time pickers de `@mui/x-date-pickers`, que
 * pintan con su propio sistema de estilos y no ven las clases de Tailwind. Este
 * modulo es el puente: mapea la paleta de MUI a los tokens de `globals.css` para
 * que los pickers salgan turquesa (marca) y no azul (default de MUI).
 *
 * Usa `createMuiTheme(mode)` en cualquier sitio que necesite `ThemeProvider`:
 * no se instancian themes ad-hoc en componentes.
 *
 * Por que hay hex aqui y no `var(--color-*)`, a diferencia de
 * `chartjs-dark-theme.ts`: MUI deriva colores de `palette.*` con operaciones que
 * necesitan un color parseable (`alpha()`, `darken()`, `getContrastText()`), y
 * un `var(...)` las rompe. Los hex salen de `themeColors` de
 * @businext/shared-core/theme, y un chequeo dev-only avisa si `globals.css`
 * diverge de ellos. Los overrides de `components` si usan `var(--color-*)`,
 * porque ahi el valor viaja intacto al CSS.
 */

import { createTheme } from "@mui/material/styles";
import { themeColors, type ThemeMode } from "@businext/shared-core/theme";
import { readThemeMode } from "./theme-mode";

export function createMuiTheme(mode: ThemeMode) {
  const colors = themeColors[mode];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
        light: colors.primaryHover,
        contrastText: colors.primaryForeground,
      },
      secondary: {
        main: colors.secondary,
        light: colors.secondaryHover,
        contrastText: colors.secondaryForeground,
      },
      success: {
        main: colors.success,
        contrastText: colors.successForeground,
      },
      error: {
        main: colors.danger,
        contrastText: colors.dangerForeground,
      },
      warning: {
        main: colors.warning,
        contrastText: colors.warningForeground,
      },
      /* `paper` es surface-raised para que el popup del picker flote sobre el
         modal, que ya es `bg-surface`. */
      background: {
        default: colors.background,
        paper: colors.surfaceRaised,
      },
      text: {
        primary: colors.foreground,
        secondary: colors.foregroundMuted,
        disabled: colors.foregroundSubtle,
      },
      divider: colors.border,
      action: { active: colors.foregroundMuted },
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
}

/**
 * Avisa en dev si `globals.css` se ha quedado desfasado respecto a
 * `themeColors`. Se lee el CSSOM directamente (y no `cssToken()`) para no
 * avisar de tokens que Tailwind no emite: en v4 solo llegan al CSS las
 * variables de `@theme` que usa alguna utilidad, y no tener valor que comparar
 * no es una divergencia.
 */
function warnOnTokenDrift(): void {
  const rootStyle = getComputedStyle(document.documentElement);
  const mode = readThemeMode();

  for (const [name, hex] of Object.entries(themeColors[mode])) {
    const property = `--color-${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
    const emitted = rootStyle.getPropertyValue(property).trim().toLowerCase();
    if (!emitted || emitted === hex.toLowerCase()) continue;

    console.warn(
      `[mui-theme] ${property} es ${emitted} en globals.css pero ${hex} en ` +
        `themeColors.${mode} (@businext/shared-core/theme). Alinea los dos.`
    );
  }
}

if (process.env.NODE_ENV !== "production" && typeof document !== "undefined") {
  warnOnTokenDrift();
}
