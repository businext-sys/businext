"use client";

import { useState } from "react";
import type { ContentFormat, ContentSuggestion, SocialNetwork } from "@businext/shared-core/trends";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGlobalToast } from "@/context/ToastContext";
import { NetworkIcon } from "@/components/trends/NetworkIcon";
import { SuggestionPreview } from "@/components/trends/SuggestionPreview";
import { ChevronDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export const NETWORK_LABELS: Record<SocialNetwork, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
};

const FORMAT_LABELS: Record<ContentFormat, string> = {
  reel: "Reel",
  short: "Short",
  carrusel: "Carrusel",
  story: "Story",
};

function formatPublishAt(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SuggestionCard({
  suggestion,
  onOpen,
  onDismiss,
  onPublished,
}: {
  suggestion: ContentSuggestion;
  onOpen: (id: number) => void;
  onDismiss: (id: number) => void;
  onPublished?: (id: number) => void;
}) {
  const { showToast } = useGlobalToast();
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    if (!expanded && suggestion.status === "sent") onOpen(suggestion.id);
    setExpanded((value) => !value);
  };

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(suggestion.captionHint);
      showToast("success", "Texto copiado al portapapeles");
    } catch {
      showToast("error", "No se pudo copiar el texto");
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted" className="gap-1.5">
            <NetworkIcon network={suggestion.network} className="h-3.5 w-3.5" />
            {NETWORK_LABELS[suggestion.network]}
          </Badge>
          <Badge variant="muted">{FORMAT_LABELS[suggestion.format]}</Badge>
          <span className="ml-auto text-caption font-bold uppercase tracking-[0.1em] text-secondary">
            {formatPublishAt(suggestion.publishAt)}
          </span>
        </div>

        <p className="text-body font-medium text-foreground">{suggestion.idea}</p>

        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="flex items-center gap-1 text-label font-medium text-primary hover:text-primary-hover"
        >
          {expanded ? "Ocultar vista previa" : "Ver vista previa"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </button>

        {expanded && (
          <div className="flex flex-col gap-4 sm:flex-row">
            <SuggestionPreview suggestion={suggestion} />

            <div className="min-w-0 flex-1 self-start rounded-md bg-muted p-3 space-y-2">
              <p className="text-body-sm text-muted-foreground whitespace-pre-line">
                {suggestion.captionHint}
              </p>
              <Button variant="ghost" size="sm" onClick={copyCaption}>
                <Copy className="h-4 w-4" />
                Copiar texto
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={() => onDismiss(suggestion.id)}>
            No me interesa
          </Button>
          {onPublished && (
            <Button variant="secondary" size="sm" onClick={() => onPublished(suggestion.id)}>
              Ya lo publiqué
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
