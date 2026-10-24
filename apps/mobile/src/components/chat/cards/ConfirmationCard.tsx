import { Pressable, Text, View } from "react-native";
import type { ConfirmationBlock } from "@businext/shared-core/assistant";
import { cardStyles } from "./cardStyles";

const STATUS_LABELS: Record<Exclude<ConfirmationBlock["status"], "pending">, string> = {
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  expired: "Caducada",
};

type Props = {
  block: ConfirmationBlock;
  onDecide?: (decision: "confirm" | "cancel") => void;
};

export function ConfirmationCard({ block, onDecide }: Props) {
  return (
    <View style={cardStyles.card} testID="card-confirmation">
      <Text style={cardStyles.title}>{block.title}</Text>
      <Text style={cardStyles.muted}>{block.description}</Text>
      {block.status === "pending" ? (
        <View style={cardStyles.actions}>
          <Pressable
            style={[cardStyles.button, cardStyles.secondaryButton]}
            onPress={() => onDecide?.("cancel")}
            disabled={!onDecide}
            accessibilityRole="button"
            accessibilityState={{ disabled: !onDecide }}
            accessibilityLabel={`Cancelar: ${block.title}`}
            testID="confirmation-cancel"
          >
            <Text style={cardStyles.secondaryButtonText}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={[cardStyles.button, cardStyles.primaryButton]}
            onPress={() => onDecide?.("confirm")}
            disabled={!onDecide}
            accessibilityRole="button"
            accessibilityState={{ disabled: !onDecide }}
            accessibilityLabel={`Confirmar: ${block.title}`}
            testID="confirmation-confirm"
          >
            <Text style={cardStyles.primaryButtonText}>Confirmar</Text>
          </Pressable>
        </View>
      ) : (
        <View style={cardStyles.pill} accessibilityLiveRegion="polite">
          <Text style={cardStyles.pillText}>{STATUS_LABELS[block.status]}</Text>
        </View>
      )}
    </View>
  );
}
