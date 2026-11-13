import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Redirect, Stack, useRouter } from "expo-router";
import { useAccessContext, useFinances } from "@businext/shared-core/hooks";
import type { Finances } from "@businext/shared-core/finances";
import { addDays, formatHour, isSameDay } from "@/lib/date";
import { Chip } from "@/components/Chip";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

type Period = "day" | "week" | "month";

const PERIODS: { key: Period; label: string }[] = [
  { key: "day", label: "Hoy" },
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
];

function periodStart(period: Period, now: Date): Date {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "week") return addDays(start, -((start.getDay() + 6) % 7));
  if (period === "month") start.setDate(1);
  return start;
}

function formatMoney(amount: number): string {
  return `${amount.toLocaleString("es-ES")}€`;
}

function formatMovementDate(dateStr: string): string {
  if (isSameDay(dateStr, new Date())) return `Hoy, ${formatHour(dateStr)}`;
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export default function CashRoute() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { context, capabilities, loading } = useAccessContext();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!capabilities.canManageFinances || context?.role === "employee") return <Redirect href="/" />;

  return <CashScreen isOwner={context?.role === "owner"} />;
}

function CashScreen({ isOwner }: { isOwner: boolean }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const { financesData, loading, getAllFinances, deleteFinance } = useFinances();
  const [period, setPeriod] = useState<Period>("day");

  const movements = useMemo(() => {
    const start = periodStart(period, new Date()).getTime();
    return financesData
      .filter((f) => f.created_at && new Date(f.created_at).getTime() >= start)
      .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
  }, [financesData, period]);

  const totals = useMemo(() => {
    const incomes = movements.filter((f) => f.type === "INCOME");
    const gross = incomes.reduce((sum, f) => sum + f.amount, 0);
    const commission = incomes.reduce((sum, f) => sum + (f.commission_amount ?? 0), 0);
    const income = isOwner ? gross : Math.max(0, gross - commission);
    const expense = movements
      .filter((f) => f.type === "EXPENSE")
      .reduce((sum, f) => sum + f.amount, 0);
    return { income, expense, balance: income - expense };
  }, [movements, isOwner]);

  const confirmDelete = (movement: Finances) =>
    Alert.alert("Eliminar movimiento", `¿Eliminar «${movement.concept}»?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFinance(movement.id!);
          } catch (err) {
            Alert.alert(
              err instanceof Error && err.message === "LINKED_TO_RESERVATION"
                ? "Este movimiento viene de una reserva. Reviértela primero desde la agenda."
                : "No se ha podido eliminar el movimiento."
            );
          }
        },
      },
    ]);

  return (
    <View style={styles.flex}>
      {isOwner && (
        <Stack.Screen
          options={{
            headerRight: () => (
              <Pressable
                onPress={() => router.push("/cash/new")}
                accessibilityRole="button"
                hitSlop={8}
                testID="cash-new"
              >
                <Text style={styles.headerLink}>Añadir</Text>
              </Pressable>
            ),
          }}
        />
      )}

      <FlatList
        data={movements}
        keyExtractor={(movement, index) => String(movement.id ?? index)}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={async () => {
              await getAllFinances();
            }}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.summary}>
            <View style={styles.periods}>
              {PERIODS.map(({ key, label }) => (
                <Chip key={key} label={label} selected={period === key} onPress={() => setPeriod(key)} />
              ))}
            </View>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balance}>{formatMoney(totals.balance)}</Text>
            <View style={styles.totals}>
              <View style={styles.total}>
                <Text style={styles.totalLabel}>{isOwner ? "Ingresos" : "Mis ingresos"}</Text>
                <Text style={[styles.totalValue, styles.income]}>{formatMoney(totals.income)}</Text>
              </View>
              <View style={styles.total}>
                <Text style={styles.totalLabel}>Gastos</Text>
                <Text style={[styles.totalValue, styles.expense]}>{formatMoney(totals.expense)}</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isIncome = item.type === "INCOME";
          return (
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.concept} numberOfLines={1}>
                  {item.concept}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {[item.creator, item.customer_name].filter(Boolean).join(" · ")}
                </Text>
                {item.created_at && <Text style={styles.date}>{formatMovementDate(item.created_at)}</Text>}
              </View>
              <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
                {isIncome ? "+" : "-"}
                {formatMoney(item.amount)}
              </Text>
              {isOwner && item.id !== undefined && item.id > 0 && (
                <Pressable
                  style={styles.delete}
                  onPress={() => confirmDelete(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar ${item.concept}`}
                >
                  <Text style={styles.deleteText}>Eliminar</Text>
                </Pressable>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.empty}>No hay movimientos en este periodo.</Text>
          )
        }
      />
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  headerLink: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.primary },
  summary: {
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  periods: { flexDirection: "row", gap: 8, marginBottom: 8 },
  balanceLabel: { fontSize: 12, color: colors.foregroundSubtle },
  balance: { fontFamily: fonts.display, fontSize: 36, color: colors.foreground },
  totals: { flexDirection: "row", gap: 12 },
  total: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    gap: 2,
  },
  totalLabel: { fontSize: 12, color: colors.foregroundSubtle },
  totalValue: { fontSize: 16, fontWeight: "700" },
  income: { color: colors.success },
  expense: { color: colors.danger },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  info: { flex: 1, gap: 2 },
  concept: { fontSize: 15, fontWeight: "600", color: colors.foreground },
  meta: { fontSize: 13, color: colors.foregroundMuted },
  date: { fontSize: 12, color: colors.foregroundSubtle },
  amount: { fontSize: 15, fontWeight: "700" },
  delete: { minHeight: 44, justifyContent: "center" },
  deleteText: { fontSize: 14, color: colors.danger },
  empty: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
    color: colors.foregroundMuted,
  },
}));
