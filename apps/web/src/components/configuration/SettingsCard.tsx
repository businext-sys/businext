"use client";

import { type ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Tarjeta de un bloque de configuracion: icono, titulo, una linea que explica
 * para que sirve y el contenido. `id` es el ancla (`#bloque-<id>`) a la que
 * llevan los enlaces y los apartados de antes.
 */
export function SettingsCard({
  id,
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
}: {
  id?: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Card id={id ? `bloque-${id}` : undefined} className={cn("scroll-mt-24", className)}>
      <CardContent className="space-y-5 p-5 sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="shrink-0 rounded-md bg-surface-raised p-2.5">
              <Icon className="h-5 w-5 text-secondary" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading text-h4 font-semibold text-foreground">{title}</h2>
              {description && (
                <p className="text-body-sm text-foreground-muted">{description}</p>
              )}
            </div>
          </div>
          {action}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

/**
 * Opciones que casi nadie necesita tocar, plegadas por defecto (divulgacion
 * progresiva). `defaultOpen` las abre, p. ej. si dentro hay un error.
 */
export function MoreOptions({
  label = "Más opciones",
  defaultOpen,
  children,
}: {
  label?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-lg border border-border-subtle" open={defaultOpen}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-4 text-body-sm font-medium text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-5 border-t border-border-subtle p-4">{children}</div>
    </details>
  );
}

/** Fila de un ajuste de si/no: texto a la izquierda, interruptor a la derecha. */
export function SettingRow({
  title,
  hint,
  control,
}: {
  title: string;
  hint?: ReactNode;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border-subtle p-4">
      <div className="min-w-0 space-y-1">
        <p className="text-body font-semibold text-foreground">{title}</p>
        {hint && <p className="text-caption text-foreground-subtle">{hint}</p>}
      </div>
      {control}
    </div>
  );
}
