import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

/**
 * Pantalla de login con Supabase Auth (issue #029). Al login exitoso,
 * `AuthGate` (en app/_layout.tsx) redirige automaticamente a "/" al
 * detectar el cambio de estado a "authenticated" — esta pantalla no
 * navega manualmente.
 */
export default function LoginScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (submitting) return;
    if (!email.trim() || !password) {
      setError("Ingresa tu email y contraseña");
      return;
    }
    setError(null);
    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Businext</Text>
        <Text style={styles.subtitle}>Inicia sesion para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.foregroundSubtle}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!submitting}
          testID="login-email"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={colors.foregroundSubtle}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!submitting}
          testID="login-password"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          testID="login-submit"
        >
          {submitting ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={styles.buttonText}>Iniciar sesion</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    textTransform: "uppercase",
    textAlign: "center",
    color: colors.foreground,
  },
  subtitle: {
    fontSize: 14,
    color: colors.foregroundMuted,
    textAlign: "center",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.surface,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.primaryForeground,
    fontWeight: "700",
    fontSize: 16,
  },
}));
