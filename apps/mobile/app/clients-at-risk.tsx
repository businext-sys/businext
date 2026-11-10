import { useMemo } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Redirect } from "expo-router";
import {
  useAccessContext,
  useFinances,
  useProduct,
  useReservation,
} from "@businext/shared-core/hooks";
import { computeClientProfiles } from "@businext/shared-core/intelligence";
import { ClientRiskCard } from "@/components/ClientRiskCard";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

export default function ClientsAtRiskRoute() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { context, loading } = useAccessContext();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (context?.role !== "owner" && context?.role !== "manager") return <Redirect href="/" />;

  return <ClientsAtRiskScreen />;
}

function ClientsAtRiskScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { reservationData, loading } = useReservation();
  const { financesData } = useFinances();
  const { productData } = useProduct();

  const atRisk = useMemo(
    () =>
      computeClientProfiles(reservationData, financesData, productData).filter(
        (p) => p.loyaltyStatus === "en_riesgo"
      ),
    [reservationData, financesData, productData]
  );

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <Text style={styles.muted}>
        Solían venir a menudo y hace tiempo que no vuelven. Escríbeles para recuperarlos.
      </Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : atRisk.length === 0 ? (
        <Text style={styles.muted}>No hay clientes en riesgo ahora mismo.</Text>
      ) : (
        atRisk.map((client) => <ClientRiskCard key={client.customerName} client={client} />)
      )}
    </ScrollView>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  muted: { fontSize: 15, color: colors.foregroundMuted },
}));
