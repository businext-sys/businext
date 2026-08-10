import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useReservation } from "@businext/shared-core/hooks";
import { useFinances } from "@businext/shared-core/hooks";
import { useProduct } from "@businext/shared-core/hooks";
import { StatusOptions } from "@businext/shared-core";
import { buildFinanceRecordFromReservation } from "@businext/shared-core/services";
import { formatHour } from "@/lib/date";

/**
 * Detalle de una reserva (issue #030).
 *
 * Nota sobre los estados: el modelo real de `Reservation` solo tiene
 * `PENDING` y `COMPLETED` (no existe un estado `CANCELLED`/`confirmed`
 * distinto, a diferencia de lo que sugeria la descripcion original de la
 * issue). Se mapean las acciones pedidas a las que realmente existen en
 * el dominio (ver apps/web/src/components/reservation/ReservationItem.tsx):
 * "Confirmar" -> "Completar" (PENDING -> COMPLETED, genera tambien un
 * registro financiero, igual que en web); "Cancelar" -> "Eliminar" (no
 * hay una tercera categoria "cancelada", eliminar es la unica forma de
 * quitar una reserva pendiente).
 */
export default function ReservationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const { reservationData, updateReservation, revertReservation, deleteReservation } =
    useReservation();
  const { createFinance } = useFinances();
  const { productData } = useProduct();

  const reservation = useMemo(
    () => reservationData.find((r) => String(r.id) === id),
    [reservationData, id]
  );

  if (!reservation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const statusLabel =
    StatusOptions[reservation.status as keyof typeof StatusOptions] ??
    reservation.status;

  const handleComplete = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const completed = { ...reservation, status: "COMPLETED" };
      const updated = await updateReservation(completed);
      if (updated) {
        await createFinance(buildFinanceRecordFromReservation(completed, productData));
      }
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevert = async () => {
    if (submitting || !reservation.id) return;
    setSubmitting(true);
    try {
      await revertReservation(reservation.id);
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!reservation.id) return;
    Alert.alert(
      "Eliminar reserva",
      `¿Seguro que quieres eliminar la reserva de ${reservation.customerName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setSubmitting(true);
            try {
              await deleteReservation(reservation.id!);
              router.back();
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Cliente</Text>
      <Text style={styles.value}>{reservation.customerName}</Text>

      <Text style={styles.label}>Servicio</Text>
      <Text style={styles.value}>{reservation.service}</Text>

      <Text style={styles.label}>Encargado</Text>
      <Text style={styles.value}>{reservation.inCharge}</Text>

      <Text style={styles.label}>Hora</Text>
      <Text style={styles.value}>
        {formatHour(reservation.reservationStartDate)} ({reservation.timePerReservation} min)
      </Text>

      <Text style={styles.label}>Estado</Text>
      <Text style={styles.value}>{statusLabel}</Text>

      <View style={styles.actions}>
        {reservation.status === "PENDING" && (
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={handleComplete}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Completar</Text>
            )}
          </Pressable>
        )}

        {reservation.status === "COMPLETED" && (
          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={handleRevert}
            disabled={submitting}
          >
            <Text style={styles.secondaryButtonText}>Revertir</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.button, styles.dangerButton]}
          onPress={handleDelete}
          disabled={submitting}
        >
          <Text style={styles.dangerButtonText}>Eliminar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: {
    padding: 24,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    color: "#111",
  },
  actions: {
    marginTop: 32,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#111",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#ddd",
  },
  secondaryButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: "#c0392b",
  },
  dangerButtonText: {
    color: "#c0392b",
    fontWeight: "600",
  },
});
