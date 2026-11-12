"use client";

import { useState } from "react";
import type { ContentSuggestion } from "@businext/shared-core/trends";
import { NetworkIcon } from "@/components/trends/NetworkIcon";
import { TrendPlayer, trendEmbedUrl } from "@/components/trends/TrendEmbed";
import { ChevronLeft, ChevronRight, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_BUTTON =
  "flex h-11 w-11 items-center justify-center rounded-md text-foreground-muted hover:bg-surface-raised hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent";

/** La idea con la forma de su publicación: vertical para reel, short y story; cuadrada para carrusel. De fondo, el vídeo de la tendencia que la inspiró. */
export function SuggestionPreview({ suggestion }: { suggestion: ContentSuggestion }) {
  const [scene, setScene] = useState(0);
  const scenes = suggestion.script.length > 0 ? suggestion.script : [suggestion.idea];
  const square = suggestion.format === "carrusel";
  const sceneLabel = square ? "Imagen" : "Escena";
  const sourceUrl = suggestion.sourceTrendIds.find((url) => trendEmbedUrl(url));

  const details = (
    <div className="space-y-1.5 p-3">
      <p className="line-clamp-3 text-caption text-foreground">{suggestion.captionHint}</p>
      {suggestion.audioHint && (
        <p className="flex items-start gap-1.5 text-caption text-foreground-muted">
          <Music2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
          <span className="line-clamp-2">{suggestion.audioHint}</span>
        </p>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "mx-auto w-full shrink-0 overflow-hidden rounded-xl border border-border bg-background sm:mx-0",
        square ? "max-w-64" : "max-w-60"
      )}
    >
      <div className={cn("relative flex flex-col overflow-hidden", square ? "aspect-square" : "aspect-[9/16]")}>
        {sourceUrl && (
          <>
            <TrendPlayer
              url={sourceUrl}
              title=""
              className="pointer-events-none origin-[50%_40%] scale-150 blur-[2px]"
            />
            <div className="absolute inset-0 bg-background/65" />
          </>
        )}

        <div className="relative flex min-h-0 flex-1 flex-col">
          {!square && (
            <div className="flex gap-1 px-3 pt-3">
              {scenes.map((_, index) => (
                <span
                  key={index}
                  className={cn("h-1 flex-1 rounded-full", index <= scene ? "bg-primary" : "bg-border")}
                />
              ))}
            </div>
          )}

          <p className="flex items-center gap-1.5 px-3 pt-3 text-caption font-medium text-foreground-muted">
            <NetworkIcon network={suggestion.network} className="h-4 w-4 shrink-0" />
            {sceneLabel} {scene + 1} de {scenes.length}
          </p>

          <div className="flex min-h-0 flex-1 items-center overflow-y-auto px-3 py-2">
            <p className="m-auto text-center font-heading text-h3 font-extrabold text-foreground">
              {scenes[scene]}
            </p>
          </div>

          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => setScene(scene - 1)}
              disabled={scene === 0}
              aria-label={`${sceneLabel} anterior`}
              className={NAV_BUTTON}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {square && (
              <div className="flex gap-1.5">
                {scenes.map((_, index) => (
                  <span
                    key={index}
                    className={cn("h-1.5 w-1.5 rounded-full", index === scene ? "bg-primary" : "bg-border")}
                  />
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setScene(scene + 1)}
              disabled={scene === scenes.length - 1}
              aria-label={`${sceneLabel} siguiente`}
              className={NAV_BUTTON}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {!square && details}
        </div>
      </div>

      {square && <div className="border-t border-border-subtle">{details}</div>}
    </div>
  );
}
