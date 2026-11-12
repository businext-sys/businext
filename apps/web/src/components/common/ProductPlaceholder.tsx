"use client";

import { Package, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductPlaceholderProps {
  type?: string;
  className?: string;
}

export function ProductPlaceholder({ type, className }: ProductPlaceholderProps) {
  const Icon = type === "servicio" ? Scissors : Package;

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden bg-surface-raised text-foreground-subtle",
        className
      )}
    >
      <Icon className="h-2/5 w-2/5" strokeWidth={1.5} />
    </div>
  );
}
