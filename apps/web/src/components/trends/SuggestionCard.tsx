"use client";

import { useEffect, useRef, useState } from "react";
import type { ContentFormat, ContentSuggestion } from "@businext/shared-core/trends";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGlobalToast } from "@/context/ToastContext";
import { AssistantBubble, AssistantMessage } from "@/components/trends/AssistantMessage";
import { NETWORK_LABELS, NetworkIcon } from "@/components/trends/NetworkIcon";
import { SuggestionPreview } from "@/components/trends/SuggestionPreview";
import { ChevronDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

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
  defaultExpanded = false,
}: {
  suggestion: ContentSuggestion;
  onOpen: (id: number) => void;
  onDismiss: (id: number) => void;
  onPublished?: (id: number) => void;
  defaultExpanded?: boolean;
}) {
  const { showToast } = useGlobalToast();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const markedOpened = useRef(false);

  useEffect(() => {
    if (!expanded || markedOpened.current || suggestion.status !== "sent") return;
    markedOpened.current = true;
    onOpen(suggestion.id);
  }, [expanded, suggestion.status, suggestion.id, onOpen]);

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

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="min-w-0 flex-1 space-y-3">
            <AssistantMessage compact>
              <AssistantBubble className="bg-surface-raised font-medium">{suggestion.idea}</AssistantBubble>
              {expanded && (
                <AssistantBubble order={1} className="bg-surface-raised text-body-sm text-foreground-muted">
                  Así quedaría. El texto de la publicación ya está listo para pegar.
                  <Button variant="secondary" size="sm" onClick={copyCaption} className="mt-2 flex">
                    <Copy className="h-4 w-4" />
                    Copiar texto
                  </Button>
                </AssistantBubble>
              )}
            </AssistantMessage>

            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="flex min-h-11 items-center gap-1 text-label font-medium text-primary hover:text-primary-hover"
            >
              {expanded ? "Ocultar vista previa" : "Ver vista previa"}
              <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
            </button>
          </div>

          {expanded && (
            <div className="sm:order-first">
              <SuggestionPreview suggestion={suggestion} />
            </div>
          )}
        </div>

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
