"use client";

import React, { useState } from "react";
import { BellRing } from "lucide-react";
import { useRemindersSetting } from "@/hooks/useRemindersSetting";
import { useGlobalToast } from "@/context/ToastContext";
import { SectionSkeleton } from "@/components/common/SkeletonLoader";
import { SettingRow, SettingsCard } from "@/components/configuration/SettingsCard";
import { Switch } from "@/components/ui/switch";

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
    <SettingsCard
      id="reminders"
      icon={BellRing}
      title="Recordatorios"
      description="Menos clientes que se olvidan de su cita."
    >
      {error || !setting ? (
        <p className="text-body-sm text-danger">
          No se pudo cargar el ajuste de recordatorios.
        </p>
      ) : (
        <SettingRow
          title="Recordar la cita el día antes"
          hint="Va por email: solo lo reciben las reservas con email de contacto."
          control={
            <Switch
              checked={setting.remindersEnabled}
              onChange={toggle}
              disabled={saving}
              label="Recordar la cita el día antes"
            />
          }
        />
      )}
    </SettingsCard>
  );
}
