import { StyleSheet, Text } from "react-native";
import type { ChatBlock } from "@businext/shared-core/assistant";
import { colors } from "@/theme/colors";
import { BookingRequestCard } from "./cards/BookingRequestCard";
import { CashSummaryCard } from "./cards/CashSummaryCard";
import { ConfirmationCard } from "./cards/ConfirmationCard";
import { ReservationListCard } from "./cards/ReservationListCard";
import { Markdown } from "./Markdown";
import { QuickActions } from "./QuickActions";

type Props = {
  block: ChatBlock;
  isUser: boolean;
  onQuickReply?: (message: string) => void;
  onConfirm?: (actionId: string, decision: "confirm" | "cancel") => void;
};

export function ChatBlockView({ block, isUser, onQuickReply, onConfirm }: Props) {
  const textStyle = isUser ? styles.userText : styles.assistantText;

  switch (block.type) {
    case "text":
      return isUser ? (
        <Text style={textStyle}>{block.text}</Text>
      ) : (
        <Markdown text={block.text} style={textStyle} />
      );
    case "quick_replies":
      return (
        <QuickActions
          chips={block.options}
          onPress={(message) => onQuickReply?.(message)}
          disabled={!onQuickReply}
          wrap
        />
      );
    case "reservation_list":
      return <ReservationListCard block={block} />;
    case "cash_summary":
      return <CashSummaryCard block={block} />;
    case "booking_request":
      return <BookingRequestCard block={block} />;
    case "confirmation":
      return (
        <ConfirmationCard
          block={block}
          onDecide={onConfirm ? (decision) => onConfirm(block.action_id, decision) : undefined}
        />
      );
  }
}

const styles = StyleSheet.create({
  userText: { fontSize: 16, lineHeight: 22, color: colors.primaryForeground },
  assistantText: { fontSize: 16, lineHeight: 22, color: colors.foreground },
});
