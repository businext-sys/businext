import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useAccessContext,
  useEmployee,
  useProduct,
  useReservation,
} from "@businext/shared-core/hooks";
import type { Reservation } from "@businext/shared-core";
import {
  addMinutesToWallClock,
  detectReservationConflict,
} from "@businext/shared-core/services";
import {
  addDays,
  formatDayLabel,
  formatHour,
  parseDateParam,
  parseWallClock,
  toDateParam,
} from "@/lib/date";
import { Chip } from "@/components/Chip";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

const DEFAULT_DURATION = 30;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TIME_PATTERN = /^([01]?\d|2[0-3]):([0-5]\d)$/;

export default function ReservationFormScreen() {
  const { id, date } = useLocalSearchParams<{ id?: string; date?: string }>();
  const { reservationData } = useReservation();
  const { colors } = useTheme();
  const styles = useStyles();

  const existing = useMemo(
    () => (id ? reservationData.find((r) => String(r.id) === id) : undefined),
    [reservationData, id]
  );

  if (id && !existing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <ReservationForm existing={existing} initialDate={date} />;
}

function ReservationForm({
  existing,
  initialDate,
}: {
  existing?: Reservation;
  initialDate?: string;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const { reservationData, createReservation, updateReservation } = useReservation();
  const { productData } = useProduct();
  const { activeEmployees } = useEmployee();
  const { context } = useAccessContext();
  const isOwner = context?.role === "owner";
  const currentUserName = context?.profile?.displayName ?? context?.profile?.email ?? "";

  const [customerName, setCustomerName] = useState(existing?.customerName ?? "");
  const [customerPhone, setCustomerPhone] = useState(existing?.customerPhone ?? "");
  const [customerEmail, setCustomerEmail] = useState(existing?.customerEmail ?? "");
  const [service, setService] = useState(existing?.service ?? "");
  const [inCharge, setInCharge] = useState(existing?.inCharge ?? "");
  const [day, setDay] = useState(() =>
    existing
      ? parseWallClock(existing.reservationStartDate)
      : initialDate
        ? parseDateParam(initialDate)
        : new Date()
  );
  const [time, setTime] = useState(existing ? formatHour(existing.reservationStartDate) : "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const duration = existing?.timePerReservation ?? DEFAULT_DURATION;
  const services = productData.filter((p) => p.type !== "producto");
  const inChargeOptions = [
    currentUserName,
    ...activeEmployees
      .map((e) => e.displayName ?? "")
      .filter((name) => name && name !== currentUserName),
  ];
  const selectedInCharge = inCharge || (isOwner ? "" : currentUserName);

  const timeMatch = time.trim().match(TIME_PATTERN);
  const startDate = timeMatch
    ? `${toDateParam(day)}T${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}:00`
    : "";

  const conflict = useMemo(
    () =>
      detectReservationConflict({
        newStartDate: startDate,
        durationMinutes: duration,
        inCharge: selectedInCharge,
        reservations: reservationData,
        excludeId: existing?.id,
      }),
    [startDate, duration, selectedInCharge, reservationData, existing?.id]
  );

  const handleSave = async () => {
    if (submitting) return;
    if (!customerName.trim()) return setError("Indica el nombre del cliente.");
    if (!service) return setError("Elige un servicio.");
    if (!selectedInCharge) return setError("Elige un encargado.");
    if (!startDate) return setError("Indica la hora en formato HH:MM.");
    if (customerEmail.trim() && !EMAIL_PATTERN.test(customerEmail.trim())) {
      return setError("El email no es válido.");
    }
    setError(null);
    setSubmitting(true);

    const fields = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      service,
      inCharge: selectedInCharge,
      reservationStartDate: startDate,
      reservationEndDate: addMinutesToWallClock(startDate, duration),
    };
    const saved = existing
      ? await updateReservation({ ...existing, ...fields })
      : await createReservation({ ...fields, timePerReservation: duration, status: "PENDING" });

    setSubmitting(false);
    if (!saved) {
      setError("No se ha podido guardar la reserva.");
      return;
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {existing && <Stack.Screen options={{ title: "Editar reserva" }} />}
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Cliente</Text>
        <TextInput
          style={styles.input}
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Nombre del cliente"
          placeholderTextColor={colors.foregroundSubtle}
          testID="reservation-form-name"
        />

        <Text style={styles.label}>Teléfono (opcional)</Text>
        <TextInput
          style={styles.input}
          value={customerPhone}
          onChangeText={setCustomerPhone}
          keyboardType="phone-pad"
          placeholder="Teléfono del cliente"
          placeholderTextColor={colors.foregroundSubtle}
        />

        <Text style={styles.label}>Email (opcional)</Text>
        <TextInput
          style={styles.input}
          value={customerEmail}
          onChangeText={setCustomerEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email del cliente"
          placeholderTextColor={colors.foregroundSubtle}
        />

        <Text style={styles.label}>Servicio</Text>
        <View style={styles.chips}>
          {services.map((product) => (
            <Chip
              key={product.id ?? product.name}
              label={product.name}
              selected={service === product.name}
              onPress={() => setService(product.name)}
            />
          ))}
        </View>

        <Text style={styles.label}>Encargado</Text>
        {isOwner ? (
          <View style={styles.chips}>
            {inChargeOptions.map((name) => (
              <Chip
                key={name}
                label={name === currentUserName ? `${name} (Tú)` : name}
                selected={selectedInCharge === name}
                onPress={() => setInCharge(name)}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.value}>{selectedInCharge}</Text>
        )}

        <Text style={styles.label}>Día</Text>
        <View style={styles.dayRow}>
          <Pressable
            style={styles.navButton}
            onPress={() => setDay((d) => addDays(d, -1))}
            accessibilityRole="button"
            accessibilityLabel="Día anterior"
          >
            <Text style={styles.navButtonText}>{"<"}</Text>
          </Pressable>
          <Text style={styles.dayLabel}>{formatDayLabel(day)}</Text>
          <Pressable
            style={styles.navButton}
            onPress={() => setDay((d) => addDays(d, 1))}
            accessibilityRole="button"
            accessibilityLabel="Día siguiente"
          >
            <Text style={styles.navButtonText}>{">"}</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Hora ({duration} min)</Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          keyboardType="numbers-and-punctuation"
          placeholder="10:30"
          placeholderTextColor={colors.foregroundSubtle}
          testID="reservation-form-time"
        />

        {conflict && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              {selectedInCharge} ya tiene una reserva de {conflict.customerName} ({conflict.service}) de{" "}
              {conflict.time}.
            </Text>
          </View>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={submitting}
          accessibilityRole="button"
          testID="reservation-form-save"
        >
          {submitting ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={styles.buttonText}>Guardar</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  container: { padding: 24, gap: 8 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.foregroundSubtle,
    textTransform: "uppercase",
    marginTop: 12,
  },
  value: { fontSize: 16, color: colors.foreground },
  input: {
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.surface,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.surfaceRaised,
  },
  navButtonText: { fontSize: 18, fontWeight: "700", color: colors.foreground },
  dayLabel: { fontSize: 16, fontWeight: "700", color: colors.foreground },
  warning: {
    marginTop: 8,
    padding: 12,
    borderRadius: 6,
    backgroundColor: `${colors.warning}26`,
  },
  warningText: { fontSize: 14, color: colors.warning },
  error: { marginTop: 8, fontSize: 14, color: colors.danger },
  button: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.primaryForeground, fontWeight: "700", fontSize: 16 },
}));
