import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useContentPreferences } from "@businext/shared-core/hooks";
import { ContentPreferencesFormSchema } from "@businext/shared-core/schemas";
import type { ContentPreferences, SocialNetwork } from "@businext/shared-core/trends";
import { TrendsGate } from "@/components/TrendsGate";
import { networkLabels } from "@/lib/trends";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

const NETWORKS: SocialNetwork[] = ["instagram", "tiktok"];
const MAX_PER_DAY = [1, 2, 3];

export default function TrendPreferencesRoute() {
  return (
    <TrendsGate>
      <TrendPreferencesScreen />
    </TrendsGate>
  );
}

function TrendPreferencesScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { preferences, loading, savePreferences } = useContentPreferences();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!preferences) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No se pudieron cargar las preferencias.</Text>
      </View>
    );
  }

  return <PreferencesForm initial={preferences} savePreferences={savePreferences} />;
}

function PreferencesForm({
  initial,
  savePreferences,
}: {
  initial: ContentPreferences;
  savePreferences: (next: ContentPreferences) => Promise<ContentPreferences | null>;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const update = (patch: Partial<ContentPreferences>) => {
    setForm({ ...form, ...patch });
    setMessage(null);
  };

  const toggleNetwork = (network: SocialNetwork) =>
    update({
      networks: form.networks.includes(network)
        ? form.networks.filter((n) => n !== network)
        : [...form.networks, network],
    });

  const save = async () => {
    const parsed = ContentPreferencesFormSchema.safeParse(form);
    if (!parsed.success) {
      setMessage({ ok: false, text: parsed.error.issues[0].message });
      return;
    }
    setSaving(true);
    const saved = await savePreferences(parsed.data);
    setSaving(false);
    setMessage(
      saved
        ? { ok: true, text: "Preferencias guardadas." }
        : { ok: false, text: "No se pudieron guardar. Inténtalo de nuevo." }
    );
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <View style={[styles.card, styles.row]}>
        <Text style={styles.body}>Recibir ideas de contenido</Text>
        <Switch
          value={form.enabled}
          onValueChange={(enabled) => update({ enabled })}
          trackColor={{ true: colors.primary, false: colors.border }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Redes</Text>
        <View style={styles.options}>
          {NETWORKS.map((network) => (
            <Option
              key={network}
              label={networkLabels[network]}
              selected={form.networks.includes(network)}
              onPress={() => toggleNetwork(network)}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Avisos al día</Text>
        <View style={styles.options}>
          {MAX_PER_DAY.map((count) => (
            <Option
              key={count}
              label={String(count)}
              selected={form.maxPerDay === count}
              onPress={() => update({ maxPerDay: count })}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Sin avisos entre</Text>
        <View style={styles.options}>
          <TextInput
            style={[styles.input, styles.hourInput]}
            value={form.quietFrom}
            onChangeText={(quietFrom) => update({ quietFrom })}
            placeholder="22:00"
            placeholderTextColor={colors.foregroundSubtle}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
          />
          <Text style={styles.body}>y</Text>
          <TextInput
            style={[styles.input, styles.hourInput]}
            value={form.quietTo}
            onChangeText={(quietTo) => update({ quietTo })}
            placeholder="09:00"
            placeholderTextColor={colors.foregroundSubtle}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nicho</Text>
        <TextInput
          style={styles.input}
          value={form.niche}
          onChangeText={(niche) => update({ niche })}
          placeholderTextColor={colors.foregroundSubtle}
        />
        <Text style={styles.label}>Idioma y país de las tendencias</Text>
        <View style={styles.options}>
          <TextInput
            style={[styles.input, styles.codeInput]}
            value={form.language}
            onChangeText={(language) => update({ language: language.toLowerCase() })}
            placeholder="es"
            placeholderTextColor={colors.foregroundSubtle}
            autoCapitalize="none"
            maxLength={5}
          />
          <TextInput
            style={[styles.input, styles.codeInput]}
            value={form.country}
            onChangeText={(country) => update({ country: country.toUpperCase() })}
            placeholder="ES"
            placeholderTextColor={colors.foregroundSubtle}
            autoCapitalize="characters"
            maxLength={2}
          />
        </View>
      </View>

      {message && <Text style={message.ok ? styles.success : styles.error}>{message.text}</Text>}

      <Pressable style={styles.primaryButton} onPress={save} disabled={saving} accessibilityRole="button">
        <Text style={styles.primaryButtonText}>{saving ? "Guardando…" : "Guardar"}</Text>
      </Pressable>
    </ScrollView>
  );
}

function Option({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const styles = useStyles();
  return (
    <Pressable
      style={[styles.option, selected && styles.optionSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surface,
    gap: 8,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.foregroundSubtle },
  body: { fontFamily: fonts.body, fontSize: 15, color: colors.foreground },
  muted: { fontFamily: fonts.body, fontSize: 15, color: colors.foregroundMuted },
  error: { fontFamily: fonts.body, fontSize: 14, color: colors.danger },
  success: { fontFamily: fonts.body, fontSize: 14, color: colors.success },
  options: { flexDirection: "row", alignItems: "center", gap: 8 },
  option: {
    height: 44,
    minWidth: 44,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  optionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.foreground },
  optionTextSelected: { color: colors.primaryForeground },
  input: {
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.foreground,
    backgroundColor: colors.surface,
  },
  hourInput: { width: 88, textAlign: "center" },
  codeInput: { width: 72, textAlign: "center" },
  primaryButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.primaryForeground },
}));
