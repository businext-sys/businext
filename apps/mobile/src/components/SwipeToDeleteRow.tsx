import { useState, type ReactNode } from "react";
import { Animated, PanResponder, Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

const ACTION_WIDTH = 88;

/** Fila que se desliza a la izquierda para enseñar el botón de borrar. */
export function SwipeToDeleteRow({
  children,
  onDelete,
  deleteLabel,
}: {
  children: ReactNode;
  onDelete: () => void;
  deleteLabel: string;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [{ translateX, responder, snap }] = useState(() => {
    const value = new Animated.Value(0);
    let open = false;
    const snapTo = (next: boolean) => {
      open = next;
      Animated.spring(value, { toValue: next ? -ACTION_WIDTH : 0, useNativeDriver: true, bounciness: 0 }).start();
    };
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => {
        const base = open ? -ACTION_WIDTH : 0;
        value.setValue(Math.max(-ACTION_WIDTH * 1.2, Math.min(0, base + g.dx)));
      },
      onPanResponderRelease: (_, g) => snapTo((open ? -ACTION_WIDTH : 0) + g.dx < -ACTION_WIDTH / 2),
      onPanResponderTerminate: () => snapTo(open),
    });
    return { translateX: value, responder: panResponder, snap: snapTo };
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.action}
        onPress={() => {
          snap(false);
          onDelete();
        }}
        accessibilityRole="button"
        accessibilityLabel={deleteLabel}
      >
        <Ionicons name="trash-outline" size={22} color={colors.dangerForeground} />
      </Pressable>
      <Animated.View style={[styles.front, { transform: [{ translateX }] }]} {...responder.panHandlers}>
        {children}
      </Animated.View>
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  container: { backgroundColor: colors.danger },
  action: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  front: { backgroundColor: colors.background },
}));
