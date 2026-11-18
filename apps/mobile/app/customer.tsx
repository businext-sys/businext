import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { customersApi, type CustomerDetail } from "@businext/shared-core/api";
import { useReservation } from "@businext/shared-core/hooks";
import { ContactButtons } from "@/components/ContactButtons";
import { StatusPill } from "@/components/StatusPill";
import { formatDayLabel, formatHour, parseWallClock } from "@/lib/date";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

/** Lo que se sabe sin la ficha del backend: el contacto de su última reserva. */
function useLocalFallback(name: string): CustomerDetail {
  const { reservationData } = useReservation();
  const [now] = useState(() => Date.now());
  const mine = reservationData
    .filter((r) => r.customerName.toLowerCase() === name.toLowerCase())
    .sort((a, b) => b.reservationStartDate.localeCompare(a.reservationStartDate));
  const next = [...mine]
    .reverse()
    .find((r) => r.status === "PENDING" && parseWallClock(r.reservationStartDate).getTime() >= now);
  const toItem = (r: (typeof mine)[number]) => ({
    id: r.id ?? 0,
    start: r.reservationStartDate,
    service: r.service,
    inCharge: r.inCharge,
    status: r.status,
  });
  return {
    name,
    phone: mine.find((r) => r.customerPhone)?.customerPhone ?? null,
    email: mine.find((r) => r.customerEmail)?.customerEmail ?? null,
    visits: mine.filter((r) => r.status === "COMPLETED").length,
    noShows: mine.filter((r) => r.status === "NO_SHOW").length,
    totalSpent: 0,
    lastVisit: mine.find((r) => r.status === "COMPLETED")?.reservationStartDate ?? null,
    nextReservation: next ? toItem(next) : null,
    reservations: mine.map(toItem),
  };
}

function formatWhen(start: string): string {
  return `${formatDayLabel(parseWallClock(start))}, ${formatHour(start)}`;
}

/** Ficha de cliente (issue #218): contacto, visitas, «no vino», gasto y su historial. */
export default function CustomerScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const { name = "" } = useLocalSearchParams<{ name: string }>();
  const fallback = useLocalFallback(name);
  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    customersApi
      .detail(name)
      .then((loaded) => active && setDetail(loaded))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [name]);

  const customer = detail ?? fallback;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Cliente" }} />
      <Text style={styles.name}>{customer.name}</Text>
      {(customer.phone || customer.email) && (
        <Text style={styles.muted} selectable>
          {[customer.phone, customer.email].filter(Boolean).join(" · ")}
        </Text>
      )}

      <ContactButtons phone={customer.phone} email={customer.email} />

      <View style={styles.stats}>
        <Stat label="Visitas" value={String(customer.visits)} />
        <Stat label="No vino" value={String(customer.noShows)} danger={customer.noShows > 0} />
        {detail && <Stat label="Gastado" value={`${customer.totalSpent.toLocaleString("es-ES")}€`} />}
      </View>

      {customer.nextReservation && (
        <Pressable
          style={styles.next}
          onPress={() => router.push(`/reservation/${customer.nextReservation!.id}`)}
          accessibilityRole="button"
        >
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <View style={styles.flexText}>
            <Text style={styles.eyebrow}>Próxima cita</Text>
            <Text style={styles.body}>
              {formatWhen(customer.nextReservation.start)} · {customer.nextReservation.service}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.foregroundSubtle} />
        </Pressable>
      )}

      <Pressable
        style={styles.primaryButton}
        onPress={() =>
          router.push({
            pathname: "/reservation/form",
            params: {
              name: customer.name,
              phone: customer.phone ?? "",
              email: customer.email ?? "",
            },
          })
        }
        accessibilityRole="button"
      >
        <Ionicons name="add" size={20} color={colors.primaryForeground} />
        <Text style={styles.primaryButtonText}>Nueva reserva</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Historial</Text>
      {loading && !detail && customer.reservations.length === 0 ? (
        <ActivityIndicator color={colors.primary} />
      ) : customer.reservations.length === 0 ? (
        <Text style={styles.muted}>Aún no tiene reservas.</Text>
      ) : (
        customer.reservations.map((r) => (
          <Pressable
            key={r.id}
            style={styles.row}
            onPress={() => router.push(`/reservation/${r.id}`)}
            accessibilityRole="button"
          >
            <View style={styles.flexText}>
              <Text style={styles.body}>{r.service}</Text>
              <Text style={styles.small}>
                {formatWhen(r.start)} · {r.inCharge}
              </Text>
            </View>
            <StatusPill status={r.status} />
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  const styles = useStyles();
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, danger && styles.danger]}>{value}</Text>
      <Text style={styles.small}>{label}</Text>
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  name: { fontFamily: fonts.display, fontSize: 32, color: colors.foreground },
  muted: { fontSize: 14, color: colors.foregroundMuted },
  stats: { flexDirection: "row", gap: 8 },
  stat: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: colors.surface, gap: 2 },
  statValue: { fontFamily: fonts.display, fontSize: 26, color: colors.foreground },
  danger: { color: colors.danger },
  next: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  flexText: { flex: 1, gap: 2 },
  eyebrow: { fontSize: 12, fontWeight: "700", color: colors.secondary },
  body: { fontSize: 15, color: colors.foreground },
  small: { fontSize: 13, color: colors.foregroundSubtle },
  primaryButton: {
    minHeight: 48,
    borderRadius: 6,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: { fontSize: 15, fontWeight: "700", color: colors.primaryForeground },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: colors.foreground, marginTop: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
}));
