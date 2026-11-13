import { useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAccessContext, useReservation } from "@businext/shared-core/hooks";
import type { Reservation } from "@businext/shared-core";
import { ReservationListItem } from "@/components/ReservationListItem";
import { TrendSuggestionCard } from "@/components/TrendSuggestionCard";
import { usePushRegistration } from "@/hooks/usePushRegistration";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";
import {
  addDays,
  formatDayLabel,
  formatHour,
  isSameDay,
  isToday,
  toDateParam,
} from "@/lib/date";

type Section = { title: string; data: Reservation[] };

/**
 * Agenda del dia (issue #030): lista de reservas del dia seleccionado,
 * agrupadas por hora, con navegacion entre dias y pull-to-refresh.
 * Usa `useReservation` de shared-core tal cual, sin reescritura (issue #028).
 */
export default function AgendaScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const [selectedDay, setSelectedDay] = useState(new Date());
  const { reservationData, loading, getAllReservations } = useReservation();
  const pushState = usePushRegistration();
  const router = useRouter();
  const { context, capabilities } = useAccessContext();
  const isOwner = context?.role === "owner";
  const currentUserName = context?.profile?.displayName ?? context?.profile?.email ?? "";

  const sections = useMemo<Section[]>(() => {
    const dayReservations = reservationData
      .filter((r) => isSameDay(r.reservationStartDate, selectedDay))
      .filter((r) => isOwner || r.inCharge.toLowerCase() === currentUserName.toLowerCase())
      .sort((a, b) => a.reservationStartDate.localeCompare(b.reservationStartDate));

    const groups = new Map<string, Reservation[]>();
    for (const reservation of dayReservations) {
      const hour = formatHour(reservation.reservationStartDate);
      const group = groups.get(hour) ?? [];
      group.push(reservation);
      groups.set(hour, group);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([title, data]) => ({ title, data }));
  }, [reservationData, selectedDay, isOwner, currentUserName]);

  return (
    <View style={styles.flex}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() =>
                router.push({ pathname: "/reservation/form", params: { date: toDateParam(selectedDay) } })
              }
              accessibilityRole="button"
              hitSlop={8}
              testID="agenda-new-reservation"
            >
              <Text style={styles.headerLink}>Nueva reserva</Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.header}>
        <Pressable
          style={styles.navButton}
          onPress={() => setSelectedDay((d) => addDays(d, -1))}
        >
          <Text style={styles.navButtonText}>{"<"}</Text>
        </Pressable>

        <Pressable onPress={() => setSelectedDay(new Date())}>
          <Text style={styles.dayLabel} testID="agenda-day-label">
            {formatDayLabel(selectedDay)}
          </Text>
          {isToday(selectedDay) && <Text style={styles.todayHint}>Hoy</Text>}
        </Pressable>

        <Pressable
          style={styles.navButton}
          onPress={() => setSelectedDay((d) => addDays(d, 1))}
        >
          <Text style={styles.navButtonText}>{">"}</Text>
        </Pressable>
      </View>

      {pushState.status === "denied" && (
        <View style={styles.pushBanner}>
          <Text style={styles.pushBannerText}>{pushState.message}</Text>
        </View>
      )}

      {capabilities.canViewTrends && isToday(selectedDay) && (
        <TrendSuggestionCard notificationsDenied={pushState.status === "denied"} />
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={({ item }) => <ReservationListItem reservation={item} />}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            tintColor={colors.primary}
            onRefresh={async () => {
              await getAllReservations();
            }}
          />
        }
        contentContainerStyle={
          sections.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>
              No hay reservas para este dia.
            </Text>
          ) : undefined
        }
      />
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  headerLink: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.surfaceRaised,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.foreground,
    textAlign: "center",
  },
  todayHint: {
    fontSize: 11,
    color: colors.secondary,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.foregroundSubtle,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.foregroundMuted,
  },
  pushBanner: {
    backgroundColor: `${colors.warning}26`,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pushBannerText: {
    fontSize: 12,
    color: colors.warning,
  },
}));
