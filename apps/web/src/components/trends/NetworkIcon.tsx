import { useId } from "react";
import type { SocialNetwork } from "@businext/shared-core/trends";

export const NETWORK_LABELS: Record<SocialNetwork, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
};

const TIKTOK_NOTE =
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";

const INSTAGRAM_STOPS = ["yellow", "orange", "pink", "purple", "blue"];

/** Logo de la red con sus colores de marca; `mono` lo deja en el color del texto, para ir sobre un fondo de marca. */
export function NetworkIcon({
  network,
  className,
  mono = false,
}: {
  network: SocialNetwork;
  className?: string;
  mono?: boolean;
}) {
  const gradientId = useId();

  if (network === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <g transform="translate(1.5 1.5) scale(0.875)">
          {!mono && (
            <>
              <path d={TIKTOK_NOTE} transform="translate(-1.1 -1.1)" className="fill-tiktok-cyan" />
              <path d={TIKTOK_NOTE} transform="translate(1.1 1.1)" className="fill-tiktok-red" />
            </>
          )}
          <path d={TIKTOK_NOTE} fill="currentColor" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {!mono && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            {INSTAGRAM_STOPS.map((stop, index) => (
              <stop
                key={stop}
                offset={index / (INSTAGRAM_STOPS.length - 1)}
                stopColor={`var(--color-instagram-${stop})`}
              />
            ))}
          </linearGradient>
        </defs>
      )}
      <g
        fill="none"
        stroke={mono ? "currentColor" : `url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </g>
    </svg>
  );
}
