import { useRef } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { ChatMessage } from "@businext/shared-core/assistant";
import { useAssistantChat } from "@businext/shared-core/hooks";
import { ChatErrorBanner } from "@/components/chat/ChatErrorBanner";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
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

  const lastMessage = chat.messages[chat.messages.length - 1];
  const waitingForText =
    chat.status === "streaming" && (lastMessage?.role !== "assistant" || chat.activity !== null);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ChatHeader
        menuItems={[
          { label: "Nueva conversación", onPress: () => chat.reset() },
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
        renderItem={({ item }) => <MessageBubble message={item} />}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={chat.messages.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <Text style={styles.empty} accessibilityRole="header">
            ¿En qué te ayudo hoy?
          </Text>
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

      <ChatInput streaming={chat.status === "streaming"} onSend={chat.send} onStop={chat.stop} />
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
  empty: {
    color: colors.foreground,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
  },
});
