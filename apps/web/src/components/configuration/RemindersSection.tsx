"use client";

import React, { useState } from "react";
import { BellRing } from "lucide-react";
import { useRemindersSetting } from "@/hooks/useRemindersSetting";
import { useGlobalToast } from "@/context/ToastContext";
import { SectionSkeleton } from "@/components/common/SkeletonLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RemindersSection() {
  const { setting, loading, error, updateRemindersSetting } = useRemindersSetting();
  const { showToast } = useGlobalToast();
  const [saving, setSaving] = useState(false);

  const toggle = async (remindersEnabled: boolean) => {
    setSaving(true);
    const result = await updateRemindersSetting({ remindersEnabled });
    setSaving(false);
    if (result) {
      showToast(
        "success",
        remindersEnabled ? "Recordatorios activados." : "Recordatorios desactivados."
      );
    } else {
      showToast("error", "No se pudo guardar el ajuste de recordatorios.");
    }
  };

  if (loading) return <SectionSkeleton />;

  return (
    <Card>
      <CardContent className="p-5 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-md">
            <BellRing className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-h4 font-semibold text-foreground">
              Recordatorios
            </h2>
            <p className="text-body-sm text-foreground-muted">
              Avisos automáticos a tus clientes antes de su cita.
            </p>
          </div>
        </div>

        {error || !setting ? (
          <p className="text-body-sm text-danger">
            No se pudo cargar el ajuste de recordatorios.
          </p>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg border border-border-subtle p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-body font-semibold text-foreground">
                  Recordar la cita al cliente el día antes
                </span>
                <Badge variant={setting.remindersEnabled ? "success" : "muted"}>
                  {setting.remindersEnabled ? "Activado" : "Desactivado"}
                </Badge>
              </div>
              <p className="text-caption text-foreground-subtle">
                El aviso se envía por email, así que solo lo reciben las reservas
                que tienen un email de contacto.
              </p>
            </div>
            <Button
              variant={setting.remindersEnabled ? "secondary" : "primary"}
              size="sm"
              disabled={saving}
              onClick={() => toggle(!setting.remindersEnabled)}
            >
              {setting.remindersEnabled ? "Desactivar" : "Activar"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
