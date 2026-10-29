/**
 * Tokens de la identidad visual (`DESIGN.md` en la raiz del repo), comunes a
 * `apps/web` y `apps/mobile`. Oscuro "Noche de barrio" por defecto y claro
 * "Taller": mismas claves, misma funcion, distinta paleta.
 */

export type ThemeMode = "dark" | "light";

export const DEFAULT_THEME_MODE: ThemeMode = "dark";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceOverlay: string;
  border: string;
  borderSubtle: string;
  input: string;
  ring: string;
  foreground: string;
  foregroundMuted: string;
  foregroundSubtle: string;
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  secondary: string;
  secondaryHover: string;
  secondaryForeground: string;
  accent: string;
  accentHover: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  success: string;
  successForeground: string;
  danger: string;
  dangerForeground: string;
  warning: string;
  warningForeground: string;
  highlight: string;
}

export const themeColors: Record<ThemeMode, ThemeColors> = {
  dark: {
    background: "#0F0E0C",
    surface: "#1C1A17",
    surfaceRaised: "#2A2621",
    surfaceOverlay: "rgba(15, 14, 12, 0.95)",
    border: "#3A3530",
    borderSubtle: "#24211D",
    input: "#3A3530",
    ring: "#41D9D6",
    foreground: "#F4F1EC",
    foregroundMuted: "#D6CEC5",
    foregroundSubtle: "#A89E93",
    primary: "#41D9D6",
    primaryHover: "#7FE8E5",
    primaryForeground: "#0F0E0C",
    secondary: "#D08B5B",
    secondaryHover: "#DFA47A",
    secondaryForeground: "#0F0E0C",
    accent: "#12302F",
    accentHover: "#1A4140",
    accentForeground: "#F4F1EC",
    muted: "#171513",
    mutedForeground: "#B5ABA0",
    success: "#34D399",
    successForeground: "#0F0E0C",
    danger: "#F4574B",
    dangerForeground: "#0F0E0C",
    warning: "#F5A623",
    warningForeground: "#0F0E0C",
    highlight: "#F97316",
  },
  light: {
    background: "#F4F1EC",
    surface: "#FBF9F6",
    surfaceRaised: "#EFE3D8",
    surfaceOverlay: "rgba(244, 241, 236, 0.95)",
    border: "#E2DBD2",
    borderSubtle: "#EAE4DC",
    input: "#CFC5B9",
    ring: "#8A5A3C",
    foreground: "#14110E",
    foregroundMuted: "#3F3832",
    foregroundSubtle: "#5E554D",
    primary: "#8A5A3C",
    primaryHover: "#74492F",
    primaryForeground: "#FBF9F6",
    secondary: "#0E6E6E",
    secondaryHover: "#0B5A5A",
    secondaryForeground: "#FBF9F6",
    accent: "#DCEDEC",
    accentHover: "#CBE3E1",
    accentForeground: "#0B4F4F",
    muted: "#EAE4DC",
    mutedForeground: "#5E554D",
    success: "#1A6B43",
    successForeground: "#FBF9F6",
    danger: "#B3261E",
    dangerForeground: "#FBF9F6",
    warning: "#8A5A00",
    warningForeground: "#FBF9F6",
    highlight: "#C2410C",
  },
};

export const fontFamilies = {
  display: "Big Shoulders Display",
  body: "DM Sans",
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  bubble: 14,
  full: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  touch: 44,
} as const;
