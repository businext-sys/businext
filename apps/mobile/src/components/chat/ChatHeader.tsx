import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

export type ChatMenuItem = { label: string; onPress: () => void; destructive?: boolean };

export function ChatHeader({ menuItems }: { menuItems: ChatMenuItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.header}>
      <Text style={styles.title} accessibilityRole="header">
        Businext
      </Text>
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

const styles = StyleSheet.create({
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.foreground,
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
    backgroundColor: "rgba(12, 17, 23, 0.6)",
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
});
