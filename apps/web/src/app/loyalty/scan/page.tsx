"use client";

import { useCallback, useRef } from "react";
import { Gift, Loader2, ScanLine, Stamp } from "lucide-react";
import { parseLoyaltyQr } from "@businext/shared-core/loyalty";
import { useGlobalToast } from "@/context/ToastContext";
import { useLoyaltyProgram, useLoyaltyScan } from "@/hooks/useLoyalty";
import { PageContainer, PageHeader } from "@/components/common/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { QrScanner } from "@/components/loyalty/QrScanner";
import { LoyaltyCardSummary } from "@/components/loyalty/LoyaltyCardSummary";

const RETRY_SAME_QR_MS = 4000;

export default function LoyaltyScanPage() {
  const { program, loading } = useLoyaltyProgram();

  return (
    <PageContainer className="max-w-xl">
      <PageHeader
        icon={ScanLine}
        title="Escanear tarjeta"
        description="Apunta la cámara al QR de la tarjeta de fidelidad del cliente"
      />
      {loading ? (
        <SectionSkeleton />
      ) : !program?.enabled ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<Stamp />}
              title="La tarjeta de fidelidad está desactivada"
              description="Actívala en Configuración › Reservas y clientes para sellar y canjear tarjetas."
            />
          </CardContent>
        </Card>
      ) : (
        <Scanner />
      )}
    </PageContainer>
  );
}

function Scanner() {
  const { showToast } = useGlobalToast();
  const { result, busy, error, notFound, scan, stamp, redeem, reset } = useLoyaltyScan();

  // La cámara lee el mismo QR varias veces por segundo: tras un fallo (p. ej.
  // una tarjeta de otro negocio) no se vuelve a pedir la misma hasta pasado un rato.
  const lastScan = useRef<{ token: string; at: number } | null>(null);
  const onScan = useCallback(
    (value: string) => {
      const token = parseLoyaltyQr(value);
      if (!token) return;
      const last = lastScan.current;
      if (last && last.token === token && Date.now() - last.at < RETRY_SAME_QR_MS) return;
      lastScan.current = { token, at: Date.now() };
      scan(token);
    },
    [scan]
  );

  const addStamp = async () => {
    const next = await stamp();
    if (next?.stampAdded) showToast("success", `Sello añadido a ${next.customerName}.`);
    else if (next) showToast("error", "Ya tenía el sello de hoy: no se ha añadido otro.");
  };

  const giveReward = async () => {
    const next = await redeem();
    if (next) showToast("success", `Premio canjeado: ${next.reward}.`);
  };

  if (!result) {
    return (
      <div className="space-y-4">
        <QrScanner onScan={onScan} paused={busy !== null} />
        {busy === "scan" && (
          <p className="flex items-center gap-2 text-body-sm text-foreground-muted">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Buscando la tarjeta...
          </p>
        )}
        {error && (
          <p className="text-body-sm text-danger" role="alert">
            {notFound ? "Esta tarjeta no es de tu negocio o ya no existe." : error}
          </p>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <LoyaltyCardSummary card={result}>
          {result.stampedToday && (
            <p className="text-caption text-foreground-muted">Ya tiene el sello de hoy.</p>
          )}
        </LoyaltyCardSummary>
        {error && (
          <p className="text-body-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={addStamp}
            loading={busy === "stamp"}
            disabled={busy !== null || result.stampedToday}
          >
            {busy !== "stamp" && <Stamp className="h-4 w-4" />}
            Añadir sello
          </Button>
          <Button
            className="flex-1"
            onClick={giveReward}
            loading={busy === "redeem"}
            disabled={busy !== null || !result.rewardReady}
          >
            {busy !== "redeem" && <Gift className="h-4 w-4" />}
            Canjear
          </Button>
        </div>
        <div className="flex border-t border-border-subtle pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              lastScan.current = null;
              reset();
            }}
          >
            <ScanLine className="h-4 w-4" />
            Escanear otra
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
