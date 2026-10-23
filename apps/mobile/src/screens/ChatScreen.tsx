import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { assistantApi } from "@businext/shared-core/api";
import { quickActionsFor, type ChatMessage } from "@businext/shared-core/assistant";
import { useAccessContext, useAssistantChat } from "@businext/shared-core/hooks";
import { ChatErrorBanner } from "@/components/chat/ChatErrorBanner";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { QuickActions } from "@/components/chat/QuickActions";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useAuth } from "@/context/AuthContext";
import { usePushRegistration } from "@/hooks/usePushRegistration";
import { assistantClient } from "@/lib/assistantClient";
import { colors } from "@/theme/colors";

/**
 * Home de la app (issue #78): el chat del asistente.
 */
export default function ChatScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const pushState = usePushRegistration();
  const chat = useAssistantChat({ client: assistantClient });
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const { conversation } = useLocalSearchParams<{ conversation?: string }>();
  const [loadingConversation, setLoadingConversation] = useState(false);
  const { reset } = chat;

  useEffect(() => {
    if (!conversation) return;
    router.setParams({ conversation: undefined });
    if (conversation === "new") {
      reset();
      return;
    }
    setLoadingConversation(true);
    assistantApi
      .getConversation(conversation, assistantClient)
      .then((loaded) => reset({ id: loaded.id, messages: loaded.messages }))
      .catch(() => Alert.alert("No se ha podido abrir la conversación."))
      .finally(() => setLoadingConversation(false));
  }, [conversation, reset, router]);

  const { context } = useAccessContext();
  const quickActions = quickActionsFor(context?.capabilities ?? null);
  const streaming = chat.status === "streaming";
  const lastAssistantId = [...chat.messages].reverse().find((m) => m.role === "assistant")?.id;

  const lastMessage = chat.messages[chat.messages.length - 1];
  const waitingForText =
    streaming && (lastMessage?.role !== "assistant" || chat.activity !== null);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ChatHeader
        menuItems={[
          { label: "Nueva conversación", onPress: () => chat.reset() },
          { label: "Historial", onPress: () => router.push("/conversations") },
          { label: "Agenda", onPress: () => router.push("/agenda") },
          { label: "Ajustes", onPress: () => router.push("/settings") },
          { label: "Cerrar sesión", onPress: logout, destructive: true },
        ]}
      />

      {pushState.status === "denied" && (
        <View style={styles.pushBanner}>
          <Text style={styles.pushBannerText}>{pushState.message}</Text>
        </View>
      )}

      <FlatList
        ref={listRef}
        data={chat.messages}
        keyExtractor={(message) => message.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            onQuickReply={item.id === lastAssistantId && !streaming ? chat.send : undefined}
            onConfirm={streaming ? undefined : chat.confirm}
          />
        )}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={chat.messages.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          loadingConversation ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View style={styles.emptyContent}>
              <Text style={styles.empty} accessibilityRole="header">
                ¿En qué te ayudo hoy?
              </Text>
              <QuickActions chips={quickActions} onPress={chat.send} wrap />
            </View>
          )
        }
        ListFooterComponent={
          <>
            {waitingForText && <TypingIndicator activity={chat.activity} />}
            {chat.status === "error" && chat.error && (
              <ChatErrorBanner message={chat.error} onRetry={chat.retry} />
            )}
          </>
        }
      />

      {chat.messages.length > 0 && (
        <QuickActions chips={quickActions} onPress={chat.send} disabled={streaming} />
      )}
      <ChatInput streaming={streaming} onSend={chat.send} onStop={chat.stop} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  pushBanner: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pushBannerText: {
    fontSize: 12,
    color: colors.accentForeground,
  },
  list: { paddingVertical: 12 },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyContent: { gap: 24 },
  empty: {
    color: colors.foreground,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
  },
});
