import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const BUBBLE_STAGGER_MS = 180;

/** Lo que dice el asistente, con su cara: el avatar y sus burbujas de conversación. */
export function AssistantMessage({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny static avatar */}
      <img
        src="/avatar-asistente.jpg"
        alt="Tu asistente"
        width={48}
        height={48}
        className={cn(
          "shrink-0 rounded-full border-2 border-primary object-cover",
          compact ? "h-10 w-10" : "h-12 w-12"
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">{children}</div>
    </div>
  );
}

export function AssistantBubble({
  children,
  order = 0,
  className,
}: {
  children: ReactNode;
  order?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-fade-in-up max-w-prose rounded-[0.875rem] rounded-tl-[4px] border border-border-subtle bg-surface px-3.5 py-3 text-body text-foreground motion-reduce:animate-none",
        className
      )}
      style={{ animationDelay: `${order * BUBBLE_STAGGER_MS}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
