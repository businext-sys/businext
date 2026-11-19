import type { ComponentProps } from "react";
import { Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAccessContext, useConfiguration } from "@businext/shared-core/hooks";
import { useAuth } from "@/context/AuthContext";
import { VoiceAgentSection } from "@/components/VoiceAgentSection";
import { AppearanceSection } from "@/components/AppearanceSection";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";
import { NotificationsSection } from "@/components/NotificationsSection";
import { shareBookingLink, WEB_URL } from "@/lib/links";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

type IconName = ComponentProps<typeof Ionicons>["name"];

/**
 * Ajustes (issues #78 y #218): cuenta, clientes, enlace de reservas,
 * notificaciones, agente de voz (owner), apariencia, privacidad, cerrar sesión
 * y borrar cuenta.
 */
export default function SettingsScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { logout } = useAuth();
  const { context } = useAccessContext();
  const { configurationData } = useConfiguration();
  const router = useRouter();
  const canManageClients = context?.role === "owner" || context?.role === "manager";

  const confirmLogout = () =>
    Alert.alert("Cerrar sesión", "¿Seguro que quieres salir?", [
      { text: "Volver", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: logout },
    ]);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      {context && (
        <View style={styles.account}>
          <Ionicons name="person-circle-outline" size={40} color={colors.foregroundSubtle} />
          <View style={styles.accountText}>
            <Text style={styles.value} numberOfLines={1}>
              {context.profile?.displayName ?? context.profile?.email}
            </Text>
            {context.profile?.displayName && context.profile.email && (
              <Text style={styles.hint} numberOfLines={1}>
                {context.profile.email}
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.group}>
        <SettingsRow icon="people-outline" label="Clientes" onPress={() => router.push("/customers")} />
        {canManageClients && (
          <SettingsRow
            icon="heart-dislike-outline"
            label="Clientes en riesgo"
            hint="Escribe a quien hace tiempo que no viene"
            onPress={() => router.push("/clients-at-risk")}
          />
        )}
        {canManageClients && context?.businessId && (
          <SettingsRow
            icon="share-outline"
            label="Compartir enlace de reservas"
            hint="Para que tus clientes reserven solos"
            onPress={() => shareBookingLink(context.businessId, configurationData[0]?.businessName)}
            last
          />
        )}
      </View>

      <NotificationsSection />
      {context?.role === "owner" && <VoiceAgentSection />}
      <AppearanceSection />

      <View style={styles.group}>
        <SettingsRow
          icon="shield-checkmark-outline"
          label="Política de privacidad"
          onPress={() => Linking.openURL(`${WEB_URL}/privacidad`)}
        />
        <SettingsRow icon="log-out-outline" label="Cerrar sesión" onPress={confirmLogout} danger last />
      </View>
      {context && <DeleteAccountSection isOwner={context.role === "owner"} />}
    </ScrollView>
  );
}

function SettingsRow({
  icon,
  label,
  hint,
  onPress,
  danger,
  last,
}: {
  icon: IconName;
  label: string;
  hint?: string;
  onPress: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const color = danger ? colors.danger : colors.foreground;
  return (
    <Pressable
      style={({ pressed }) => [styles.row, !last && styles.rowBorder, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={22} color={color} />
      <View style={styles.rowText}>
        <Text style={[styles.value, { color }]}>{label}</Text>
        {hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
      {!danger && <Ionicons name="chevron-forward" size={18} color={colors.foregroundSubtle} />}
    </Pressable>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  account: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 4 },
  accountText: { flex: 1, gap: 2 },
  group: { borderRadius: 12, backgroundColor: colors.surface, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, minHeight: 56, paddingVertical: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  pressed: { opacity: 0.6 },
  rowText: { flex: 1, gap: 2 },
  value: { fontSize: 15, color: colors.foreground },
  hint: { fontSize: 13, color: colors.foregroundSubtle },
}));
