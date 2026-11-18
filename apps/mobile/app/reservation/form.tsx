import { useEffect, useMemo, useState } from "react";
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
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useAccessContext,
  useBookingRequests,
  useEmployee,
  useProduct,
  useReservation,
  useWorkingHours,
} from "@businext/shared-core/hooks";
import { availabilityApi, customersApi, type KnownCustomer } from "@businext/shared-core/api";
import { serviceDuration, type Reservation } from "@businext/shared-core";
import {
  addMinutesToWallClock,
  detectReservationConflict,
  getAvailableSlots,
  isDayClosed,
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

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TIME_PATTERN = /^([01]?\d|2[0-3]):([0-5]\d)$/;

type Prefill = { date?: string; name?: string; phone?: string; email?: string };

export default function ReservationFormScreen() {
  const { id, ...prefill } = useLocalSearchParams<{ id?: string } & Prefill>();
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

  return <ReservationForm existing={existing} prefill={prefill} />;
}

/** Clientes que ya han reservado y encajan con lo escrito; vacío si el backend aún no lo tiene. */
function useCustomerSuggestions(query: string, enabled: boolean) {
  const [suggestions, setSuggestions] = useState<KnownCustomer[]>([]);
  const text = query.trim();
  const active = enabled && text.length >= 2;
  useEffect(() => {
    if (!active) return;
    let current = true;
    const timer = setTimeout(() => {
      customersApi
        .search(text, 10)
        .then((found) => current && setSuggestions(found))
        .catch(() => current && setSuggestions([]));
    }, 250);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [text, active]);
  return active ? suggestions : [];
}

function ReservationForm({ existing, prefill }: { existing?: Reservation; prefill: Prefill }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const { reservationData, createReservation, updateReservation } = useReservation();
  const { productData } = useProduct();
  const { activeEmployees } = useEmployee();
  const { bookingRequests } = useBookingRequests();
  const { context } = useAccessContext();
  const isOwner = context?.role === "owner";
  const currentUserName = context?.profile?.displayName ?? context?.profile?.email ?? "";

  const [customerName, setCustomerName] = useState(existing?.customerName ?? prefill.name ?? "");
  const [customerPhone, setCustomerPhone] = useState(existing?.customerPhone ?? prefill.phone ?? "");
  const [customerEmail, setCustomerEmail] = useState(existing?.customerEmail ?? prefill.email ?? "");
  const [pickedCustomer, setPickedCustomer] = useState(Boolean(existing || prefill.name));
  const [service, setService] = useState(existing?.service ?? "");
  const [inCharge, setInCharge] = useState(existing?.inCharge ?? "");
  const [day, setDay] = useState(() =>
    existing
      ? parseWallClock(existing.reservationStartDate)
      : prefill.date
        ? parseDateParam(prefill.date)
        : new Date()
  );
  const [time, setTime] = useState(existing ? formatHour(existing.reservationStartDate) : "");
  const [customTime, setCustomTime] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const suggestions = useCustomerSuggestions(customerName, !pickedCustomer);
  const services = productData.filter((p) => p.type !== "producto");
  const inChargeOptions = [
    currentUserName,
    ...activeEmployees
      .map((e) => e.displayName ?? "")
      .filter((name) => name && name !== currentUserName),
  ];
  const selectedInCharge = inCharge || (isOwner ? "" : currentUserName);

  const duration =
    existing && service === existing.service
      ? existing.timePerReservation
      : serviceDuration(productData, service);

  const memberId =
    selectedInCharge === currentUserName
      ? context?.userId
      : activeEmployees.find((e) => e.displayName === selectedInCharge)?.memberUserId;
  const { workingHoursData: generalHours } = useWorkingHours();
  const { workingHoursData: memberHours } = useWorkingHours(memberId, Boolean(memberId));
  const workingHours = memberHours.length > 0 ? memberHours : generalHours;

  const dayClosed = isDayClosed(day, workingHours);
  const localSlots = useMemo(
    () =>
      selectedInCharge && service
        ? getAvailableSlots(
            day,
            workingHours,
            reservationData.filter((r) => r.id !== existing?.id),
            selectedInCharge,
            bookingRequests,
            new Date(),
            { durationMinutes: duration, stepMinutes: 15 }
          )
        : [],
    [day, workingHours, reservationData, existing?.id, selectedInCharge, bookingRequests, duration, service]
  );

  const businessId = context?.businessId;
  const dateParam = toDateParam(day);
  const slotsKey = businessId && service && selectedInCharge ? `${dateParam}|${selectedInCharge}|${service}` : "";
  const [serverSlots, setServerSlots] = useState<{ key: string; slots: string[] | null } | null>(null);
  useEffect(() => {
    if (!slotsKey || !businessId) return;
    let current = true;
    availabilityApi
      .slots({ businessId, date: dateParam, employeeName: selectedInCharge, service })
      .then((found) => current && setServerSlots({ key: slotsKey, slots: found }));
    return () => {
      current = false;
    };
  }, [slotsKey, businessId, dateParam, selectedInCharge, service]);
  const slots = (serverSlots?.key === slotsKey ? serverSlots.slots : null) ?? localSlots;

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

  const changeDay = (amount: number) => {
    setDay((d) => addDays(d, amount));
    if (!customTime) setTime("");
  };

  const pickCustomer = (customer: KnownCustomer) => {
    setCustomerName(customer.name);
    if (customer.phone) setCustomerPhone(customer.phone);
    if (customer.email) setCustomerEmail(customer.email);
    setPickedCustomer(true);
  };

  const handleSave = async () => {
    if (submitting) return;
    if (!customerName.trim()) return setError("Indica el nombre del cliente.");
    if (!service) return setError("Elige un servicio.");
    if (!selectedInCharge) return setError("Elige quién atiende.");
    if (!startDate) return setError("Elige una hora.");
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
      timePerReservation: duration,
    };
    const saved = existing
      ? await updateReservation({ ...existing, ...fields })
      : await createReservation({ ...fields, status: "PENDING" });

    setSubmitting(false);
    if (!saved) {
      setError("No se ha podido guardar la reserva.");
      return;
    }
    router.back();
  };

  const timeIsSlot = slots.includes(time);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {existing && <Stack.Screen options={{ title: "Editar reserva" }} />}
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Cliente</Text>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={18} color={colors.foregroundSubtle} />
          <TextInput
            style={styles.inputFlex}
            value={customerName}
            onChangeText={(text) => {
              setCustomerName(text);
              setPickedCustomer(false);
            }}
            placeholder="Nombre del cliente"
            placeholderTextColor={colors.foregroundSubtle}
            autoCorrect={false}
            testID="reservation-form-name"
          />
        </View>
        {suggestions.length > 0 && (
          <View style={styles.suggestions}>
            {suggestions.map((customer) => (
              <Pressable
                key={`${customer.name}-${customer.phone ?? ""}-${customer.email ?? ""}`}
                style={styles.suggestion}
                onPress={() => pickCustomer(customer)}
                accessibilityRole="button"
              >
                <Text style={styles.suggestionName}>{customer.name}</Text>
                {(customer.phone || customer.email) && (
                  <Text style={styles.suggestionMeta} numberOfLines={1}>
                    {[customer.phone, customer.email].filter(Boolean).join(" · ")}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.inputRow}>
          <Ionicons name="call-outline" size={18} color={colors.foregroundSubtle} />
          <TextInput
            style={styles.inputFlex}
            value={customerPhone}
            onChangeText={setCustomerPhone}
            keyboardType="phone-pad"
            placeholder="Teléfono"
            placeholderTextColor={colors.foregroundSubtle}
          />
        </View>
        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={18} color={colors.foregroundSubtle} />
          <TextInput
            style={styles.inputFlex}
            value={customerEmail}
            onChangeText={setCustomerEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Email"
            placeholderTextColor={colors.foregroundSubtle}
          />
        </View>
        {!customerEmail.trim() && (
          <View style={styles.notice}>
            <Ionicons name="notifications-off-outline" size={16} color={colors.warning} />
            <Text style={styles.noticeText}>Sin email no se envían recordatorios.</Text>
          </View>
        )}

        <Text style={styles.label}>Servicio</Text>
        <View style={styles.chips}>
          {services.map((product) => (
            <Chip
              key={product.id ?? product.name}
              label={`${product.name} · ${serviceDuration(productData, product.name)} min`}
              selected={service === product.name}
              onPress={() => setService(product.name)}
            />
          ))}
        </View>

        <Text style={styles.label}>Quién atiende</Text>
        {isOwner ? (
          <View style={styles.chips}>
            {inChargeOptions.map((name) => (
              <Chip
                key={name}
                label={name === currentUserName ? `${name} (tú)` : name}
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
            onPress={() => changeDay(-1)}
            accessibilityRole="button"
            accessibilityLabel="Día anterior"
          >
            <Ionicons name="chevron-back" size={20} color={colors.foreground} />
          </Pressable>
          <Text style={styles.dayLabel}>{formatDayLabel(day)}</Text>
          <Pressable
            style={styles.navButton}
            onPress={() => changeDay(1)}
            accessibilityRole="button"
            accessibilityLabel="Día siguiente"
          >
            <Ionicons name="chevron-forward" size={20} color={colors.foreground} />
          </Pressable>
        </View>

        <Text style={styles.label}>Hora</Text>
        {!service || !selectedInCharge ? (
          <Text style={styles.hint}>Elige servicio y quién atiende para ver los huecos libres.</Text>
        ) : dayClosed ? (
          <Text style={styles.hint}>Este día está cerrado según el horario.</Text>
        ) : slots.length === 0 ? (
          <Text style={styles.hint}>No quedan huecos libres este día.</Text>
        ) : null}
        <View style={styles.chips}>
          {slots.map((slot) => (
            <Chip
              key={slot}
              label={slot}
              selected={!customTime && time === slot}
              onPress={() => {
                setCustomTime(false);
                setTime(slot);
              }}
            />
          ))}
          {time && !timeIsSlot && !customTime && <Chip label={time} selected onPress={() => setCustomTime(true)} />}
          <Chip
            label="Otra hora"
            selected={customTime}
            onPress={() => {
              setCustomTime(true);
              if (timeIsSlot) setTime("");
            }}
          />
        </View>
        {customTime && (
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
            keyboardType="numbers-and-punctuation"
            placeholder="10:45"
            placeholderTextColor={colors.foregroundSubtle}
            autoFocus
            testID="reservation-form-time"
          />
        )}

        {conflict && (
          <View style={styles.warning}>
            <Ionicons name="warning-outline" size={18} color={colors.warning} />
            <Text style={styles.warningText}>
              {selectedInCharge} ya tiene una reserva de {conflict.customerName} ({conflict.service}) a las{" "}
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
            <Text style={styles.buttonText}>{existing ? "Guardar cambios" : "Reservar"}</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  container: { padding: 20, gap: 10, paddingBottom: 40 },
  label: { fontSize: 15, fontWeight: "700", color: colors.foreground, marginTop: 14 },
  value: { fontSize: 16, color: colors.foreground },
  hint: { fontSize: 14, color: colors.foregroundMuted },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.input,
    backgroundColor: colors.surface,
  },
  inputFlex: { flex: 1, minHeight: 48, fontSize: 16, color: colors.foreground },
  input: {
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.surface,
  },
  suggestions: { borderRadius: 6, backgroundColor: colors.surfaceRaised, overflow: "hidden" },
  suggestion: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  suggestionName: { fontSize: 15, fontWeight: "600", color: colors.foreground },
  suggestionMeta: { fontSize: 13, color: colors.foregroundMuted },
  notice: { flexDirection: "row", alignItems: "center", gap: 6 },
  noticeText: { fontSize: 13, color: colors.warning },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  dayRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  navButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: colors.surface,
  },
  dayLabel: { fontSize: 16, fontWeight: "700", color: colors.foreground },
  warning: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    padding: 12,
    borderRadius: 6,
    backgroundColor: `${colors.warning}26`,
  },
  warningText: { flex: 1, fontSize: 14, color: colors.warning },
  error: { marginTop: 8, fontSize: 14, color: colors.danger },
  button: {
    marginTop: 20,
    minHeight: 50,
    backgroundColor: colors.primary,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.primaryForeground, fontWeight: "700", fontSize: 16 },
}));
