import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusOptions } from "@businext/shared-core";
import type { ReservationListBlock } from "@businext/shared-core/assistant";
import { formatHour } from "@/lib/date";
import { colors } from "@/theme/colors";
import { cardStyles } from "./cardStyles";

export function ReservationListCard({ block }: { block: ReservationListBlock }) {
  const router = useRouter();

  return (
    <View style={cardStyles.card} testID="card-reservation-list">
      {block.title && <Text style={cardStyles.title}>{block.title}</Text>}
      {block.reservations.length === 0 && <Text style={cardStyles.muted}>No hay reservas.</Text>}
      {block.reservations.map((reservation) => {
        const status =
          StatusOptions[reservation.status as keyof typeof StatusOptions] ?? reservation.status;
        const hour = formatHour(reservation.start_time);
        return (
          <Pressable
            key={reservation.id}
            style={styles.row}
            onPress={() => router.push(`/reservation/${reservation.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`${hour}, ${reservation.client_name}, ${reservation.service}, ${status}`}
            accessibilityHint="Abre el detalle de la reserva"
          >
            <Text style={styles.hour}>{hour}</Text>
            <View style={styles.info}>
              <Text style={styles.client}>{reservation.client_name}</Text>
              <Text style={cardStyles.muted}>{reservation.service}</Text>
              {reservation.employee_name && (
                <Text style={cardStyles.subtle}>{reservation.employee_name}</Text>
              )}
            </View>
            <View style={cardStyles.pill}>
              <Text style={cardStyles.pillText}>{status}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 44,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  hour: { width: 48, fontSize: 14, fontWeight: "700", color: colors.primary },
  info: { flex: 1, gap: 2 },
  client: { fontSize: 15, fontWeight: "600", color: colors.foreground },
});
