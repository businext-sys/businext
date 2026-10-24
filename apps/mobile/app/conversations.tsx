import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { ConversationSummary } from "@businext/shared-core/assistant";
import { useAssistantConversations } from "@businext/shared-core/hooks";
import { assistantClient } from "@/lib/assistantClient";
import { formatHour, isSameDay } from "@/lib/date";
import { colors } from "@/theme/colors";

function formatUpdatedAt(dateStr: string): string {
  if (isSameDay(dateStr, new Date())) return `Hoy, ${formatHour(dateStr)}`;
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

/**
 * Historial de conversaciones con el asistente (issue #82).
 */
export default function ConversationsScreen() {
  const router = useRouter();
  const { conversations, loading, error, mutate, deleteConversation } = useAssistantConversations({
    client: assistantClient,
  });

  const open = (id?: string) => router.navigate({ pathname: "/", params: { conversation: id ?? "new" } });

  const confirmDelete = (conversation: ConversationSummary) =>
    Alert.alert("Borrar conversación", `¿Borrar «${conversation.title}»? No se puede deshacer.`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          const ok = await deleteConversation(conversation.id);
          if (!ok) Alert.alert("No se ha podido borrar la conversación.");
        },
      },
    ]);

  return (
    <View style={styles.flex}>
      <Pressable style={styles.newButton} onPress={() => open()} accessibilityRole="button" testID="conversations-new">
        <Text style={styles.newButtonText}>Nueva conversación</Text>
      </Pressable>

      <FlatList
        data={conversations}
        keyExtractor={(conversation) => conversation.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={async () => { await mutate(); }} tintColor={colors.primary} />}
        contentContainerStyle={conversations.length === 0 ? styles.emptyContainer : undefined}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              style={styles.info}
              onPress={() => open(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${formatUpdatedAt(item.updated_at)}`}
              accessibilityHint="Abre la conversación"
            >
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              {item.last_message_preview && (
                <Text style={styles.preview} numberOfLines={1}>
                  {item.last_message_preview}
                </Text>
              )}
              <Text style={styles.date}>{formatUpdatedAt(item.updated_at)}</Text>
            </Pressable>
            <Pressable
              style={styles.delete}
              onPress={() => confirmDelete(item)}
              accessibilityRole="button"
              accessibilityLabel={`Borrar ${item.title}`}
            >
              <Text style={styles.deleteText}>Borrar</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.empty}>
              {error ? "No se ha podido cargar el historial." : "Aún no hay conversaciones."}
            </Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  newButton: {
    margin: 16,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  newButtonText: { fontSize: 15, fontWeight: "700", color: colors.primaryForeground },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  info: { flex: 1, paddingVertical: 12, gap: 2 },
  title: { fontSize: 15, fontWeight: "600", color: colors.foreground },
  preview: { fontSize: 13, color: colors.foregroundMuted },
  date: { fontSize: 12, color: colors.foregroundSubtle },
  delete: { minHeight: 44, justifyContent: "center", paddingLeft: 12 },
  deleteText: { fontSize: 14, color: colors.danger },
  emptyContainer: { flexGrow: 1, justifyContent: "center" },
  empty: { textAlign: "center", fontSize: 14, color: colors.foregroundMuted },
});
