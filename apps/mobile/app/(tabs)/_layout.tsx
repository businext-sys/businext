import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAccessContext } from "@businext/shared-core/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

type IconName = ComponentProps<typeof Ionicons>["name"];

function tabIcon(active: IconName, inactive: IconName) {
  function TabIcon({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) {
    return <Ionicons name={focused ? active : inactive} size={size} color={typeof color === "string" ? color : undefined} />;
  }
  return TabIcon;
}

/** Pestañas de la app: el asistente es el inicio y el resto, a un toque. */
export default function TabsLayout() {
  const { colors } = useTheme();
  const { context, capabilities } = useAccessContext();
  const canSeeCash = capabilities.canManageFinances && context?.role !== "employee";

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.foreground,
        headerTitleStyle: { fontFamily: fonts.bodyBold, fontSize: 17 },
        headerTitleAlign: "center",
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.foregroundSubtle,
        tabBarLabelStyle: { fontFamily: fonts.bodyBold, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Asistente",
          headerShown: false,
          tabBarIcon: tabIcon("chatbubble-ellipses", "chatbubble-ellipses-outline"),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          href: capabilities.canManageReservations ? undefined : null,
          tabBarIcon: tabIcon("calendar", "calendar-outline"),
        }}
      />
      <Tabs.Screen
        name="cash"
        options={{
          title: "Caja",
          href: canSeeCash ? undefined : null,
          tabBarIcon: tabIcon("wallet", "wallet-outline"),
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: "Tendencias",
          href: capabilities.canViewTrends ? undefined : null,
          tabBarIcon: tabIcon("trending-up", "trending-up-outline"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Ajustes", tabBarIcon: tabIcon("settings", "settings-outline") }}
      />
    </Tabs>
  );
}
