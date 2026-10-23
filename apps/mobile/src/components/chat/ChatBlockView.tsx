import { StyleSheet, Text } from "react-native";
import type { ChatBlock } from "@businext/shared-core/assistant";
import { colors } from "@/theme/colors";
import { Markdown } from "./Markdown";
import { QuickActions } from "./QuickActions";

type Props = {
  block: ChatBlock;
  isUser: boolean;
  onQuickReply?: (message: string) => void;
};

export function ChatBlockView({ block, isUser, onQuickReply }: Props) {
  const textStyle = isUser ? styles.userText : styles.assistantText;

  if (block.type === "text") {
    return isUser ? <Text style={textStyle}>{block.text}</Text> : <Markdown text={block.text} style={textStyle} />;
  }

  if (block.type === "quick_replies") {
    return (
      <QuickActions
        chips={block.options}
        onPress={(message) => onQuickReply?.(message)}
        disabled={!onQuickReply}
        wrap
      />
    );
  }

  return <Text style={textStyle}>{block.fallback_text ?? ""}</Text>;
}

const styles = StyleSheet.create({
  userText: { fontSize: 16, lineHeight: 22, color: colors.primaryForeground },
  assistantText: { fontSize: 16, lineHeight: 22, color: colors.foreground },
});
