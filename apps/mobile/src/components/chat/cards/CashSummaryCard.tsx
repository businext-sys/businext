import { Text, View } from "react-native";
import type { CashSummaryBlock } from "@businext/shared-core/assistant";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { useCardStyles } from "./cardStyles";

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function CashSummaryCard({ block }: { block: CashSummaryBlock }) {
  const styles = useStyles();
  const cardStyles = useCardStyles();
  const { colors } = useTheme();
  const money = (amount: number) => formatMoney(amount, block.currency);
  const max = Math.max(block.total_income, block.total_expense, 1);
  const previous = block.previous_balance;
  const change =
    previous !== null && previous !== undefined && previous !== 0
      ? Math.round(((block.balance - previous) / Math.abs(previous)) * 100)
      : null;

  return (
    <View
      style={cardStyles.card}
      testID="card-cash-summary"
      accessible
      accessibilityLabel={`Caja ${block.period_label}: balance ${money(block.balance)}, ingresos ${money(block.total_income)}, gastos ${money(block.total_expense)}${change !== null ? `, ${change >= 0 ? "sube" : "baja"} un ${Math.abs(change)} por ciento respecto al periodo anterior` : ""}`}
    >
      <Text style={cardStyles.subtle}>{block.period_label}</Text>
      <Text style={styles.balance}>{money(block.balance)}</Text>
      {change !== null && (
        <Text style={[styles.change, { color: change >= 0 ? colors.success : colors.danger }]}>
          {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% vs periodo anterior
        </Text>
      )}
      <View style={styles.bars}>
        <Bar label="Ingresos" value={money(block.total_income)} ratio={block.total_income / max} color={colors.success} />
        <Bar label="Gastos" value={money(block.total_expense)} ratio={block.total_expense / max} color={colors.danger} />
      </View>
    </View>
  );
}

function Bar({ label, value, ratio, color }: { label: string; value: string; ratio: number; color: string }) {
  const styles = useStyles();
  const cardStyles = useCardStyles();
  return (
    <View style={styles.barRow}>
      <View style={styles.barLabels}>
        <Text style={cardStyles.muted}>{label}</Text>
        <Text style={styles.barValue}>{value}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(ratio * 100)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  balance: { fontSize: 26, fontWeight: "700", color: colors.foreground },
  change: { fontSize: 13, fontWeight: "600" },
  bars: { gap: 8 },
  barRow: { gap: 4 },
  barLabels: { flexDirection: "row", justifyContent: "space-between" },
  barValue: { fontSize: 13, fontWeight: "600", color: colors.foreground },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceRaised, overflow: "hidden" },
  fill: { height: 8, borderRadius: 4 },
}));
