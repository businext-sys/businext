"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Building2 } from "lucide-react";
import type { SettingsBlockId } from "@businext/shared-core/services";
import { useConfiguration } from "@/hooks/useConfiguration";
import { useGlobalToast } from "@/context/ToastContext";
import { Configuration } from "@/lib/configuration/types";
import { LocationsSection } from "@/components/configuration/LocationsSection";
import { SettingsCard } from "@/components/configuration/SettingsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LABEL = "text-label font-semibold text-foreground-muted";

/** «Tu negocio»: nombre y contacto (solo el owner los cambia) y locales. */
export function BusinessSection({
  blocks,
  canEdit,
}: {
  blocks: SettingsBlockId[];
  canEdit: boolean;
}) {
  return (
    <>
      {blocks.includes("businessInfo") && <BusinessInfoCard canEdit={canEdit} />}
      {blocks.includes("locations") && (
        <Card id="bloque-locations" className="scroll-mt-24">
          <CardContent className="p-5 sm:p-6 md:p-8">
            <LocationsSection />
          </CardContent>
        </Card>
      )}
    </>
  );
}

function BusinessInfoCard({ canEdit }: { canEdit: boolean }) {
  const { updateConfiguration, createConfiguration, configurationData } = useConfiguration();
  const { showToast } = useGlobalToast();
  const current = configurationData[0];
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<Configuration>({
    defaultValues: { businessName: "", businessPhone: "", businessEmail: "" },
  });

  useEffect(() => {
    if (current) {
      reset({
        businessName: current.businessName || "",
        businessPhone: current.businessPhone || "",
        businessEmail: current.businessEmail || "",
      });
    }
  }, [current, reset]);

  const onSubmit: SubmitHandler<Configuration> = async (data) => {
    // Se reenvian las comisiones para no pisarlas al guardar el contacto.
    const payload: Omit<Configuration, "id"> = {
      businessName: data.businessName,
      businessPhone: data.businessPhone,
      businessEmail: data.businessEmail,
      commissionProduct: current?.commissionProduct,
      commissionService: current?.commissionService,
    };
    const result = current
      ? await updateConfiguration({ id: current.id, ...payload })
      : await createConfiguration(payload);
    if (result !== null) {
      showToast("success", "Datos del negocio guardados.");
      reset(data);
    } else {
      showToast("error", "No se pudieron guardar los datos. Intenta de nuevo.");
    }
  };

  return (
    <SettingsCard
      id="businessInfo"
      icon={Building2}
      title="Datos del negocio"
      description="Así te ven tus clientes en la página de reservas, los emails y el asistente."
    >
      {canEdit ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="businessName" className={LABEL}>
              Nombre del negocio
            </label>
            <Input id="businessName" {...register("businessName")} placeholder="Barbería Centro" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="businessPhone" className={LABEL}>
                Teléfono
              </label>
              <Input
                id="businessPhone"
                {...register("businessPhone")}
                type="tel"
                placeholder="+34 612 345 678"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="businessEmail" className={LABEL}>
                Email
              </label>
              <Input
                id="businessEmail"
                {...register("businessEmail")}
                type="email"
                placeholder="contacto@tunegocio.com"
              />
            </div>
          </div>
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={!isDirty}>
            Guardar
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <ReadOnlyField label="Nombre del negocio" value={current?.businessName} />
          <p className="rounded-md bg-muted px-4 py-3 text-body-sm text-muted-foreground">
            Solo el dueño del negocio puede cambiar estos datos.
          </p>
        </div>
      )}
    </SettingsCard>
  );
}

export function ReadOnlyField({
  label,
  value,
  fallback = "Sin indicar",
  breakAll,
}: {
  label: string;
  value?: string | null;
  fallback?: string;
  breakAll?: boolean;
}) {
  return (
    <div className="space-y-1">
      <span className="block text-caption font-semibold uppercase tracking-wide text-foreground-subtle">
        {label}
      </span>
      <span className={`block text-body font-medium text-foreground ${breakAll ? "break-all" : ""}`}>
        {value || <span className="italic text-foreground-subtle">{fallback}</span>}
      </span>
    </div>
  );
}
