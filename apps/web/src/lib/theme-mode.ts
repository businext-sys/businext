import { DEFAULT_THEME_MODE, type ThemeMode } from "@businext/shared-core/theme";
import { clearThemeTokenCache } from "./theme-tokens";

const STORAGE_KEY = "businext-theme";

/**
 * Se inyecta en `<head>` para fijar el modo guardado antes del primer pintado;
 * sin el, quien eligio el claro veria un destello del oscuro en cada carga.
 */
export const THEME_MODE_SCRIPT = `try{if(localStorage.getItem("${STORAGE_KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export function readThemeMode(): ThemeMode {
  if (typeof document === "undefined") return DEFAULT_THEME_MODE;
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function applyThemeMode(mode: ThemeMode): void {
  document.documentElement.dataset.theme = mode;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Sin almacenamiento (modo privado) el modo dura hasta recargar.
  }
  clearThemeTokenCache();
}
