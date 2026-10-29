"use client";

import React, { useState } from "react";
import { PhoneCall } from "lucide-react";
import type {
  VoiceAgentBookingMode,
  VoiceAgentConfigUpdate,
} from "@businext/shared-core";
import { useVoiceAgentConfig } from "@/hooks/useVoiceAgentConfig";
import { useGlobalToast } from "@/context/ToastContext";
import { SectionSkeleton } from "@/components/common/SkeletonLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BOOKING_MODES: {
  value: VoiceAgentBookingMode;
  label: string;
  description: string;
}[] = [
  {
    value: "request",
    label: "Crear una solicitud",
    description:
      "La cita queda pendiente hasta que la aceptes desde Solicitudes, como en la reserva online.",
  },
  {
    value: "confirm",
    label: "Confirmar directamente",
    description:
      "La cita entra en tu agenda al momento si la hora está libre, y el cliente recibe la confirmación.",
  },
];

/**
 * Configuracion del agente de voz (issue #118), en la pestaña «Agente de voz»:
 * numeros asignados, activarlo o desactivarlo y el modo de reserva. Solo para
 * owners: el backend (`/voice-agent/config`) rechaza al resto con 403.
 */
export function VoiceAgentSettings() {
  const { config, loading, error, updateVoiceAgentConfig } =
    useVoiceAgentConfig();
  const { showToast } = useGlobalToast();
  const [saving, setSaving] = useState(false);

  const save = async (update: VoiceAgentConfigUpdate, message: string) => {
    setSaving(true);
    const result = await updateVoiceAgentConfig(update);
    setSaving(false);
    if (result) showToast("success", message);
    else showToast("error", "No se pudo guardar la configuración del agente.");
  };

  if (loading) return <SectionSkeleton />;

  return (
    <Card>
      <CardContent className="p-5 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-md">
            <PhoneCall className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-h4 font-semibold text-foreground">
              Agente de voz
            </h2>
            <p className="text-body-sm text-foreground-muted">
              Un asistente atiende las llamadas a tu número: informa de
              servicios, locales y disponibilidad, y reserva citas.
            </p>
          </div>
        </div>

        {error || !config ? (
          <p className="text-body-sm text-danger">
            No se pudo cargar la configuración del agente de voz.
          </p>
        ) : (
          <>
            {/* Numero */}
            <div className="space-y-2">
              <label className="text-label font-semibold text-foreground-muted">
                Número de teléfono
              </label>
              {config.phoneNumbers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {config.phoneNumbers.map((number) => (
                    <span
                      key={number}
                      className="rounded-md border border-border-subtle bg-surface px-3 py-1.5 font-mono text-body-sm text-foreground"
                    >
                      {number}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-body-sm text-foreground-muted">
                  Aún no tienes un número asignado. Lo asigna Businext:
                  escríbenos y te lo activamos.
                </p>
              )}
            </div>

            {/* Activado */}
            <div className="flex flex-col gap-3 rounded-lg border border-border-subtle p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-body font-semibold text-foreground">
                    Estado
                  </span>
                  <Badge variant={config.enabled ? "success" : "muted"}>
                    {config.enabled ? "Activado" : "Desactivado"}
                  </Badge>
                </div>
                <p className="text-caption text-foreground-subtle">
                  {config.enabled
                    ? "El agente contesta las llamadas a tu número."
                    : "Las llamadas a tu número se rechazan."}
                </p>
              </div>
              <Button
                variant={config.enabled ? "secondary" : "primary"}
                size="sm"
                disabled={saving}
                onClick={() =>
                  save(
                    { enabled: !config.enabled },
                    config.enabled
                      ? "Agente de voz desactivado."
                      : "Agente de voz activado."
                  )
                }
              >
                {config.enabled ? "Desactivar" : "Activar"}
              </Button>
            </div>

            {/* Modo de reserva */}
            <fieldset className="space-y-2" disabled={saving}>
              <legend className="mb-2 text-label font-semibold text-foreground-muted">
                Cuando un cliente reserva por teléfono
              </legend>
              {BOOKING_MODES.map((mode) => {
                const selected = config.bookingMode === mode.value;
                return (
                  <label
                    key={mode.value}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border-subtle hover:border-primary/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="voice-agent-booking-mode"
                      value={mode.value}
                      checked={selected}
                      onChange={() =>
                        save(
                          { bookingMode: mode.value },
                          "Modo de reserva actualizado."
                        )
                      }
                      className="mt-1 accent-primary"
                    />
                    <span className="space-y-1">
                      <span className="block text-body font-semibold text-foreground">
                        {mode.label}
                      </span>
                      <span className="block text-caption text-foreground-subtle">
                        {mode.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </>
        )}
      </CardContent>
    </Card>
  );
}
