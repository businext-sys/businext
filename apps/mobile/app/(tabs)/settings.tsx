import { cloneElement, isValidElement, type ComponentProps, type ReactNode } from "react";
import { Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAccessContext, useConfiguration, useLoyaltyProgram } from "@businext/shared-core/hooks";
import type { AccessRole } from "@businext/shared-core";
import {
  SETTINGS_SECTIONS,
  canSeeSettingsBlock,
  type SettingsBlockId,
  type SettingsSectionId,
} from "@businext/shared-core/services";
import { useAuth } from "@/context/AuthContext";
import { VoiceAgentSection } from "@/components/VoiceAgentSection";
import { AppearanceSection } from "@/components/AppearanceSection";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";
import { NotificationsSection } from "@/components/NotificationsSection";
import { shareBookingLink, WEB_URL } from "@/lib/links";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

type IconName = ComponentProps<typeof Ionicons>["name"];

/** Abre un apartado de la configuración web (lo que aún no tiene pantalla en el móvil). */
const openWebSettings = (section: SettingsSectionId) =>
  Linking.openURL(`${WEB_URL}/configuration?section=${section}`);

/**
 * Ajustes (issues #78 y #218), agrupados en los seis apartados de la web
 * (docs/plans/configuracion-simplificada.md, `SETTINGS_SECTIONS` de shared-core).
 * Reutiliza las pantallas y secciones móviles que ya había; lo que solo existe
 * en la web se abre allí, en su apartado. Un apartado sin nada que enseñar no sale.
 */
export default function SettingsScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { logout } = useAuth();
  const { context, capabilities } = useAccessContext();
  const { configurationData } = useConfiguration();
  const router = useRouter();
  const isOwner = context?.role === "owner";
  const canManageClients = isOwner || context?.role === "manager";
  const { program: loyalty } = useLoyaltyProgram();
  const viewer = { role: context?.role as AccessRole | undefined, capabilities };
  const can = (block: SettingsBlockId) => canSeeSettingsBlock(block, viewer);

  const confirmLogout = () =>
    Alert.alert("Cerrar sesión", "¿Seguro que quieres salir?", [
      { text: "Volver", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: logout },
    ]);

  const rows: Record<SettingsSectionId, ReactNode[]> = {
    negocio: [
      can("locations") && (
        <SettingsRow
          key="negocio-web"
          icon="business-outline"
          label="Datos del negocio y locales"
          hint="Se cambian en la web"
          onPress={() => openWebSettings("negocio")}
        />
      ),
    ],
    equipo: [
      (can("businessHours") || can("team")) && (
        <SettingsRow
          key="equipo-web"
          icon="people-circle-outline"
          label="Horarios, equipo y comisiones"
          hint="Se cambian en la web"
          onPress={() => openWebSettings("equipo")}
        />
      ),
    ],
    servicios: [
      can("catalog") && (
        <SettingsRow
          key="servicios-web"
          icon="cut-outline"
          label="Servicios y productos"
          hint="Se cambian en la web"
          onPress={() => openWebSettings("servicios")}
        />
      ),
    ],
    reservas: [
      <SettingsRow key="clientes" icon="people-outline" label="Clientes" onPress={() => router.push("/customers")} />,
      loyalty?.enabled && (
        <SettingsRow
          key="escanear"
          icon="scan-outline"
          label="Escanear tarjeta"
          hint="Sella o canjea la tarjeta de fidelidad"
          onPress={() => router.push("/loyalty-scan")}
        />
      ),
      canManageClients && (
        <SettingsRow
          key="riesgo"
          icon="heart-dislike-outline"
          label="Clientes en riesgo"
          hint="Escribe a quien hace tiempo que no viene"
          onPress={() => router.push("/clients-at-risk")}
        />
      ),
      canManageClients && context?.businessId && (
        <SettingsRow
          key="enlace"
          icon="share-outline"
          label="Compartir enlace de reservas"
          hint="Para que tus clientes reserven solos"
          onPress={() => shareBookingLink(context.businessId, configurationData[0]?.businessName)}
        />
      ),
      (can("reminders") || can("loyalty")) && (
        <SettingsRow
          key="reservas-web"
          icon="ribbon-outline"
          label="Recordatorios y tarjeta de fidelidad"
          hint={isOwner ? "Se configuran en la web" : "Se ven en la web"}
          onPress={() => openWebSettings("reservas")}
        />
      ),
    ],
    asistente: [
      can("contentPreferences") && (
        <SettingsRow
          key="tendencias"
          icon="trending-up-outline"
          label="Ideas para tus redes"
          hint="Redes, ideas al día y horas sin avisos"
          onPress={() => router.push("/trends/settings")}
        />
      ),
      can("reviews") && (
        <SettingsRow
          key="resenas"
          icon="star-outline"
          label="Reseñas de Google"
          hint="Se conectan en la web"
          onPress={() => Linking.openURL(`${WEB_URL}/reviews`)}
        />
      ),
    ],
    cuenta: [
      <SettingsRow
        key="privacidad"
        icon="shield-checkmark-outline"
        label="Política de privacidad"
        onPress={() => Linking.openURL(`${WEB_URL}/privacidad`)}
      />,
      <SettingsRow key="salir" icon="log-out-outline" label="Cerrar sesión" onPress={confirmLogout} danger />,
    ],
  };

  /** Secciones móviles ya existentes que van dentro de cada apartado, sobre sus filas. */
  const extras: Partial<Record<SettingsSectionId, ReactNode>> = {
    asistente: can("voiceAgent") && <VoiceAgentSection />,
    cuenta: (
      <>
        <NotificationsSection />
        <AppearanceSection />
      </>
    ),
  };

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

      {SETTINGS_SECTIONS.map((section) => {
        const visibleRows = rows[section.id].filter(Boolean);
        const extra = extras[section.id];
        if (visibleRows.length === 0 && !extra) return null;
        return (
          <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                {section.label}
              </Text>
              <Text style={styles.hint}>{section.description}</Text>
            </View>
            {extra}
            {visibleRows.length > 0 && (
              <View style={styles.group}>
                {visibleRows.map((row, index) =>
                  isValidElement<{ last?: boolean }>(row)
                    ? cloneElement(row, { last: index === visibleRows.length - 1 })
                    : row
                )}
              </View>
            )}
          </View>
        );
      })}

      {context && <DeleteAccountSection isOwner={isOwner} />}
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
  content: { padding: 16, gap: 24, paddingBottom: 32 },
  section: { gap: 10 },
  sectionHeader: { gap: 2, paddingHorizontal: 4 },
  sectionTitle: { fontFamily: fonts.display, fontSize: 20, textTransform: "uppercase", color: colors.foreground },
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
