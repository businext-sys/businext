import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useContentSuggestions } from "@businext/shared-core/hooks";
import { TrendsGate } from "@/components/TrendsGate";
import { formatLabels, formatPublishAt, networkLabels } from "@/lib/trends";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

export default function TrendSuggestionRoute() {
  return (
    <TrendsGate>
      <TrendSuggestionScreen />
    </TrendsGate>
  );
}

function TrendSuggestionScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { suggestions, loading, error, markOpened, dismiss, markPublished } =
    useContentSuggestions();
  const suggestion = suggestions.find((s) => String(s.id) === id);
  const openedRef = useRef(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!suggestion || openedRef.current) return;
    openedRef.current = true;
    if (suggestion.status === "pending" || suggestion.status === "sent") {
      markOpened(suggestion.id);
    }
  }, [suggestion, markOpened]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error || !suggestion) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>
          {error ? "No se pudo cargar la sugerencia." : "Esta sugerencia ya no está disponible."}
        </Text>
      </View>
    );
  }

  const copyCaption = async () => {
    await Clipboard.setStringAsync(suggestion.captionHint);
    setCopied(true);
  };

  const finish = async (update: (id: number) => Promise<boolean>) => {
    setSaving(true);
    const ok = await update(suggestion.id);
    setSaving(false);
    if (ok) router.back();
    else Alert.alert("No se ha podido guardar. Inténtalo de nuevo.");
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>
        {formatPublishAt(suggestion.publishAt)} · {networkLabels[suggestion.network]} ·{" "}
        {formatLabels[suggestion.format]}
      </Text>
      <Text style={styles.idea} accessibilityRole="header">
        {suggestion.idea}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Guion</Text>
        {suggestion.script.map((step, index) => (
          <View key={index} style={styles.step}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.body}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Texto sugerido</Text>
        <Text style={styles.body} selectable>
          {suggestion.captionHint}
        </Text>
        <Pressable style={styles.secondaryButton} onPress={copyCaption} accessibilityRole="button">
          <Text style={styles.secondaryButtonText}>{copied ? "Copiado" : "Copiar texto"}</Text>
        </Pressable>
      </View>

      {suggestion.audioHint && (
        <View style={styles.card}>
          <Text style={styles.label}>Audio</Text>
          <Text style={styles.body}>{suggestion.audioHint}</Text>
        </View>
      )}

      <Pressable
        style={styles.primaryButton}
        onPress={() => finish(markPublished)}
        disabled={saving}
        accessibilityRole="button"
      >
        <Text style={styles.primaryButtonText}>Ya lo publiqué</Text>
      </Pressable>
      <Pressable
        style={styles.secondaryButton}
        onPress={() => finish(dismiss)}
        disabled={saving}
        accessibilityRole="button"
      >
        <Text style={styles.secondaryButtonText}>No me interesa</Text>
      </Pressable>
    </ScrollView>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  muted: { fontFamily: fonts.body, fontSize: 15, color: colors.foregroundMuted, textAlign: "center" },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.3,
    textTransform: "uppercase",
    color: colors.secondary,
  },
  idea: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 29,
    color: colors.foreground,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surface,
    gap: 8,
  },
  label: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.foregroundSubtle },
  body: { flex: 1, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.foreground },
  step: { flexDirection: "row", gap: 12 },
  stepNumber: { fontFamily: fonts.display, fontSize: 22, color: colors.secondary },
  primaryButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.primaryForeground },
  secondaryButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.foreground },
}));
