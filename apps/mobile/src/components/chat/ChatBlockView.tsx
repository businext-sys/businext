import { StyleSheet, Text } from "react-native";
import type { ChatBlock } from "@businext/shared-core/assistant";
import { colors } from "@/theme/colors";
import { Markdown } from "./Markdown";

export function ChatBlockView({ block, isUser }: { block: ChatBlock; isUser: boolean }) {
  const textStyle = isUser ? styles.userText : styles.assistantText;

  if (block.type === "text") {
    return isUser ? <Text style={textStyle}>{block.text}</Text> : <Markdown text={block.text} style={textStyle} />;
  }

  return <Text style={textStyle}>{block.fallback_text ?? ""}</Text>;
}

const styles = StyleSheet.create({
  userText: { fontSize: 16, lineHeight: 22, color: colors.primaryForeground },
  assistantText: { fontSize: 16, lineHeight: 22, color: colors.foreground },
});
