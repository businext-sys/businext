import { useEffect, type ReactNode } from "react";
import { useRouter, useSegments } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "./AuthContext";

/**
 * Redirige entre `/login` y la app segun el estado de sesion (issue
 * #029: "al reabrir la app, si hay token valido, saltar login"; y a la
 * inversa, si no hay sesion, forzar login antes de ver cualquier
 * pantalla protegida).
 */
export function AuthGate({ children }: { children: ReactNode }) {
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
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
