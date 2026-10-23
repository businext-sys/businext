import { StyleSheet, View } from "react-native";
import type { ChatMessage } from "@businext/shared-core/assistant";
import { colors } from "@/theme/colors";
import { ChatBlockView } from "./ChatBlockView";

function spokenText(message: ChatMessage): string {
  const text = message.blocks
    .map((block) => (block.type === "text" ? block.text : ""))
    .join(". ");
  return `${message.role === "user" ? "Tú" : "Asistente"}: ${text}`;
}

type Props = {
  message: ChatMessage;
  onQuickReply?: (message: string) => void;
};

export function MessageBubble({ message, onQuickReply }: Props) {
  const isUser = message.role === "user";
  if (message.blocks.length === 0) return null;
  const textOnly = message.blocks.every((block) => block.type === "text");

  return (
    <View
      style={[styles.row, isUser ? styles.userRow : styles.assistantRow]}
      accessible={textOnly}
      accessibilityLabel={textOnly ? spokenText(message) : undefined}
    >
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {message.blocks.map((block, index) => (
          <ChatBlockView key={index} block={block} isUser={isUser} onQuickReply={onQuickReply} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 12, paddingVertical: 4, flexDirection: "row" },
  userRow: { justifyContent: "flex-end" },
  assistantRow: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "85%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  userBubble: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  assistantBubble: { backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
});
