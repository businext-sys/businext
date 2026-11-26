"use client";

import { useState } from "react";
import { CreditCard, UserCircle } from "lucide-react";
import type { SettingsBlockId } from "@businext/shared-core/services";
import { useAccessContext } from "@/hooks/useAccessContext";
import { useGlobalToast } from "@/context/ToastContext";
import { cancelUserSubscription } from "@/app/actions/cancelSubscription";
import { AppearanceSection } from "@/components/configuration/AppearanceSection";
import { MoreOptions, SettingsCard } from "@/components/configuration/SettingsCard";
import { ReadOnlyField } from "@/components/configuration/sections/BusinessSection";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { InitialsAvatar } from "@/components/common/InitialsAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ROLE_LABELS: Record<string, string> = {
  owner: "Dueño",
  manager: "Encargado",
  employee: "Empleado",
};

/** «Cuenta y plan»: tus datos, la apariencia y la suscripción. */
export function AccountSection({ blocks }: { blocks: SettingsBlockId[] }) {
  return (
    <>
      {blocks.includes("profile") && <ProfileCard />}
      {blocks.includes("appearance") && (
        <div id="bloque-appearance" className="scroll-mt-24">
          <AppearanceSection />
        </div>
      )}
      {blocks.includes("subscription") && <SubscriptionCard />}
    </>
  );
}

function ProfileCard() {
  const { context } = useAccessContext();
  const profile = context?.profile;
  const name = profile?.displayName || profile?.email || "";
  return (
    <SettingsCard id="profile" icon={UserCircle} title="Tus datos" description="Con los que entras en Businext.">
      <div className="flex items-center gap-3">
        <InitialsAvatar name={name} className="h-14 w-14 bg-surface-raised font-heading text-h4" />
        <div className="min-w-0">
          <p className="truncate text-body font-semibold text-foreground">{name || "Sin nombre"}</p>
          <Badge variant="muted">{ROLE_LABELS[context?.role ?? ""] ?? "Empleado"}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <ReadOnlyField label="Nombre" value={profile?.displayName} />
        <ReadOnlyField label="Email" value={profile?.email} breakAll />
        <ReadOnlyField label="Teléfono" value={profile?.phone} />
      </div>
    </SettingsCard>
  );
}

function SubscriptionCard() {
  const { showToast } = useGlobalToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const cancel = async () => {
    setConfirmOpen(false);
    try {
      await cancelUserSubscription();
      showToast("success", "Suscripción cancelada. Sigues teniendo acceso hasta el final del periodo.");
    } catch (err) {
      showToast(
        "error",
        "No se pudo cancelar la suscripción: " + (err instanceof Error ? err.message : "inténtalo de nuevo")
      );
    }
  };

  return (
    <SettingsCard
      id="subscription"
      icon={CreditCard}
      title="Suscripción"
      description="Tu plan de Businext. Si tienes dudas con el cobro, escríbenos desde el botón de ayuda del menú."
    >
      <MoreOptions label="Cancelar la suscripción">
        <p className="text-body-sm text-foreground-muted">
          Sigues teniendo acceso hasta el final del periodo que ya has pagado. Después, tu equipo y
          tú dejáis de poder entrar.
        </p>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Cancelar suscripción
        </Button>
      </MoreOptions>
      <ConfirmDialog
        open={confirmOpen}
        title="¿Cancelar la suscripción?"
        description="Seguirás teniendo acceso hasta el final del periodo actual."
        destructive
        onConfirm={cancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </SettingsCard>
  );
}
