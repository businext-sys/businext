import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import {
  DEFAULT_THEME_MODE,
  themeColors,
  type ThemeColors,
  type ThemeMode,
} from "@businext/shared-core/theme";

const THEME_MODE_KEY = "businext.theme-mode";

type ThemeValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeValue>({
  mode: DEFAULT_THEME_MODE,
  colors: themeColors[DEFAULT_THEME_MODE],
  setMode: () => {},
});

/** Modo de color de la app (oscuro por defecto), guardado en el dispositivo. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);

  useEffect(() => {
    SecureStore.getItemAsync(THEME_MODE_KEY)
      .then((stored) => {
        if (stored === "light") setModeState("light");
      })
      .catch(() => {});
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    SecureStore.setItemAsync(THEME_MODE_KEY, next).catch(() => {});
  };

  return (
    <ThemeContext.Provider value={{ mode, colors: themeColors[mode], setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}

type Styles = Parameters<typeof StyleSheet.create>[0];

/**
 * Hoja de estilos que depende de los colores del modo activo. Se crea una vez
 * por modo, no en cada render.
 */
export function themedStyles<T extends Styles>(
  factory: (colors: ThemeColors) => T
): () => Readonly<T> {
  const sheets = new Map<ThemeMode, Readonly<T>>();
  return function useStyles() {
    const { mode, colors } = useTheme();
    let sheet = sheets.get(mode);
    if (!sheet) {
      sheet = StyleSheet.create(factory(colors));
      sheets.set(mode, sheet);
    }
    return sheet;
  };
}
