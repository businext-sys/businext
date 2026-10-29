"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import { COPY, type Lang } from "./content";

type Status = "idle" | "sending" | "done" | "error";

const field =
  "w-full rounded-md border border-border bg-surface-raised px-4 py-3 text-body text-foreground placeholder:text-foreground-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function WhitelistForm({ lang }: { lang: Lang }) {
  const t = COPY[lang].form;
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
      // The API answers in Spanish; the English page keeps its own wording.
      if (!res.ok) throw new Error(lang === "es" && json.error ? json.error : t.error);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : t.error);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="m-0 flex items-center justify-center gap-2 rounded-lg bg-surface-raised p-5 text-body text-foreground">
        <CircleCheck aria-hidden className="h-5 w-5 shrink-0 text-success" />
        {t.done}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 text-left">
      <label className="grid gap-1.5 text-label font-semibold text-foreground">
        {t.name}
        <input name="name" required autoComplete="name" maxLength={120} className={field} />
      </label>
      <label className="grid gap-1.5 text-label font-semibold text-foreground">
        {t.shop}
        <input name="shop" required autoComplete="organization" maxLength={120} className={field} />
      </label>
      <label className="grid gap-1.5 text-label font-semibold text-foreground">
        {t.contact}
        <input name="contact" required maxLength={160} className={field} />
      </label>
      <fieldset className="m-0 grid gap-2 border-0 p-0">
        <legend className="mb-1.5 text-label font-semibold text-foreground">{t.interest}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { value: "businext", label: t.interests.businext },
            { value: "web", label: t.interests.web },
          ].map((option, i) => (
            <label
              key={option.value}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface-raised px-4 py-2.5 text-body-sm text-foreground has-[:checked]:border-primary"
            >
              <input type="radio" name="interest" value={option.value} defaultChecked={i === 0} className="accent-[var(--color-primary)]" />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <input type="hidden" name="lang" value={lang} />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-label font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-70"
      >
        {status === "sending" ? t.sending : t.submit} <ArrowRight aria-hidden className="h-4 w-4" />
      </button>
      {status === "error" && (
        <p role="alert" className="m-0 text-body-sm text-danger">
          {error}. {t.retry}
        </p>
      )}
    </form>
  );
}
