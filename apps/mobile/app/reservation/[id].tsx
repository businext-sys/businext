import { useMemo, useState, type ComponentProps } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useAccessContext,
  useFinances,
  useProduct,
  useReservation,
} from "@businext/shared-core/hooks";
import { buildFinanceRecordFromReservation } from "@businext/shared-core/services";
import { ContactButtons } from "@/components/ContactButtons";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { StatusPill } from "@/components/StatusPill";
import { formatDayLabel, formatHour, parseWallClock } from "@/lib/date";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

type IconName = ComponentProps<typeof Ionicons>["name"];

async function ensure(result: Promise<unknown>) {
  if (!(await result)) throw new Error("not saved");
}

function endOfToday(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
}

/**
 * Detalle de una reserva (issues #030 y #218), con las acciones de la web:
 * completar y cobrar, «No vino», volver a pendiente, editar y cancelar
 * (cancelar la borra: el modelo no tiene estado «cancelada»).
 */
export default function ReservationDetailScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [now] = useState(() => Date.now());

  const { reservationData, loading, updateReservation, revertReservation, deleteReservation } =
    useReservation();
  const { createFinance } = useFinances();
  const { productData } = useProduct();
  const { context } = useAccessContext();

  const reservation = useMemo(
    () => reservationData.find((r) => String(r.id) === id),
    [reservationData, id]
  );

  if (!reservation) {
    return (
      <View style={styles.center}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.muted}>No se encuentra la reserva.</Text>
        )}
      </View>
    );
  }

  const status = reservation.status.toUpperCase();
  const isPending = status === "PENDING";
  const start = parseWallClock(reservation.reservationStartDate).getTime();
  const canComplete = isPending && start < endOfToday();
  const canMarkNoShow = isPending && start <= now;
  const canRevertCompleted = status === "COMPLETED" && context?.role === "owner";
  const price = productData.find((p) => p.name === reservation.service)?.price ?? 0;

  const run = async (action: () => Promise<unknown>, after?: () => void) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await action();
      after?.();
    } catch {
      Alert.alert("No se ha podido guardar el cambio.");
    } finally {
      setSubmitting(false);
    }
  };

  const complete = () =>
    Alert.alert(
      "Completar y cobrar",
      `Se registra un ingreso de ${price.toLocaleString("es-ES")}€ por ${reservation.service}.`,
      [
        { text: "Volver", style: "cancel" },
        {
          text: "Completar",
          onPress: () =>
            run(async () => {
              const completed = { ...reservation, status: "COMPLETED" };
              await ensure(updateReservation(completed));
              await createFinance(buildFinanceRecordFromReservation(completed, productData));
            }),
        },
      ]
    );

  const markNoShow = () =>
    Alert.alert("No vino", `¿Marcar que ${reservation.customerName} no vino?`, [
      { text: "Volver", style: "cancel" },
      {
        text: "No vino",
        style: "destructive",
        onPress: () => run(() => ensure(updateReservation({ ...reservation, status: "NO_SHOW" }))),
      },
    ]);

  const backToPending = () =>
    run(() =>
      ensure(
        status === "COMPLETED"
          ? revertReservation(reservation.id!)
          : updateReservation({ ...reservation, status: "PENDING" })
      )
    );

  const cancel = () =>
    Alert.alert(
      "Cancelar reserva",
      `Se borra la reserva de ${reservation.customerName}. No se puede deshacer.`,
      [
        { text: "Volver", style: "cancel" },
        {
          text: "Cancelar reserva",
          style: "destructive",
          onPress: () => run(() => deleteReservation(reservation.id!), () => router.back()),
        },
      ]
    );

  const actions: { label: string; icon: IconName; onPress: () => void; tone: "primary" | "default" | "danger" }[] = [];
  if (canComplete) actions.push({ label: "Completar y cobrar", icon: "checkmark-circle", onPress: complete, tone: "primary" });
  if (canMarkNoShow) actions.push({ label: "No vino", icon: "person-remove-outline", onPress: markNoShow, tone: "default" });
  if (status === "NO_SHOW" || canRevertCompleted) {
    actions.push({ label: "Volver a pendiente", icon: "arrow-undo-outline", onPress: backToPending, tone: "default" });
  }
  if (isPending) actions.push({ label: "Cancelar reserva", icon: "close-circle-outline", onPress: cancel, tone: "danger" });

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      {isPending && (
        <Stack.Screen
          options={{
            headerRight: () => (
              <HeaderIconButton
                icon="create-outline"
                label="Editar reserva"
                onPress={() =>
                  router.push({ pathname: "/reservation/form", params: { id: String(reservation.id) } })
                }
              />
            ),
          }}
        />
      )}

      <Pressable
        style={styles.customer}
        onPress={() => router.push({ pathname: "/customer", params: { name: reservation.customerName } })}
        accessibilityRole="button"
        accessibilityHint="Abre la ficha del cliente"
      >
        <View style={styles.customerText}>
          <Text style={styles.name}>{reservation.customerName}</Text>
          <Text style={styles.muted}>Ver ficha del cliente</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.foregroundSubtle} />
      </Pressable>

      <ContactButtons phone={reservation.customerPhone} email={reservation.customerEmail} />

      <View style={styles.card}>
        <Row icon="calendar-outline" text={formatDayLabel(parseWallClock(reservation.reservationStartDate))} />
        <Row
          icon="time-outline"
          text={`${formatHour(reservation.reservationStartDate)} · ${reservation.timePerReservation} min`}
        />
        <Row icon="cut-outline" text={reservation.service} />
        <Row icon="person-outline" text={reservation.inCharge} />
        <StatusPill status={reservation.status} />
      </View>

      <View style={styles.actions}>
        {actions.map((action) => (
          <Pressable
            key={action.label}
            style={({ pressed }) => [
              styles.button,
              action.tone === "primary" ? styles.primaryButton : styles.secondaryButton,
              action.tone === "danger" && styles.dangerButton,
              (pressed || submitting) && styles.pressed,
            ]}
            onPress={action.onPress}
            disabled={submitting}
            accessibilityRole="button"
          >
            <Ionicons
              name={action.icon}
              size={20}
              color={
                action.tone === "primary"
                  ? colors.primaryForeground
                  : action.tone === "danger"
                    ? colors.danger
                    : colors.foreground
              }
            />
            <Text
              style={[
                styles.buttonText,
                action.tone === "primary" && styles.primaryText,
                action.tone === "danger" && styles.dangerText,
              ]}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
        {submitting && <ActivityIndicator color={colors.primary} />}
      </View>
    </ScrollView>
  );
}

function Row({ icon, text }: { icon: IconName; text: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.foregroundSubtle} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  container: { padding: 20, gap: 16 },
  customer: { flexDirection: "row", alignItems: "center", gap: 12 },
  customerText: { flex: 1, gap: 2 },
  name: { fontFamily: fonts.display, fontSize: 30, color: colors.foreground },
  muted: { fontSize: 14, color: colors.foregroundMuted },
  card: { padding: 16, borderRadius: 8, backgroundColor: colors.surface, gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowText: { fontSize: 16, color: colors.foreground, flex: 1 },
  actions: { gap: 10, marginTop: 8 },
  button: {
    minHeight: 48,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButton: { backgroundColor: colors.primary },
  secondaryButton: { borderWidth: 1, borderColor: colors.border },
  dangerButton: { borderColor: colors.danger },
  pressed: { opacity: 0.6 },
  buttonText: { fontSize: 15, fontWeight: "600", color: colors.foreground },
  primaryText: { color: colors.primaryForeground, fontWeight: "700" },
  dangerText: { color: colors.danger },
}));
