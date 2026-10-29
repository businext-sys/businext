import { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { themedStyles } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

export type ChatMenuItem = { label: string; onPress: () => void; destructive?: boolean };

export function ChatHeader({ menuItems }: { menuItems: ChatMenuItem[] }) {
  const styles = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.identity}>
        <Image
          source={require("../../../assets/avatar-asistente.png")}
          style={styles.avatar}
          accessibilityLabel="Avatar del asistente"
        />
        <View>
          <Text style={styles.title} accessibilityRole="header">
            Tu asistente
          </Text>
          <Text style={styles.subtitle}>Businext</Text>
        </View>
      </View>
      <Pressable
        style={styles.menuButton}
        onPress={() => setMenuOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Abrir menú"
        hitSlop={8}
        testID="chat-menu-button"
      >
        <Text style={styles.menuIcon}>⋯</Text>
      </Pressable>

      <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} accessibilityLabel="Cerrar menú">
          <View style={styles.menu}>
            {menuItems.map((item) => (
              <Pressable
                key={item.label}
                style={styles.menuItem}
                accessibilityRole="menuitem"
                onPress={() => {
                  setMenuOpen(false);
                  item.onPress();
                }}
              >
                <Text style={[styles.menuItemText, item.destructive && styles.destructive]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    textTransform: "uppercase",
    color: colors.foreground,
  },
  subtitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.secondary,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    fontSize: 24,
    color: colors.foreground,
  },
  backdrop: {
    flex: 1,
    backgroundColor: `${colors.background}99`,
    alignItems: "flex-end",
    paddingTop: 100,
    paddingHorizontal: 16,
  },
  menu: {
    minWidth: 220,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 4,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 15,
    color: colors.foreground,
  },
  destructive: {
    color: colors.danger,
  },
}));
