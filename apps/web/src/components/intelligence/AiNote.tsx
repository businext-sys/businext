"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const COLLAPSED_LENGTH = 140;

export function AiNote({ text, className }: { text: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > COLLAPSED_LENGTH;

  return (
    <div className={className}>
      <p
        className={cn(
          "text-body-sm text-foreground-muted whitespace-pre-line",
          isLong && !expanded && "line-clamp-2"
        )}
      >
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-caption font-medium text-secondary hover:text-secondary-hover"
        >
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  );
}
