import { useEffect, type ReactNode } from "react";
import { useRouter, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "./AuthContext";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

/**
 * Redirige entre `/login` y la app segun el estado de sesion (issue
 * #029: "al reabrir la app, si hay token valido, saltar login"; y a la
 * inversa, si no hay sesion, forzar login antes de ver cualquier
 * pantalla protegida).
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    const inLogin = segments[0] === "login";

    if (status === "unauthenticated" && !inLogin) {
      router.replace("/login");
    } else if (status === "authenticated" && inLogin) {
      router.replace("/");
    }
  }, [status, segments, router]);

  if (status === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

const useStyles = themedStyles((colors) => ({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
}));
