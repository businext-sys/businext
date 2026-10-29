"use client";

import React from "react";
import { Palette } from "lucide-react";
import type { ThemeMode } from "@businext/shared-core/theme";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MODES: { value: ThemeMode; label: string; description: string }[] = [
  {
    value: "dark",
    label: "Oscuro",
    description: "Negro cálido y turquesa. El modo por defecto.",
  },
  {
    value: "light",
    label: "Claro",
    description: "Blanco roto y coñac, para ambientes con mucha luz.",
  },
];

/** Modo de color de la app. Se guarda en este navegador, no en la cuenta. */
export function AppearanceSection() {
  const { mode, setMode } = useThemeMode();

  return (
    <Card>
      <CardContent className="p-5 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-md">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-h4 font-semibold text-foreground">
              Apariencia
            </h2>
            <p className="text-body-sm text-foreground-muted">
              Elige cómo se ve Businext en este navegador.
            </p>
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="mb-2 text-label font-semibold text-foreground-muted">
            Modo de color
          </legend>
          {MODES.map((option) => {
            const selected = mode === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors",
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border-subtle hover:border-primary/50"
                )}
              >
                <input
                  type="radio"
                  name="theme-mode"
                  value={option.value}
                  checked={selected}
                  onChange={() => setMode(option.value)}
                  className="mt-1 accent-primary"
                />
                <span className="space-y-1">
                  <span className="block text-body font-semibold text-foreground">
                    {option.label}
                  </span>
                  <span className="block text-caption text-foreground-subtle">
                    {option.description}
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>
      </CardContent>
    </Card>
  );
}
