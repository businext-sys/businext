import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { bookingRequestApi } from "@businext/shared-core/api";
import type { BookingRequestBlock } from "@businext/shared-core/assistant";
import { formatDayLabel, formatHour } from "@/lib/date";
import { useTheme } from "@/theme/ThemeContext";
import { useCardStyles } from "./cardStyles";

type Status = BookingRequestBlock["request"]["status"];

const STATUS_LABELS: Record<Status, string> = {
  REQUESTED: "Pendiente",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
  EXPIRED: "Caducada",
};

export function BookingRequestCard({ block }: { block: BookingRequestBlock }) {
  const cardStyles = useCardStyles();
  const { colors } = useTheme();
  const { request } = block;
  const [status, setStatus] = useState<Status>(request.status);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decide = async (accept: boolean) => {
    setSubmitting(true);
    setError(null);
    const ok = await (accept
      ? bookingRequestApi.accept(request.id)
      : bookingRequestApi.reject(request.id, undefined)
    ).catch(() => false);
    setSubmitting(false);
    if (ok) setStatus(accept ? "ACCEPTED" : "REJECTED");
    else setError("No se ha podido actualizar la solicitud. Inténtalo de nuevo.");
  };

  const when = `${formatDayLabel(new Date(request.requested_date))}, ${formatHour(request.requested_date)}`;

  return (
    <View style={cardStyles.card} testID="card-booking-request">
      <Text style={cardStyles.subtle}>Solicitud de reserva</Text>
      <Text style={cardStyles.title}>{request.client_name}</Text>
      <Text style={cardStyles.muted}>{request.service}</Text>
      <Text style={cardStyles.muted}>{when}</Text>
      {request.employee_name && <Text style={cardStyles.subtle}>Con {request.employee_name}</Text>}

      {status === "REQUESTED" ? (
        <View style={cardStyles.actions}>
          {submitting ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Pressable
                style={[cardStyles.button, cardStyles.secondaryButton]}
                onPress={() => decide(false)}
                accessibilityRole="button"
                accessibilityLabel={`Rechazar la solicitud de ${request.client_name}`}
                testID="booking-request-reject"
              >
                <Text style={cardStyles.secondaryButtonText}>Rechazar</Text>
              </Pressable>
              <Pressable
                style={[cardStyles.button, cardStyles.primaryButton]}
                onPress={() => decide(true)}
                accessibilityRole="button"
                accessibilityLabel={`Aceptar la solicitud de ${request.client_name}`}
                testID="booking-request-accept"
              >
                <Text style={cardStyles.primaryButtonText}>Aceptar</Text>
              </Pressable>
            </>
          )}
        </View>
      ) : (
        <View style={cardStyles.pill} accessibilityLiveRegion="polite">
          <Text style={cardStyles.pillText}>{STATUS_LABELS[status]}</Text>
        </View>
      )}
      {error && (
        <Text style={[cardStyles.muted, { color: colors.danger }]} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}
