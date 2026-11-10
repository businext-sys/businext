"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import {
  CustomerMessageError,
  customerMessageApi,
} from "@businext/shared-core/api";
import type { ClientProfile } from "@/lib/intelligence/types";
import { useGlobalToast } from "@/context/ToastContext";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const MAX_LENGTH = 2000;

export function CustomerMessageAction({ client }: { client: ClientProfile }) {
  const { showToast } = useGlobalToast();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!client.customerEmail) {
    return (
      <p className="text-caption text-foreground-muted mt-1">
        Falta su email para escribirle: añádelo en su próxima reserva.
      </p>
    );
  }
  const email = client.customerEmail;

  const openModal = async () => {
    setOpen(true);
    setError(null);
    setLoadingDraft(true);
    try {
      const draft = await customerMessageApi.getDraft(email);
      setMessage(draft.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo preparar el mensaje");
    } finally {
      setLoadingDraft(false);
    }
  };

  const send = async () => {
    setSending(true);
    setError(null);
    try {
      await customerMessageApi.send(email, message.trim());
      showToast("success", `Mensaje enviado a ${client.customerName}.`);
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof CustomerMessageError && err.status === 429
          ? `Ya le escribiste a ${client.customerName} esta semana. Podrás volver a escribirle pasados 7 días.`
          : err instanceof Error
            ? err.message
            : "No se pudo enviar el mensaje"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button variant="secondary" size="sm" className="mt-2" onClick={openModal}>
        <Mail className="h-3.5 w-3.5" />
        Enviarle un mensaje
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader onClose={() => setOpen(false)}>
          Mensaje para {client.customerName}
        </ModalHeader>
        <ModalContent className="space-y-3">
          <p className="text-body-sm text-foreground-muted">
            Le llegará por email a {email}. Cámbialo si quieres antes de enviarlo.
          </p>
          {loadingDraft ? (
            <div className="flex items-center gap-2 py-4 text-body-sm text-foreground-muted">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Preparando el mensaje...
            </div>
          ) : (
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              maxLength={MAX_LENGTH}
              aria-label="Mensaje"
              className="w-full bg-surface-raised border border-border-subtle rounded-xl p-4 text-body-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          )}
          {error && <p className="text-body-sm text-danger">{error}</p>}
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={send}
            loading={sending}
            disabled={loadingDraft || !message.trim()}
          >
            Enviar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
