import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "@/theme/colors";

type Props = {
  streaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
};

export function ChatInput({ streaming, onSend, onStop }: Props) {
  const [draft, setDraft] = useState("");
  const canSend = draft.trim().length > 0 && !streaming;

  const send = () => {
    if (!canSend) return;
    onSend(draft);
    setDraft("");
  };

  return (
    <View style={styles.bar}>
      <TextInput
        style={styles.input}
        value={draft}
        onChangeText={setDraft}
        placeholder="Pregunta lo que necesites"
        placeholderTextColor={colors.foregroundSubtle}
        multiline
        maxLength={2000}
        accessibilityLabel="Mensaje para el asistente"
        testID="chat-input"
      />
      {streaming ? (
        <Pressable
          style={[styles.button, styles.stop]}
          onPress={onStop}
          accessibilityRole="button"
          accessibilityLabel="Parar respuesta"
          testID="chat-stop"
        >
          <Text style={styles.stopText}>■</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[styles.button, !canSend && styles.disabled]}
          onPress={send}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Enviar mensaje"
          accessibilityState={{ disabled: !canSend }}
          testID="chat-send"
        >
          <Text style={styles.sendText}>↑</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  disabled: { opacity: 0.4 },
  stop: { backgroundColor: colors.surfaceRaised },
  sendText: { fontSize: 20, fontWeight: "700", color: colors.primaryForeground },
  stopText: { fontSize: 16, color: colors.foreground },
});
