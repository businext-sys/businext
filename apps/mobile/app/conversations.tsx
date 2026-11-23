import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { readablePreview, type ConversationSummary } from "@businext/shared-core/assistant";
import { useAssistantConversations } from "@businext/shared-core/hooks";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { SwipeToDeleteRow } from "@/components/SwipeToDeleteRow";
import { assistantClient } from "@/lib/assistantClient";
import { formatHour, isSameDay } from "@/lib/date";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

function formatUpdatedAt(dateStr: string): string {
  if (isSameDay(dateStr, new Date())) return formatHour(dateStr);
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

/**
 * Historial de conversaciones con el asistente (issues #82 y #218): toca para
 * abrir; desliza a la izquierda o mantén pulsado para borrar.
 */
export default function ConversationsScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
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
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderIconButton
              icon="create-outline"
              label="Nueva conversación"
              onPress={() => open()}
              testID="conversations-new"
            />
          ),
        }}
      />
      <FlatList
        data={conversations}
        keyExtractor={(conversation) => conversation.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={async () => {
              await mutate();
            }}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={conversations.length === 0 ? styles.emptyContainer : undefined}
        renderItem={({ item }) => {
          const preview = readablePreview(item.last_message_preview);
          return (
            <SwipeToDeleteRow onDelete={() => confirmDelete(item)} deleteLabel={`Borrar ${item.title}`}>
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                onPress={() => open(item.id)}
                onLongPress={() => confirmDelete(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}, ${formatUpdatedAt(item.updated_at)}`}
                accessibilityHint="Abre la conversación. Mantén pulsado para borrarla."
                accessibilityActions={[{ name: "delete", label: "Borrar" }]}
                onAccessibilityAction={(event) => {
                  if (event.nativeEvent.actionName === "delete") confirmDelete(item);
                }}
              >
                <View style={styles.titleRow}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.date}>{formatUpdatedAt(item.updated_at)}</Text>
                </View>
                {preview && (
                  <Text style={styles.preview} numberOfLines={1}>
                    {preview}
                  </Text>
                )}
              </Pressable>
            </SwipeToDeleteRow>
          );
        }}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View style={styles.empty}>
              <Ionicons name="chatbubbles-outline" size={40} color={colors.foregroundSubtle} />
              <Text style={styles.emptyText}>
                {error ? "No se ha podido cargar el historial." : "Aún no hay conversaciones."}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  pressed: { backgroundColor: colors.surface },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { flex: 1, fontSize: 16, fontWeight: "600", color: colors.foreground },
  date: { fontSize: 13, color: colors.foregroundSubtle },
  preview: { fontSize: 14, color: colors.foregroundMuted },
  emptyContainer: { flexGrow: 1, justifyContent: "center" },
  empty: { alignItems: "center", gap: 12 },
  emptyText: { textAlign: "center", fontSize: 15, color: colors.foregroundMuted },
}));
