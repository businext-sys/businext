"use client";

import { useEffect, useState } from "react";
import { Copy, Download, ExternalLink, Link2 } from "lucide-react";
import type { SettingsBlockId } from "@businext/shared-core/services";
import { useGlobalToast } from "@/context/ToastContext";
import { RemindersSection } from "@/components/configuration/RemindersSection";
import { LoyaltySection } from "@/components/configuration/LoyaltySection";
import { MoreOptions, SettingsCard } from "@/components/configuration/SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** «Reservas y clientes»: enlace de reservas, recordatorios y tarjeta de fidelidad. */
export function BookingsSection({
  blocks,
  businessId,
  canEditLoyalty,
}: {
  blocks: SettingsBlockId[];
  businessId: string;
  canEditLoyalty: boolean;
}) {
  return (
    <>
      {blocks.includes("bookingLink") && businessId && <BookingLinkCard businessId={businessId} />}
      {blocks.includes("reminders") && <RemindersSection />}
      {blocks.includes("loyalty") && <LoyaltySection canEdit={canEditLoyalty} />}
    </>
  );
}

function BookingLinkCard({ businessId }: { businessId: string }) {
  const { showToast } = useGlobalToast();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [bookingUrl, setBookingUrl] = useState("");

  useEffect(() => {
    setBookingUrl(`${window.location.origin}/book/${businessId}`);
  }, [businessId]);

  useEffect(() => {
    if (!bookingUrl) return;
    import("qrcode").then((QRCode) =>
      QRCode.toDataURL(bookingUrl, { width: 600, margin: 2 }).then(setQrDataUrl)
    );
  }, [bookingUrl]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      showToast("success", "Enlace copiado.");
    } catch {
      showToast("error", "No se pudo copiar el enlace.");
    }
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = "reserva-qr.png";
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <SettingsCard
      id="bookingLink"
      icon={Link2}
      title="Tu enlace de reservas"
      description="Ponlo en Instagram, en Google o en WhatsApp: tus clientes piden cita solos y tú la aceptas."
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={bookingUrl}
          readOnly
          aria-label="Enlace de reservas"
          className="flex-1 font-mono text-caption"
        />
        <div className="flex gap-2">
          <Button variant="primary" onClick={copy}>
            <Copy className="h-4 w-4" />
            Copiar
          </Button>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-4 text-body-sm font-medium text-foreground transition-colors hover:bg-surface-raised"
          >
            Abrir
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <MoreOptions label="Código QR para el local y vista previa">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center">
          <div className="flex flex-col items-center gap-3">
            {/* La imagen trae su propio margen blanco: se lee igual en modo oscuro. */}
            <div className="overflow-hidden rounded-lg">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="Código QR de tu enlace de reservas" className="h-48 w-48" />
              ) : (
                <div className="h-48 w-48 animate-pulse rounded bg-muted" />
              )}
            </div>
            <Button variant="secondary" onClick={downloadQr} disabled={!qrDataUrl}>
              <Download className="h-4 w-4" />
              Descargar QR
            </Button>
            <p className="max-w-xs text-center text-caption text-foreground-subtle">
              Imprímelo y ponlo en el espejo o en la caja: escanean y reservan.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-label font-semibold text-foreground-muted">Así la ven tus clientes</p>
            <div className="h-[420px] w-[300px] overflow-hidden rounded-lg border border-border bg-background">
              {bookingUrl && (
                <iframe
                  src={bookingUrl}
                  title="Vista previa de la página de reserva"
                  loading="lazy"
                  tabIndex={-1}
                  className="pointer-events-none h-[560px] w-[400px] origin-top-left scale-75"
                />
              )}
            </div>
          </div>
        </div>
      </MoreOptions>
    </SettingsCard>
  );
}
