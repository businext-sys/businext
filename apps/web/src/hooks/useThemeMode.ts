"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME_MODE } from "@businext/shared-core/theme";
import { applyThemeMode, readThemeMode } from "@/lib/theme-mode";

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/** Modo de color activo (oscuro por defecto) y como cambiarlo. */
export function useThemeMode() {
  const mode = useSyncExternalStore(
    subscribe,
    readThemeMode,
    () => DEFAULT_THEME_MODE
  );
  return { mode, setMode: applyThemeMode };
}
