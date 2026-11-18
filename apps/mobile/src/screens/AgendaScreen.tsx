import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAccessContext, useConfiguration, useReservation } from "@businext/shared-core/hooks";
import { Chip } from "@/components/Chip";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { ReservationListItem } from "@/components/ReservationListItem";
import { TrendSuggestionCard } from "@/components/TrendSuggestionCard";
import { usePushRegistration } from "@/hooks/usePushRegistration";
import { shareBookingLink } from "@/lib/links";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import {
  addDays,
  formatDayLabel,
  isSameDay,
  isToday,
  parseDateParam,
  toDateParam,
} from "@/lib/date";

type Filter = "all" | "pending";

/**
 * Agenda del día (issues #030 y #218): reservas del día elegido, navegación
 * entre días, filtro de pendientes y pull-to-refresh.
 */
export default function AgendaScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string; filter?: string }>();
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [filter, setFilter] = useState<Filter>("all");
  const { reservationData, loading, getAllReservations } = useReservation();
  const pushState = usePushRegistration();
  const { context, capabilities } = useAccessContext();
  const { configurationData } = useConfiguration();
  const isOwner = context?.role === "owner";
  const canShare = isOwner || context?.role === "manager";
  const currentUserName = context?.profile?.displayName ?? context?.profile?.email ?? "";

  const paramsKey = params.date || params.filter ? `${params.date ?? ""}|${params.filter ?? ""}` : "";
  const [appliedParams, setAppliedParams] = useState("");
  if (paramsKey !== appliedParams) {
    setAppliedParams(paramsKey);
    if (paramsKey) {
      if (params.date) setSelectedDay(parseDateParam(params.date));
      setFilter(params.filter === "pending" ? "pending" : "all");
    }
  }

  useEffect(() => {
    if (paramsKey) router.setParams({ date: undefined, filter: undefined });
  }, [paramsKey, router]);

  const reservations = useMemo(
    () =>
      reservationData
        .filter((r) => isSameDay(r.reservationStartDate, selectedDay))
        .filter((r) => isOwner || r.inCharge.toLowerCase() === currentUserName.toLowerCase())
        .filter((r) => filter === "all" || r.status === "PENDING")
        .sort((a, b) => a.reservationStartDate.localeCompare(b.reservationStartDate)),
    [reservationData, selectedDay, isOwner, currentUserName, filter]
  );

  return (
    <View style={styles.flex}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerActions}>
              {canShare && context?.businessId && (
                <HeaderIconButton
                  icon="share-outline"
                  label="Compartir enlace de reservas"
                  onPress={() =>
                    shareBookingLink(context.businessId, configurationData[0]?.businessName)
                  }
                />
              )}
              <HeaderIconButton
                icon="add"
                label="Nueva reserva"
                onPress={() =>
                  router.push({ pathname: "/reservation/form", params: { date: toDateParam(selectedDay) } })
                }
                testID="agenda-new-reservation"
              />
            </View>
          ),
        }}
      />

      <View style={styles.header}>
        <Pressable
          style={styles.navButton}
          onPress={() => setSelectedDay((d) => addDays(d, -1))}
          accessibilityRole="button"
          accessibilityLabel="Día anterior"
          hitSlop={4}
        >
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
        </Pressable>

        <Pressable
          onPress={() => setSelectedDay(new Date())}
          accessibilityRole="button"
          accessibilityHint="Vuelve a hoy"
        >
          <Text style={styles.dayLabel} testID="agenda-day-label">
            {formatDayLabel(selectedDay)}
          </Text>
          <Text style={styles.todayHint}>{isToday(selectedDay) ? "Hoy" : "Toca para ir a hoy"}</Text>
        </Pressable>

        <Pressable
          style={styles.navButton}
          onPress={() => setSelectedDay((d) => addDays(d, 1))}
          accessibilityRole="button"
          accessibilityLabel="Día siguiente"
          hitSlop={4}
        >
          <Ionicons name="chevron-forward" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={styles.filters}>
        <Chip label="Todas" selected={filter === "all"} onPress={() => setFilter("all")} />
        <Chip label="Pendientes" selected={filter === "pending"} onPress={() => setFilter("pending")} />
      </View>

      {pushState.status === "denied" && (
        <View style={styles.pushBanner}>
          <Text style={styles.pushBannerText}>{pushState.message}</Text>
        </View>
      )}

      <FlatList
        data={reservations}
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={({ item }) => <ReservationListItem reservation={item} />}
        ListHeaderComponent={
          capabilities.canViewTrends && isToday(selectedDay) ? (
            <TrendSuggestionCard notificationsDenied={pushState.status === "denied"} />
          ) : undefined
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            tintColor={colors.primary}
            onRefresh={async () => {
              await getAllReservations();
            }}
          />
        }
        contentContainerStyle={reservations.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Ionicons name="calendar-clear-outline" size={40} color={colors.foregroundSubtle} />
              <Text style={styles.emptyText}>
                {filter === "pending" ? "No quedan reservas pendientes." : "No hay reservas este día."}
              </Text>
            </View>
          ) : undefined
        }
      />
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  headerActions: { flexDirection: "row", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.surface,
  },
  dayLabel: { fontSize: 16, fontWeight: "700", color: colors.foreground, textAlign: "center" },
  todayHint: { fontSize: 12, color: colors.foregroundSubtle, textAlign: "center", marginTop: 2 },
  filters: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  listContainer: { paddingBottom: 24 },
  emptyContainer: { flexGrow: 1, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", gap: 12 },
  emptyText: { fontSize: 15, color: colors.foregroundMuted },
  pushBanner: {
    backgroundColor: `${colors.warning}26`,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pushBannerText: { fontSize: 12, color: colors.warning },
}));
