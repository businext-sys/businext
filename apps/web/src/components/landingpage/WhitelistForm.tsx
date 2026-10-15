"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";

type Status = "idle" | "sending" | "done" | "error";

const field =
  "w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-body text-foreground placeholder:text-foreground-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function WhitelistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const res = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "No se pudo enviar");
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo enviar");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="m-0 flex items-center justify-center gap-2 rounded-2xl bg-surface-raised p-5 text-body text-foreground">
        <CircleCheck aria-hidden className="h-5 w-5 shrink-0 text-success" />
        Estás dentro. Te escribimos cuando sea el turno de tu barbería.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 text-left">
      <label className="grid gap-1.5 text-label font-semibold text-foreground">
        Tu nombre
        <input name="name" required autoComplete="name" maxLength={120} className={field} />
      </label>
      <label className="grid gap-1.5 text-label font-semibold text-foreground">
        Tu barbería
        <input name="shop" required autoComplete="organization" maxLength={120} className={field} />
      </label>
      <label className="grid gap-1.5 text-label font-semibold text-foreground">
        Email o teléfono
        <input name="contact" required maxLength={160} className={field} />
      </label>
      <fieldset className="m-0 grid gap-2 border-0 p-0">
        <legend className="mb-1.5 text-label font-semibold text-foreground">Me interesa</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { value: "businext", label: "Businext completo" },
            { value: "web", label: "Solo la web" },
          ].map((option, i) => (
            <label
              key={option.value}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface-raised px-4 py-2.5 text-body-sm text-foreground has-[:checked]:border-primary"
            >
              <input type="radio" name="interest" value={option.value} defaultChecked={i === 0} className="accent-[var(--color-primary)]" />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-label font-semibold text-brand-foreground shadow-glow-primary transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-70"
      >
        {status === "sending" ? "Enviando…" : "Apuntarme a la whitelist"} <ArrowRight aria-hidden className="h-4 w-4" />
      </button>
      {status === "error" && (
        <p role="alert" className="m-0 text-body-sm text-danger">
          {error}. Inténtalo de nuevo en un momento.
        </p>
      )}
    </form>
  );
}
