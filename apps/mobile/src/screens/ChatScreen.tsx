import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useAssistantChat } from "@businext/shared-core/hooks";
import { ChatHeader } from "@/components/chat/ChatHeader";
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
  const [draft, setDraft] = useState("");

  const send = () => {
    chat.send(draft);
    setDraft("");
  };

  return (
    <View style={styles.flex}>
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
        data={chat.messages}
        keyExtractor={(message) => message.id}
        renderItem={({ item }) => (
          <Text style={styles.message}>
            {item.blocks.map((block) => (block.type === "text" ? block.text : "")).join("\n")}
          </Text>
        )}
        ListEmptyComponent={<Text style={styles.empty}>¿En qué te ayudo hoy?</Text>}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Escribe un mensaje"
          placeholderTextColor={colors.foregroundSubtle}
        />
        <Pressable style={styles.sendButton} onPress={send} accessibilityRole="button">
          <Text style={styles.sendText}>Enviar</Text>
        </Pressable>
      </View>
    </View>
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
  message: {
    color: colors.foreground,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  empty: {
    color: colors.foregroundMuted,
    textAlign: "center",
    marginTop: 48,
    fontSize: 18,
  },
  inputBar: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    color: colors.foreground,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButton: {
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  sendText: {
    color: colors.primaryForeground,
    fontWeight: "700",
  },
});
