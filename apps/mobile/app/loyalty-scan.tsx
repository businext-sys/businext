import { useCallback, useRef } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { Stack } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { useLoyaltyProgram, useLoyaltyScan } from "@businext/shared-core/hooks";
import { parseLoyaltyQr, stampsLeft, type LoyaltyScanResult } from "@businext/shared-core/loyalty";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

const RETRY_SAME_QR_MS = 4000;

/**
 * «Escanear tarjeta»: lee el QR del pase de fidelidad del cliente y permite
 * añadir un sello (visita sin reserva, uno al día) o canjear el premio. Lo
 * puede usar cualquier rol.
 */
export default function LoyaltyScanScreen() {
  const styles = useStyles();
  const { program, loading } = useLoyaltyProgram();

  return (
    <>
      <Stack.Screen options={{ title: "Escanear tarjeta" }} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : !program?.enabled ? (
        <View style={styles.center}>
          <Text style={styles.title}>Tarjeta desactivada</Text>
          <Text style={styles.muted}>Actívala en la configuración para sellar y canjear tarjetas.</Text>
        </View>
      ) : (
        <Scanner />
      )}
    </>
  );
}

function Scanner() {
  const styles = useStyles();
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const { result, busy, error, notFound, scan, stamp, redeem, reset } = useLoyaltyScan();
  const lastScan = useRef<{ token: string; at: number } | null>(null);

  const onScanned = useCallback(
    ({ data }: BarcodeScanningResult) => {
      const token = parseLoyaltyQr(data);
      if (!token) return;
      const last = lastScan.current;
      if (last && last.token === token && Date.now() - last.at < RETRY_SAME_QR_MS) return;
      lastScan.current = { token, at: Date.now() };
      scan(token);
    },
    [scan]
  );

  if (result) {
    return (
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <CardSummary card={result} />
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.actions}>
          <ActionButton
            label="Añadir sello"
            icon="add-circle-outline"
            onPress={stamp}
            loading={busy === "stamp"}
            disabled={busy !== null || result.stampedToday}
          />
          <ActionButton
            label="Canjear"
            icon="gift-outline"
            onPress={redeem}
            loading={busy === "redeem"}
            disabled={busy !== null || !result.rewardReady}
            primary
          />
        </View>
        <Pressable
          style={({ pressed }) => [styles.link, pressed && styles.pressed]}
          onPress={() => {
            lastScan.current = null;
            reset();
          }}
          accessibilityRole="button"
        >
          <Ionicons name="scan-outline" size={20} color={colors.foregroundMuted} />
          <Text style={styles.linkText}>Escanear otra</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={32} color={colors.foregroundSubtle} />
        <Text style={styles.muted}>Para leer el QR de la tarjeta hace falta la cámara.</Text>
        {permission.canAskAgain ? (
          <ActionButton label="Permitir la cámara" icon="camera-outline" onPress={requestPermission} primary />
        ) : (
          <ActionButton label="Abrir ajustes" icon="settings-outline" onPress={() => Linking.openSettings()} primary />
        )}
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <CameraView
        style={styles.flex}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={busy ? undefined : onScanned}
      />
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame} />
      </View>
      <View style={styles.footer}>
        {busy === "scan" ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={styles.error}>
            {notFound ? "Esta tarjeta no es de tu negocio o ya no existe." : error}
          </Text>
        ) : (
          <Text style={styles.muted}>Apunta al QR de la tarjeta del cliente</Text>
        )}
      </View>
    </View>
  );
}

function CardSummary({ card }: { card: LoyaltyScanResult }) {
  const styles = useStyles();
  const left = stampsLeft(card);
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>TARJETA DE FIDELIDAD</Text>
      <Text style={styles.title} numberOfLines={1}>
        {card.customerName}
      </Text>
      <Text style={styles.metric}>
        {card.stamps}/{card.stampsRequired}
        <Text style={styles.muted}> sellos</Text>
      </Text>
      {card.rewardReady ? (
        <View style={styles.reward}>
          <Text style={styles.rewardText}>Premio disponible: {card.reward}</Text>
        </View>
      ) : (
        <Text style={styles.muted}>
          {card.reward}: le {left === 1 ? "falta 1 sello" : `faltan ${left} sellos`}
        </Text>
      )}
      {card.stampAdded && <Text style={styles.muted}>Sello añadido.</Text>}
      {card.stampedToday && !card.stampAdded && <Text style={styles.muted}>Ya tiene el sello de hoy.</Text>}
    </View>
  );
}

function ActionButton({
  label,
  icon,
  onPress,
  loading,
  disabled,
  primary,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => unknown;
  loading?: boolean;
  disabled?: boolean;
  primary?: boolean;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const color = primary ? colors.primaryForeground : colors.foreground;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        primary ? styles.buttonPrimary : styles.buttonSecondary,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? <ActivityIndicator color={color} /> : <Ionicons name={icon} size={20} color={color} />}
      <Text style={[styles.buttonText, { color }]}>{label}</Text>
    </Pressable>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 20 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 64, alignItems: "center", justifyContent: "center" },
  frame: { width: "65%", aspectRatio: 1, borderWidth: 2, borderRadius: 12, borderColor: colors.primary },
  footer: { padding: 20, minHeight: 64, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  card: { padding: 16, borderRadius: 8, backgroundColor: colors.surface, gap: 8 },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 1.3, color: colors.secondary },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.foreground },
  metric: { fontFamily: fonts.display, fontSize: 44, color: colors.foreground },
  muted: { fontFamily: fonts.body, fontSize: 15, color: colors.foregroundMuted, textAlign: "center" },
  error: { fontFamily: fonts.body, fontSize: 15, color: colors.danger, textAlign: "center" },
  reward: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: colors.success },
  rewardText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.successForeground },
  actions: { flexDirection: "row", gap: 12 },
  button: { flex: 1, height: 48, borderRadius: 6, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 16 },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonSecondary: { borderWidth: 1, borderColor: colors.border },
  buttonText: { fontFamily: fonts.bodyBold, fontSize: 15 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.7 },
  link: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 44 },
  linkText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.foregroundMuted },
}));
