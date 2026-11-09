import { Linking, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useContentSuggestions } from "@businext/shared-core/hooks";
import { isSameDay } from "@/lib/date";
import { isCurrentSuggestion } from "@businext/shared-core/services";
import { formatPublishAt, networkLabels } from "@/lib/trends";
import { themedStyles } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

export function TrendSuggestionCard({ notificationsDenied }: { notificationsDenied: boolean }) {
  const styles = useStyles();
  const router = useRouter();
  const { suggestions } = useContentSuggestions();
  const today = new Date();
  const suggestion = suggestions
    .filter((s) => isCurrentSuggestion(s) && isSameDay(s.publishAt, today))
    .sort((a, b) => a.publishAt.localeCompare(b.publishAt))[0];

  if (!suggestion) return null;

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/trends/${suggestion.id}`)}
      accessibilityRole="button"
      testID="agenda-trend-card"
    >
      <Text style={styles.eyebrow}>
        Idea para hoy · {formatPublishAt(suggestion.publishAt)} · {networkLabels[suggestion.network]}
      </Text>
      <Text style={styles.idea} numberOfLines={2}>
        {suggestion.idea}
      </Text>
      {notificationsDenied && (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Sin notificaciones no te llegarán los avisos de cuándo publicar.
          </Text>
          <Pressable onPress={() => Linking.openSettings()} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.noticeLink}>Activar en ajustes</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

const useStyles = themedStyles((colors) => ({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    gap: 6,
  },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.3,
    textTransform: "uppercase",
    color: colors.accentForeground,
  },
  idea: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.accentForeground },
  notice: { gap: 4, paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.border },
  noticeText: { fontFamily: fonts.body, fontSize: 13, color: colors.accentForeground },
  noticeLink: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.accentForeground },
}));
