import { useState } from "react";
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
import { Redirect, useRouter } from "expo-router";
import { useAccessContext, useEmployee, useFinances } from "@businext/shared-core/hooks";
import { FinancesTypeOptions } from "@businext/shared-core/finances";
import { Chip } from "@/components/Chip";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

type MovementType = keyof typeof FinancesTypeOptions;

export default function NewMovementRoute() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { context, loading } = useAccessContext();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (context?.role !== "owner") return <Redirect href="/" />;

  return <NewMovementScreen currentUserName={context.profile?.displayName ?? ""} />;
}

function NewMovementScreen({ currentUserName }: { currentUserName: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const { createFinance } = useFinances();
  const { activeEmployees } = useEmployee();
  const [type, setType] = useState<MovementType>("INCOME");
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");
  const [creator, setCreator] = useState(currentUserName);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const creatorOptions = [
    currentUserName,
    ...activeEmployees
      .map((e) => e.displayName ?? "")
      .filter((name) => name && name !== currentUserName),
  ].filter(Boolean);

  const handleSave = async () => {
    if (submitting) return;
    const parsedAmount = Number(amount.replace(",", "."));
    if (!concept.trim()) return setError("Indica un concepto.");
    if (!amount.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return setError("Indica un importe válido.");
    }
    if (!creator) return setError("Elige el emisor.");
    setError(null);
    setSubmitting(true);
    const created = await createFinance({
      concept: concept.trim(),
      amount: parsedAmount,
      type,
      creator,
      reservation_id: null,
      product_id: null,
    });
    setSubmitting(false);
    if (!created) {
      setError("No se ha podido guardar el movimiento.");
      return;
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.chips}>
          {(Object.keys(FinancesTypeOptions) as MovementType[]).map((key) => (
            <Chip
              key={key}
              label={FinancesTypeOptions[key]}
              selected={type === key}
              onPress={() => setType(key)}
            />
          ))}
        </View>

        <Text style={styles.label}>Concepto</Text>
        <TextInput
          style={styles.input}
          value={concept}
          onChangeText={setConcept}
          placeholder="Ej. Venta de champú"
          placeholderTextColor={colors.foregroundSubtle}
          testID="cash-new-concept"
        />

        <Text style={styles.label}>Importe (€)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.foregroundSubtle}
          testID="cash-new-amount"
        />

        <Text style={styles.label}>Emisor</Text>
        <View style={styles.chips}>
          {creatorOptions.map((name) => (
            <Chip
              key={name}
              label={name === currentUserName ? `${name} (Tú)` : name}
              selected={creator === name}
              onPress={() => setCreator(name)}
            />
          ))}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={submitting}
          accessibilityRole="button"
          testID="cash-new-save"
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
