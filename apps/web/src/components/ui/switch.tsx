"use client";

import { cn } from "@/lib/utils";

/** Interruptor accesible (`role="switch"`) con zona tactil de 44 px. */
export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Nombre accesible: lo que activa el interruptor. */
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex h-11 w-14 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
    >
      <span
        className={cn(
          "relative h-7 w-12 rounded-full transition-colors duration-150",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full transition-transform duration-150",
            checked ? "translate-x-6 bg-primary-foreground" : "translate-x-1 bg-foreground-subtle"
          )}
        />
      </span>
    </button>
  );
}
