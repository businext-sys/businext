import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { Reservation } from "@businext/shared-core";
import { StatusOptions } from "@businext/shared-core";
import { formatHour } from "@/lib/date";

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  PENDING: { bg: "#FEF3C7", fg: "#92400E" },
  COMPLETED: { bg: "#D1FAE5", fg: "#065F46" },
};

export function ReservationListItem({ reservation }: { reservation: Reservation }) {
  const router = useRouter();
  const statusColors = STATUS_COLORS[reservation.status] ?? {
    bg: "#E5E7EB",
    fg: "#374151",
  };
  const statusLabel =
    StatusOptions[reservation.status as keyof typeof StatusOptions] ??
    reservation.status;

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/reservation/${reservation.id}`)}
    >
      <View style={styles.hourBadge}>
        <Text style={styles.hourText}>{formatHour(reservation.reservationStartDate)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.customerName}>{reservation.customerName}</Text>
        <Text style={styles.service}>{reservation.service}</Text>
        <Text style={styles.inCharge}>{reservation.inCharge}</Text>
      </View>
      <View style={[styles.statusPill, { backgroundColor: statusColors.bg }]}>
        <Text style={[styles.statusText, { color: statusColors.fg }]}>
          {statusLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  hourBadge: {
    width: 56,
    alignItems: "center",
  },
  hourText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  service: {
    fontSize: 13,
    color: "#555",
  },
  inCharge: {
    fontSize: 12,
    color: "#888",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
