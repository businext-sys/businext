import { useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useContentSuggestions, useTrendInsight } from "@businext/shared-core/hooks";
import { TrendsGate } from "@/components/TrendsGate";
import { isCurrentSuggestion } from "@businext/shared-core/services";
import { formatLabels, formatPublishAt, networkLabels } from "@/lib/trends";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

export default function TrendsRoute() {
  return (
    <TrendsGate>
      <TrendsScreen />
    </TrendsGate>
  );
}

function TrendsScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const { insight, loading: insightLoading, refresh } = useTrendInsight();
  const { suggestions, loading: suggestionsLoading } = useContentSuggestions();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const upcoming = suggestions
    .filter((s) => isCurrentSuggestion(s))
    .sort((a, b) => a.publishAt.localeCompare(b.publishAt));

  const refreshInsight = async () => {
    setRefreshing(true);
    setRefreshError(await refresh());
    setRefreshing(false);
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => router.push("/trends/settings")} accessibilityRole="button" hitSlop={8}>
              <Text style={styles.headerLink}>Preferencias</Text>
            </Pressable>
          ),
        }}
      />

      <Text style={styles.sectionTitle}>Análisis del día</Text>
      <View style={styles.card}>
        {insightLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : insight ? (
          <>
            <Text style={styles.body}>{insight.analysis}</Text>
            {insight.matchedServices.length > 0 && (
              <View style={styles.chips}>
                {insight.matchedServices.map((service) => (
                  <Text key={service} style={styles.chip}>
                    {service}
                  </Text>
                ))}
              </View>
            )}
            {insight.trends.map((trend) => (
              <Pressable
                key={trend.url}
                onPress={() => Linking.openURL(trend.url)}
                accessibilityRole="link"
              >
                <Text style={styles.link}>
                  {networkLabels[trend.network]} · {trend.title}
                </Text>
              </Pressable>
            ))}
          </>
        ) : (
          <Text style={styles.muted}>Aún no hay análisis de tendencias para tu negocio.</Text>
        )}
        <Pressable
          style={styles.secondaryButton}
          onPress={refreshInsight}
          disabled={refreshing}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryButtonText}>
            {refreshing ? "Actualizando…" : "Actualizar análisis"}
          </Text>
        </Pressable>
        {refreshError && <Text style={styles.error}>{refreshError}</Text>}
      </View>

      <Text style={styles.sectionTitle}>Próximas ideas</Text>
      {suggestionsLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : upcoming.length === 0 ? (
        <Text style={styles.muted}>No hay ideas pendientes.</Text>
      ) : (
        upcoming.map((suggestion) => (
          <Pressable
            key={suggestion.id}
            style={styles.card}
            onPress={() => router.push(`/trends/${suggestion.id}`)}
            accessibilityRole="button"
          >
            <Text style={styles.eyebrow}>
              {formatPublishAt(suggestion.publishAt)} · {networkLabels[suggestion.network]} ·{" "}
              {formatLabels[suggestion.format]}
            </Text>
            <Text style={styles.body}>{suggestion.idea}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  headerLink: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.primary },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    textTransform: "uppercase",
    color: colors.foreground,
    marginTop: 8,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surface,
    gap: 8,
  },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.3,
    textTransform: "uppercase",
    color: colors.secondary,
  },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.foreground },
  muted: { fontFamily: fonts.body, fontSize: 15, color: colors.foregroundMuted },
  error: { fontFamily: fonts.body, fontSize: 14, color: colors.danger },
  link: { fontFamily: fonts.body, fontSize: 15, color: colors.primary },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.mutedForeground,
    backgroundColor: colors.muted,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: "hidden",
  },
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
