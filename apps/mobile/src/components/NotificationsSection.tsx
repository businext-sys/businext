import { useEffect, useState } from "react";
import { ActivityIndicator, AppState, Linking, Pressable, Switch, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  notificationPreferencesApi,
  type NotificationPreferences,
} from "@businext/shared-core/api";
import { Chip } from "@/components/Chip";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

const MINUTES = [5, 10, 15, 30, 60];
const HOURS = [7, 8, 9, 10];
type Toggle = "upcoming" | "dailySummary" | "reservationChanges" | "dayClose";

/** Ajustes > Notificaciones (issue #218): qué avisos llegan y cuándo. */
export function NotificationsSection() {
  const styles = useStyles();
  const { colors } = useTheme();
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unavailable" | "error">("loading");
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    notificationPreferencesApi
      .get()
      .then((loaded) => {
        setPrefs(loaded);
        setState(loaded ? "ready" : "unavailable");
      })
      .catch(() => setState("error"));
  }, []);

  useEffect(() => {
    const check = () =>
      Notifications.getPermissionsAsync()
        .then((permission) => setDenied(permission.status === "denied"))
        .catch(() => {});
    check();
    const subscription = AppState.addEventListener("change", (status) => {
      if (status === "active") check();
    });
    return () => subscription.remove();
  }, []);

  const save = async (next: NotificationPreferences) => {
    const previous = prefs;
    setPrefs(next);
    try {
      setPrefs(await notificationPreferencesApi.update(next));
    } catch {
      setPrefs(previous);
      setState("error");
    }
  };

  const anyOn = prefs ? prefs.upcoming || prefs.dailySummary || prefs.reservationChanges || prefs.dayClose : false;
  const setAll = (value: boolean) => {
    if (prefs) save({ ...prefs, upcoming: value, dailySummary: value, reservationChanges: value, dayClose: value });
  };
  const toggle = (key: Toggle) => (value: boolean) => {
    if (prefs) save({ ...prefs, [key]: value });
  };

  const row = (key: Toggle, label: string, hint: string) => (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.value}>{label}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
      <Switch
        value={prefs?.[key] ?? false}
        onValueChange={toggle(key)}
        trackColor={{ true: colors.primary, false: colors.border }}
        accessibilityLabel={label}
      />
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Notificaciones</Text>

      {denied && (
        <View style={styles.denied}>
          <Ionicons name="notifications-off-outline" size={18} color={colors.warning} />
          <Text style={styles.deniedText}>Las notificaciones están desactivadas en el teléfono.</Text>
          <Pressable onPress={() => Linking.openSettings()} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.link}>Abrir ajustes</Text>
          </Pressable>
        </View>
      )}

      {state === "loading" && <ActivityIndicator color={colors.primary} />}
      {state === "unavailable" && (
        <Text style={styles.hint}>Pronto podrás elegir aquí qué avisos recibir.</Text>
      )}
      {state === "error" && <Text style={styles.error}>No se han podido guardar las preferencias.</Text>}

      {prefs && (
        <>
          <View style={styles.row}>
            <Text style={[styles.value, styles.rowText]}>Recibir notificaciones</Text>
            <Switch
              value={anyOn}
              onValueChange={setAll}
              trackColor={{ true: colors.primary, false: colors.border }}
              accessibilityLabel="Recibir notificaciones"
              testID="notifications-master"
            />
          </View>
          <View style={styles.divider} />
          {row("upcoming", "Próxima cita", "Un aviso antes de cada cita")}
          {prefs.upcoming && (
            <View style={styles.chips}>
              {MINUTES.map((minutes) => (
                <Chip
                  key={minutes}
                  label={`${minutes} min antes`}
                  selected={prefs.upcomingMinutes === minutes}
                  onPress={() => save({ ...prefs, upcomingMinutes: minutes })}
                />
              ))}
            </View>
          )}
          {row("dailySummary", "Resumen de la mañana", "Las citas del día")}
          {prefs.dailySummary && (
            <View style={styles.chips}>
              {HOURS.map((hour) => (
                <Chip
                  key={hour}
                  label={`${hour}:00`}
                  selected={prefs.dailySummaryHour === hour}
                  onPress={() => save({ ...prefs, dailySummaryHour: hour })}
                />
              ))}
            </View>
          )}
          {row("reservationChanges", "Cambios en reservas", "Nuevas, movidas o canceladas")}
          {row("dayClose", "Cierre del día", "Lo que queda pendiente al acabar")}
        </>
      )}
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  section: { padding: 16, borderRadius: 12, backgroundColor: colors.surface, gap: 12 },
  title: { fontSize: 13, fontWeight: "700", color: colors.foregroundSubtle },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowText: { flex: 1, gap: 2 },
  value: { fontSize: 15, color: colors.foreground },
  hint: { fontSize: 13, color: colors.foregroundSubtle },
  error: { fontSize: 13, color: colors.danger },
  divider: { height: 1, backgroundColor: colors.border },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  denied: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: `${colors.warning}1A`,
  },
  deniedText: { flex: 1, fontSize: 13, color: colors.warning },
  link: { fontSize: 13, fontWeight: "700", color: colors.foreground },
}));
