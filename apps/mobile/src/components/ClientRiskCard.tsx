import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import {
  CustomerMessageError,
  customerMessageApi,
} from "@businext/shared-core/api";
import type { ClientProfile } from "@businext/shared-core/intelligence";
import { themedStyles, useTheme } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

const MAX_LENGTH = 2000;

type Status = { ok: boolean; text: string };

export function ClientRiskCard({ client }: { client: ClientProfile }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [message, setMessage] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const email = client.customerEmail;

  const openEditor = async () => {
    if (!email) return;
    setStatus(null);
    setLoadingDraft(true);
    try {
      const draft = await customerMessageApi.getDraft(email);
      setMessage(draft.message);
    } catch (err) {
      setStatus({ ok: false, text: err instanceof Error ? err.message : "No se pudo preparar el mensaje" });
    } finally {
      setLoadingDraft(false);
    }
  };

  const send = async () => {
    if (!email || !message?.trim()) return;
    setSending(true);
    setStatus(null);
    try {
      await customerMessageApi.send(email, message.trim());
      setMessage(null);
      setStatus({ ok: true, text: `Mensaje enviado a ${client.customerName}.` });
    } catch (err) {
      setStatus({
        ok: false,
        text:
          err instanceof CustomerMessageError && err.status === 429
            ? `Ya le escribiste a ${client.customerName} esta semana. Podrás volver a escribirle pasados 7 días.`
            : err instanceof Error
              ? err.message
              : "No se pudo enviar el mensaje",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{client.customerName}</Text>
      <Text style={styles.muted}>
        {client.visitCount} visitas · hace {client.daysSinceLastVisit} días que no viene
      </Text>

      {!email ? (
        <Text style={styles.muted}>Falta su email para escribirle: añádelo en su próxima reserva.</Text>
      ) : message === null ? (
        <Pressable
          style={styles.secondaryButton}
          onPress={openEditor}
          disabled={loadingDraft}
          accessibilityRole="button"
        >
          {loadingDraft ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.secondaryButtonText}>Enviarle un mensaje</Text>
          )}
        </Pressable>
      ) : (
        <>
          <Text style={styles.muted}>Le llegará por email a {email}.</Text>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={MAX_LENGTH}
            accessibilityLabel="Mensaje"
          />
          <View style={styles.actions}>
            <Pressable
              style={styles.ghostButton}
              onPress={() => setMessage(null)}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={styles.primaryButton}
              onPress={send}
              disabled={sending || !message.trim()}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>{sending ? "Enviando…" : "Enviar"}</Text>
            </Pressable>
          </View>
        </>
      )}

      {status && <Text style={status.ok ? styles.success : styles.error}>{status.text}</Text>}
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  card: { padding: 16, borderRadius: 8, backgroundColor: colors.surface, gap: 8 },
  name: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.foreground },
  muted: { fontFamily: fonts.body, fontSize: 14, color: colors.foregroundMuted },
  error: { fontFamily: fonts.body, fontSize: 14, color: colors.danger },
  success: { fontFamily: fonts.body, fontSize: 14, color: colors.success },
  input: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.foreground,
    backgroundColor: colors.surface,
    textAlignVertical: "top",
  },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  primaryButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.primaryForeground },
  secondaryButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.foreground },
}));
