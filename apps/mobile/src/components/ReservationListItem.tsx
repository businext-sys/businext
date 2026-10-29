import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { Reservation } from "@businext/shared-core";
import { StatusOptions } from "@businext/shared-core";
import { formatHour } from "@/lib/date";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

export function ReservationListItem({ reservation }: { reservation: Reservation }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const statusTone: Record<string, string> = {
    PENDING: colors.warning,
    COMPLETED: colors.success,
  };
  const tone = statusTone[reservation.status];
  const statusColors = tone
    ? { bg: `${tone}26`, fg: tone }
    : { bg: colors.muted, fg: colors.mutedForeground };
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

const useStyles = themedStyles((colors) => ({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  hourBadge: {
    width: 56,
    alignItems: "center",
  },
  hourText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.foreground,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.foreground,
  },
  service: {
    fontSize: 13,
    color: colors.foregroundMuted,
  },
  inCharge: {
    fontSize: 12,
    color: colors.foregroundSubtle,
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
}));
