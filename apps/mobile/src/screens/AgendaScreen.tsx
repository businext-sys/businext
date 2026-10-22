import { useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useReservation } from "@businext/shared-core/hooks";
import type { Reservation } from "@businext/shared-core";
import { ReservationListItem } from "@/components/ReservationListItem";
import { useAuth } from "@/context/AuthContext";
import { usePushRegistration } from "@/hooks/usePushRegistration";
import {
  addDays,
  formatDayLabel,
  formatHour,
  isSameDay,
  isToday,
} from "@/lib/date";

type Section = { title: string; data: Reservation[] };

/**
 * Agenda del dia (issue #030): lista de reservas del dia seleccionado,
 * agrupadas por hora, con navegacion entre dias y pull-to-refresh.
 * Usa `useReservation` de shared-core tal cual, sin reescritura (issue #028).
 */
export default function AgendaScreen() {
  const { logout } = useAuth();
  const [selectedDay, setSelectedDay] = useState(new Date());
  const { reservationData, loading, getAllReservations } = useReservation();
  const pushState = usePushRegistration();

  const sections = useMemo<Section[]>(() => {
    const dayReservations = reservationData
      .filter((r) => isSameDay(r.reservationStartDate, selectedDay))
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
  }, [reservationData, selectedDay]);

  return (
    <View style={styles.flex}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Agenda</Text>
        <Pressable onPress={logout}>
          <Text style={styles.logoutText}>Salir</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Pressable
          style={styles.navButton}
          onPress={() => setSelectedDay((d) => addDays(d, -1))}
        >
          <Text style={styles.navButtonText}>{"<"}</Text>
        </Pressable>

        <Pressable onPress={() => setSelectedDay(new Date())}>
          <Text style={styles.dayLabel}>{formatDayLabel(selectedDay)}</Text>
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

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={({ item }) => <ReservationListItem reservation={item} />}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getAllReservations} />
        }
        contentContainerStyle={
          sections.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>
              No hay reservas para este dia.
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f5f5f5" },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#c0392b",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },
  todayHint: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
    backgroundColor: "#f5f5f5",
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
    color: "#888",
  },
  pushBanner: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pushBannerText: {
    fontSize: 12,
    color: "#92400E",
  },
});
