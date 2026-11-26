"use client";

import { useEffect, useRef, useState } from "react";
import { CameraOff, Loader2 } from "lucide-react";

type Detector = { detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]> };

const SCAN_INTERVAL_MS = 250;

/**
 * El `BarcodeDetector` nativo si el navegador lo tiene con QR (Chrome en
 * Android, Edge...); si no (Safari, Firefox), el de `barcode-detector`
 * (ZXing en WebAssembly), que se carga solo al abrir el escáner.
 */
async function createDetector(): Promise<Detector> {
  const native = (globalThis as { BarcodeDetector?: unknown }).BarcodeDetector as
    | (typeof import("barcode-detector/ponyfill"))["BarcodeDetector"]
    | undefined;
  if (native) {
    const formats: readonly string[] = await native.getSupportedFormats().catch(() => []);
    if (formats.includes("qr_code")) return new native({ formats: ["qr_code"] });
  }
  const { BarcodeDetector } = await import("barcode-detector/ponyfill");
  return new BarcodeDetector({ formats: ["qr_code"] });
}

function cameraError(err: unknown): string {
  const name = err instanceof DOMException ? err.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "No hay permiso para usar la cámara. Actívalo en los ajustes del navegador y vuelve a intentarlo.";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "Este dispositivo no tiene cámara.";
  }
  if (name === "NotReadableError") {
    return "La cámara está en uso por otra aplicación.";
  }
  return "No se pudo abrir la cámara.";
}

/**
 * Vista de la cámara trasera que llama a `onScan` con el texto de cada QR que
 * lee. Con `paused` deja de leer (p. ej. mientras se consulta la tarjeta) sin
 * cerrar la cámara.
 */
export function QrScanner({ onScan, paused = false }: { onScan: (value: string) => void; paused?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onScanRef = useRef(onScan);
  const pausedRef = useRef(paused);
  const [status, setStatus] = useState<"starting" | "ready" | "error">("starting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onScanRef.current = onScan;
    pausedRef.current = paused;
  }, [onScan, paused]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new DOMException("", "NotFoundError");
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        const detector = await createDetector();
        if (cancelled) return;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        setStatus("ready");

        const tick = async () => {
          if (cancelled) return;
          if (!pausedRef.current && video.readyState >= video.HAVE_CURRENT_DATA) {
            try {
              const codes = await detector.detect(video);
              const value = codes[0]?.rawValue;
              if (value && !cancelled) onScanRef.current(value);
            } catch {
              // Un fotograma que no se puede leer: se prueba con el siguiente.
            }
          }
          timer = setTimeout(tick, SCAN_INTERVAL_MS);
        };
        tick();
      } catch (err) {
        if (cancelled) return;
        setError(cameraError(err));
        setStatus("error");
      }
    };

    start();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-md bg-surface-raised">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        playsInline
        aria-label="Cámara para escanear el QR de la tarjeta"
      />
      {status === "ready" && (
        <div
          className="pointer-events-none absolute inset-[15%] rounded-lg border-2 border-primary"
          aria-hidden
        />
      )}
      {status === "starting" && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-body-sm text-foreground-muted">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Abriendo la cámara...
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <CameraOff className="h-6 w-6 text-foreground-subtle" aria-hidden />
          <p className="text-body-sm text-foreground-muted">{error}</p>
        </div>
      )}
    </div>
  );
}
