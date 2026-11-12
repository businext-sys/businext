import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { accountApi } from "@businext/shared-core/api";
import { useAuth } from "@/context/AuthContext";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

export function DeleteAccountSection({ isOwner }: { isOwner: boolean }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { logout } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const consequence = isOwner
    ? "Se cancelará tu suscripción y se borrarán tu negocio y todos sus datos: reservas, clientes, productos, finanzas y equipo. Tus empleados perderán el acceso."
    : "Se borrarán tu usuario y tu acceso al negocio. Los datos del negocio no se tocan.";

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await accountApi.deleteMe();
      await logout();
    } catch {
      setDeleting(false);
      Alert.alert("No se ha podido borrar la cuenta", "Inténtalo de nuevo en unos minutos.");
    }
  };

  const confirm = () =>
    Alert.alert("Borrar cuenta", `${consequence} No se puede deshacer.`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar cuenta", style: "destructive", onPress: deleteAccount },
    ]);

  return (
    <View style={styles.section}>
      <Text style={styles.label}>Borrar cuenta</Text>
      <Text style={styles.hint}>{consequence}</Text>
      <Pressable
        style={styles.button}
        onPress={confirm}
        disabled={deleting}
        accessibilityRole="button"
      >
        {deleting ? (
          <ActivityIndicator color={colors.danger} />
        ) : (
          <Text style={styles.buttonText}>Borrar cuenta</Text>
        )}
      </Pressable>
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  section: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    gap: 8,
  },
  label: { fontSize: 12, color: colors.foregroundSubtle },
  hint: { fontSize: 15, color: colors.foregroundMuted },
  button: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  buttonText: { fontSize: 15, fontWeight: "600", color: colors.danger },
}));
