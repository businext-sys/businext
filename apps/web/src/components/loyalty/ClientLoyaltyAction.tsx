"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, Loader2, Mail, ScanLine, Stamp } from "lucide-react";
import { LoyaltyError } from "@businext/shared-core/api";
import type { ClientProfile } from "@/lib/intelligence/types";
import { useGlobalToast } from "@/context/ToastContext";
import { useLoyaltyCard, useLoyaltyProgram } from "@/hooks/useLoyalty";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "@/components/ui/modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { LoyaltyCardSummary } from "@/components/loyalty/LoyaltyCardSummary";

const errorText = (err: unknown, fallback: string) => {
  if (err instanceof LoyaltyError && err.status === 503) {
    return "Apple Wallet aún no está configurado en el servidor: no se puede enviar la tarjeta.";
  }
  return err instanceof Error ? err.message : fallback;
};

/** Botón «Tarjeta de fidelidad» de la ficha de un cliente. No se muestra si la tarjeta está desactivada. */
export function ClientLoyaltyAction({ client }: { client: ClientProfile }) {
  const { program } = useLoyaltyProgram();
  const [open, setOpen] = useState(false);

  if (!program?.enabled) return null;

  return (
    <>
      <Button variant="secondary" size="sm" className="mt-2" onClick={() => setOpen(true)}>
        <Stamp className="h-3.5 w-3.5" />
        Tarjeta de fidelidad
      </Button>
      {open && <ClientLoyaltyModal client={client} onClose={() => setOpen(false)} />}
    </>
  );
}

function ClientLoyaltyModal({ client, onClose }: { client: ClientProfile; onClose: () => void }) {
  const { showToast } = useGlobalToast();
  const { card, loading, error, redeem, sendPass } = useLoyaltyCard({
    email: client.customerEmail,
    name: client.customerName,
  });
  const [busy, setBusy] = useState<"redeem" | "send" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const run = async (action: "redeem" | "send") => {
    setBusy(action);
    setActionError(null);
    try {
      if (action === "redeem") {
        const updated = await redeem();
        showToast("success", `Premio canjeado: ${updated.reward}.`);
      } else {
        const sent = await sendPass();
        showToast("success", `Tarjeta enviada a ${sent.sentTo}.`);
      }
    } catch (err) {
      setActionError(
        errorText(err, action === "redeem" ? "No se pudo canjear el premio" : "No se pudo reenviar la tarjeta")
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <ModalHeader onClose={onClose}>Tarjeta de {client.customerName}</ModalHeader>
      <ModalContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-body-sm text-foreground-muted">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Cargando la tarjeta...
          </div>
        ) : error ? (
          <p className="text-body-sm text-danger">No se pudo cargar la tarjeta. Inténtalo de nuevo.</p>
        ) : !card ? (
          <p className="text-body-sm text-foreground-muted">
            {client.customerName} aún no tiene tarjeta. Se crea sola cuando completa una reserva
            con su email.
          </p>
        ) : (
          <LoyaltyCardSummary card={card}>
            <p className="text-caption text-foreground-muted">
              Para sumar un sello a una visita sin reserva, escanea el QR de su tarjeta.
            </p>
          </LoyaltyCardSummary>
        )}
        {actionError && <p className="text-body-sm text-danger">{actionError}</p>}
      </ModalContent>
      {card && (
        <ModalFooter className="flex-wrap">
          <Button variant="ghost" onClick={() => run("send")} loading={busy === "send"} disabled={busy !== null}>
            {busy !== "send" && <Mail className="h-4 w-4" />}
            Reenviar tarjeta
          </Button>
          <Link href="/loyalty/scan" className={buttonVariants({ variant: "secondary" })}>
            <ScanLine className="h-4 w-4" />
            Añadir sello
          </Link>
          <Button
            onClick={() => run("redeem")}
            loading={busy === "redeem"}
            disabled={busy !== null || !card.rewardReady}
          >
            {busy !== "redeem" && <Gift className="h-4 w-4" />}
            Canjear
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}
