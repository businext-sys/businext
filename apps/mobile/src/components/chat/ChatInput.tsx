import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDictation } from "@/hooks/useDictation";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

type Props = {
  streaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
};

export function ChatInput({ streaming, onSend, onStop }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [draft, setDraft] = useState("");
  const dictation = useDictation(onSend);
  const holdingRef = useRef(false);
  const [holding, setHolding] = useState(false);
  const hasDraft = draft.trim().length > 0;
  const showMic = dictation.available && (!hasDraft || dictation.listening);

  const send = () => {
    if (!hasDraft || streaming) return;
    onSend(draft);
    setDraft("");
  };

  return (
    <View style={styles.wrapper}>
      {dictation.listening && (
        <Text style={styles.hint} accessibilityLiveRegion="polite">
          {holding ? "Suelta para enviar" : "Escuchando… toca la flecha para enviar"}
        </Text>
      )}
      <View style={styles.bar}>
        {dictation.listening && (
          <Pressable
            style={[styles.button, styles.ghost]}
            onPress={dictation.cancel}
            accessibilityRole="button"
            accessibilityLabel="Cancelar dictado"
            testID="chat-dictation-cancel"
          >
            <Ionicons name="close" size={22} color={colors.foreground} />
          </Pressable>
        )}
        <TextInput
          style={styles.input}
          value={dictation.listening ? dictation.transcript : draft}
          onChangeText={setDraft}
          editable={!dictation.listening}
          placeholder={dictation.listening ? "Habla, te escucho" : "Escribe o mantén el micro"}
          placeholderTextColor={colors.foregroundSubtle}
          multiline
          maxLength={2000}
          accessibilityLabel="Mensaje para el asistente"
          testID="chat-input"
        />
        {streaming ? (
          <Pressable
            style={[styles.button, styles.ghost]}
            onPress={onStop}
            accessibilityRole="button"
            accessibilityLabel="Parar respuesta"
            testID="chat-stop"
          >
            <Ionicons name="stop" size={18} color={colors.foreground} />
          </Pressable>
        ) : showMic ? (
          <Pressable
            style={[styles.button, dictation.listening ? styles.recording : styles.mic]}
            onPress={() => (dictation.listening ? dictation.stop() : dictation.start())}
            onLongPress={() => {
              holdingRef.current = true;
              setHolding(true);
              dictation.start();
            }}
            onPressOut={() => {
              if (!holdingRef.current) return;
              holdingRef.current = false;
              setHolding(false);
              dictation.stop();
            }}
            delayLongPress={250}
            accessibilityRole="button"
            accessibilityLabel={dictation.listening ? "Enviar lo dictado" : "Dictar mensaje"}
            accessibilityHint={dictation.listening ? undefined : "Toca para hablar o mantén pulsado y suelta para enviar"}
            testID="chat-mic"
          >
            <Ionicons
              name={dictation.listening ? "arrow-up" : "mic"}
              size={22}
              color={colors.primaryForeground}
            />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.button, !hasDraft && styles.disabled]}
            onPress={send}
            disabled={!hasDraft}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensaje"
            accessibilityState={{ disabled: !hasDraft }}
            testID="chat-send"
          >
            <Ionicons name="arrow-up" size={22} color={colors.primaryForeground} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  wrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    backgroundColor: colors.background,
    paddingTop: 8,
    paddingBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: colors.foregroundSubtle,
    textAlign: "center",
    paddingBottom: 6,
  },
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
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
  mic: { backgroundColor: colors.primary },
  recording: { backgroundColor: colors.danger },
  disabled: { opacity: 0.4 },
  ghost: { backgroundColor: colors.surfaceRaised },
}));
