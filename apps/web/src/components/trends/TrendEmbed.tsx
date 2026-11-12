"use client";

import { useEffect, useRef, useState } from "react";
import type { TrendItem } from "@businext/shared-core/trends";
import { NETWORK_LABELS, NetworkIcon } from "@/components/trends/NetworkIcon";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const NETWORK_SURFACE: Record<TrendItem["network"], string> = {
  instagram: "bg-gradient-to-b from-instagram-orange via-instagram-pink to-instagram-purple",
  tiktok: "bg-tiktok-black",
};

/** URL del reproductor oficial de la red para el vídeo, o `null` si el enlace no es de un vídeo. */
export function trendEmbedUrl(url: string): string | null {
  const tiktok = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
  if (tiktok) return `https://www.tiktok.com/embed/v2/${tiktok[1]}`;
  const instagram = url.match(/instagram\.com\/(?:[\w.]+\/)?(reels?|p|tv)\/([\w-]+)/);
  if (instagram) {
    return `https://www.instagram.com/${instagram[1] === "p" ? "p" : "reel"}/${instagram[2]}/embed`;
  }
  return null;
}

const READY_MESSAGES = ["MOUNTED", "onPlayerReady"];
const FAILED_MESSAGES = ["onError", "onPlayerError"];
const READY_TIMEOUT_MS = 2500;

function messageType(data: unknown): string | undefined {
  try {
    return (typeof data === "string" ? JSON.parse(data) : data)?.type;
  } catch {
    return undefined;
  }
}

/** Reproductor oficial de la red. Solo se muestra cuando el propio reproductor avisa de que tiene el vídeo. */
export function TrendPlayer({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [loaded, setLoaded] = useState(false);
  const src = trendEmbedUrl(url);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      const type = messageType(event.data);
      if (!type) return;
      if (FAILED_MESSAGES.includes(type)) setStatus("failed");
      else if (READY_MESSAGES.includes(type)) setStatus((current) => (current === "failed" ? current : "ready"));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // TikTok avisa de sus errores nada más cargar; si no llega ninguno, el vídeo está.
  const tiktokLoaded = loaded && src?.includes("tiktok.com");
  useEffect(() => {
    if (!tiktokLoaded) return;
    const timer = window.setTimeout(
      () => setStatus((current) => (current === "loading" ? "ready" : current)),
      READY_TIMEOUT_MS
    );
    return () => window.clearTimeout(timer);
  }, [tiktokLoaded]);

  if (!src || status === "failed") return null;

  return (
    <iframe
      ref={frame}
      src={src}
      title={title}
      loading="lazy"
      allow="encrypted-media; fullscreen; picture-in-picture"
      onLoad={() => setLoaded(true)}
      className={cn(
        "absolute inset-0 h-full w-full border-0 transition-opacity duration-500",
        status === "ready" ? "opacity-100" : "pointer-events-none opacity-0",
        className
      )}
    />
  );
}

/** Vista previa del vídeo de una tendencia; debajo queda la tarjeta de la red, que es lo que se ve si el vídeo no carga. */
export function TrendEmbed({ trend }: { trend: TrendItem }) {
  const network = NETWORK_LABELS[trend.network];

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-xl">
      <a
        href={trend.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-5 p-4 text-brand-foreground",
          NETWORK_SURFACE[trend.network]
        )}
      >
        <NetworkIcon network={trend.network} mono={trend.network === "instagram"} className="h-20 w-20" />
        <span className="flex min-h-11 items-center gap-1.5 rounded-full border border-brand-foreground/40 px-4 text-label font-medium">
          Ver en {network}
          <ExternalLink className="h-4 w-4" />
        </span>
      </a>
      <TrendPlayer url={trend.url} title={`${trend.title} (${network})`} />
    </div>
  );
}
