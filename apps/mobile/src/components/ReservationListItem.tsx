import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { Reservation } from "@businext/shared-core";
import { StatusPill } from "@/components/StatusPill";
import { formatHour } from "@/lib/date";
import { themedStyles } from "@/theme/ThemeContext";

export function ReservationListItem({ reservation }: { reservation: Reservation }) {
  const styles = useStyles();
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/reservation/${reservation.id}`)}
      accessibilityRole="button"
    >
      <Text style={styles.hour}>
        {formatHour(reservation.reservationStartDate)}–{formatHour(reservation.reservationEndDate)}
      </Text>
      <View style={styles.info}>
        <Text style={styles.customerName} numberOfLines={1}>
          {reservation.customerName}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {reservation.service} · {reservation.inCharge}
        </Text>
      </View>
      <StatusPill status={reservation.status} />
    </Pressable>
  );
}

const useStyles = themedStyles((colors) => ({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.7 },
  hour: { width: 92, fontSize: 14, fontWeight: "700", color: colors.foreground },
  info: { flex: 1, gap: 2 },
  customerName: { fontSize: 15, fontWeight: "600", color: colors.foreground },
  meta: { fontSize: 13, color: colors.foregroundMuted },
}));
