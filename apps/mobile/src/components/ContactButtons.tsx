import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { contact } from "@/lib/links";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

type IconName = ComponentProps<typeof Ionicons>["name"];

/** Llamar, WhatsApp y email al cliente: solo los que tienen dato. */
export function ContactButtons({ phone, email }: { phone?: string | null; email?: string | null }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const items: { icon: IconName; label: string; onPress: () => void }[] = [];
  if (phone) {
    items.push({ icon: "call", label: "Llamar", onPress: () => contact.call(phone) });
    items.push({ icon: "logo-whatsapp", label: "WhatsApp", onPress: () => contact.whatsapp(phone) });
  }
  if (email) items.push({ icon: "mail", label: "Email", onPress: () => contact.email(email) });
  if (items.length === 0) return null;

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <Pressable
          key={item.label}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={item.onPress}
          accessibilityRole="button"
          accessibilityLabel={item.label}
        >
          <Ionicons name={item.icon} size={22} color={colors.primary} />
          <Text style={styles.label}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  row: { flexDirection: "row", gap: 8 },
  button: {
    flex: 1,
    minHeight: 64,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  pressed: { opacity: 0.7 },
  label: { fontSize: 12, fontWeight: "600", color: colors.foreground },
}));
