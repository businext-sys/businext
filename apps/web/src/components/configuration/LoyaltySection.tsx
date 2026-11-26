"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Stamp } from "lucide-react";
import { useLoyaltyProgram } from "@/hooks/useLoyalty";
import { LoyaltyProgramSettingsSchema } from "@businext/shared-core/schemas";
import type { LoyaltyProgramSettings } from "@businext/shared-core/loyalty";
import { themeColors } from "@businext/shared-core/theme";
import { useGlobalToast } from "@/context/ToastContext";
import { SectionSkeleton } from "@/components/common/SkeletonLoader";
import { MoreOptions, SettingRow, SettingsCard } from "@/components/configuration/SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const LABEL = "text-label font-semibold text-foreground-muted";

/** Colores del pase cuando el negocio no elige: los de Businext (DESIGN.md), como en el backend. */
const DEFAULT_PASS = {
  backgroundColor: themeColors.dark.background,
  foregroundColor: themeColors.dark.foreground,
  labelColor: themeColors.dark.primary,
};

/**
 * Tarjeta de fidelidad (ADR 0003 de businext-backend): N sellos dan un premio y
 * cada reserva completada suma uno. Solo el owner la cambia; el manager la ve.
 */
export function LoyaltySection({ canEdit }: { canEdit: boolean }) {
  const { program, loading, error, updateProgram, uploadLogo, deleteLogo } = useLoyaltyProgram();
  const { showToast } = useGlobalToast();
  const [draft, setDraft] = useState<LoyaltyProgramSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (program) {
      setDraft({
        enabled: program.enabled,
        stampsRequired: program.stampsRequired,
        reward: program.reward,
        backgroundColor: program.backgroundColor,
        foregroundColor: program.foregroundColor,
        labelColor: program.labelColor,
      });
    }
  }, [program]);

  if (loading) return <SectionSkeleton />;

  const save = async (next: LoyaltyProgramSettings, message: string) => {
    const parsed = LoyaltyProgramSettingsSchema.safeParse(next);
    if (!parsed.success) {
      setFormError("Revisa los sellos (de 1 a 50) y el premio (hasta 40 letras).");
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      await updateProgram(parsed.data);
      showToast("success", message);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "No se pudo guardar la tarjeta.");
    } finally {
      setSaving(false);
    }
  };

  const dirty =
    !!program &&
    !!draft &&
    (draft.stampsRequired !== program.stampsRequired ||
      draft.reward !== program.reward ||
      draft.backgroundColor !== program.backgroundColor ||
      draft.foregroundColor !== program.foregroundColor ||
      draft.labelColor !== program.labelColor);

  return (
    <SettingsCard
      id="loyalty"
      icon={Stamp}
      title="Tarjeta de fidelidad"
      description="Cada visita completada suma un sello. Al llegar a los que pidas, el cliente gana su premio. La lleva en el móvil, en Apple Wallet."
    >
      {error || !program || !draft ? (
        <p className="text-body-sm text-danger">No se pudo cargar la tarjeta de fidelidad.</p>
      ) : !canEdit ? (
        <p className="text-body-sm text-foreground-muted">
          {program.enabled
            ? `Activada: ${program.stampsRequired} sellos = ${program.reward}. Cualquiera del equipo puede entregar el premio.`
            : "Desactivada. Solo el dueño del negocio puede activarla."}
        </p>
      ) : (
        <>
          <SettingRow
            title="Tarjeta de fidelidad"
            hint={
              draft.enabled
                ? "Activada: las reservas completadas desde ahora suman sellos."
                : "Desactivada: no se dan sellos."
            }
            control={
              <Switch
                checked={draft.enabled}
                disabled={saving}
                label="Activar la tarjeta de fidelidad"
                onChange={(enabled) =>
                  save(
                    { ...draft, enabled },
                    enabled ? "Tarjeta de fidelidad activada." : "Tarjeta de fidelidad desactivada."
                  )
                }
              />
            }
          />

          {draft.enabled && (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                save(draft, "Tarjeta de fidelidad guardada. Los pases se actualizan solos.");
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[10rem_1fr]">
                <div className="space-y-1.5">
                  <label htmlFor="stampsRequired" className={LABEL}>
                    Sellos para el premio
                  </label>
                  <Input
                    id="stampsRequired"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={50}
                    value={Number.isNaN(draft.stampsRequired) ? "" : draft.stampsRequired}
                    onChange={(e) => setDraft({ ...draft, stampsRequired: e.target.valueAsNumber })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="reward" className={LABEL}>
                    Premio
                  </label>
                  <Input
                    id="reward"
                    maxLength={40}
                    value={draft.reward}
                    placeholder="Corte gratis"
                    onChange={(e) => setDraft({ ...draft, reward: e.target.value })}
                  />
                </div>
              </div>

              <ColorField
                id="backgroundColor"
                label="Color de la tarjeta"
                value={draft.backgroundColor}
                fallback={DEFAULT_PASS.backgroundColor}
                onChange={(backgroundColor) => setDraft({ ...draft, backgroundColor })}
              />

              <LogoField
                logoUrl={program.logoUrl}
                onUpload={uploadLogo}
                onDelete={deleteLogo}
              />

              <MoreOptions label="Más opciones: colores del texto">
                <ColorField
                  id="foregroundColor"
                  label="Color del texto"
                  value={draft.foregroundColor}
                  fallback={DEFAULT_PASS.foregroundColor}
                  onChange={(foregroundColor) => setDraft({ ...draft, foregroundColor })}
                />
                <ColorField
                  id="labelColor"
                  label="Color de las etiquetas"
                  value={draft.labelColor}
                  fallback={DEFAULT_PASS.labelColor}
                  onChange={(labelColor) => setDraft({ ...draft, labelColor })}
                />
              </MoreOptions>

              <PassPreview settings={draft} logoUrl={program.logoUrl} />

              <ul className="list-disc space-y-1 pl-5 text-caption text-foreground-subtle">
                <li>Solo cuentan las visitas desde que la activas, y los sellos no caducan.</li>
                <li>El cliente recibe la tarjeta en el email de confirmación de su reserva.</li>
                <li>Cualquiera del equipo puede entregar el premio.</li>
                {!program.appleWalletAvailable && (
                  <li>Los pases de Apple Wallet aún no están activos en Businext: los sellos se cuentan igual.</li>
                )}
              </ul>

              {formError && <p className="text-caption text-danger">{formError}</p>}
              <Button type="submit" variant="primary" loading={saving} disabled={!dirty}>
                Guardar tarjeta
              </Button>
            </form>
          )}
        </>
      )}
    </SettingsCard>
  );
}

function ColorField({
  id,
  label,
  value,
  fallback,
  onChange,
}: {
  id: string;
  label: string;
  value: string | null;
  fallback: string;
  onChange: (value: string | null) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <input
          id={id}
          type="color"
          value={value ?? fallback}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-11 w-14 cursor-pointer rounded-sm border border-border bg-transparent"
        />
        <span className="font-mono text-body-sm text-foreground-muted">
          {value ?? "Colores de Businext"}
        </span>
        {value && (
          <Button type="button" variant="ghost" onClick={() => onChange(null)}>
            Usar los de Businext
          </Button>
        )}
      </div>
    </div>
  );
}

/** Boceto del frontal del pase con los colores elegidos (el de verdad lo genera el backend). */
function PassPreview({
  settings,
  logoUrl,
}: {
  settings: LoyaltyProgramSettings;
  logoUrl: string | null;
}) {
  const required = Number.isFinite(settings.stampsRequired)
    ? Math.min(Math.max(settings.stampsRequired, 1), 50)
    : 10;
  const shown = Math.min(required, 10);
  const background = settings.backgroundColor ?? DEFAULT_PASS.backgroundColor;
  const foreground = settings.foregroundColor ?? DEFAULT_PASS.foregroundColor;
  const label = settings.labelColor ?? DEFAULT_PASS.labelColor;
  return (
    <div className="space-y-2">
      <p className={LABEL}>Vista aproximada del pase</p>
      <div
        className="w-full max-w-xs space-y-3 rounded-lg border border-border p-4"
        // Colores elegidos por el negocio para su pase: son datos, no tokens de la app.
        style={{ backgroundColor: background, color: foreground }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-caption font-bold uppercase tracking-[0.1em]" style={{ color: label }}>
            Sellos
          </p>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-8 max-w-24 object-contain" />
          ) : (
            <span className="font-heading text-body font-black uppercase">Businext</span>
          )}
        </div>
        <p className="font-heading text-h3 font-extrabold">3/{required}</p>
        <div className="flex flex-wrap gap-1.5" aria-hidden>
          {Array.from({ length: shown }, (_, i) => (
            <span
              key={i}
              className="h-4 w-4 rounded-full border"
              style={{ borderColor: label, backgroundColor: i < 3 ? label : "transparent" }}
            />
          ))}
        </div>
        <p className="text-caption">
          <span className="font-bold uppercase tracking-[0.1em]" style={{ color: label }}>
            Premio{" "}
          </span>
          {settings.reward || "Corte gratis"}
        </p>
      </div>
    </div>
  );
}

const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const LOGO_MAX_BYTES = 2 * 1024 * 1024;

/** Logo propio del pase (opcional). Sin él, el pase lleva el de Businext. */
function LogoField({
  logoUrl,
  onUpload,
  onDelete,
}: {
  logoUrl: string | null;
  onUpload: (file: Blob) => Promise<unknown>;
  onDelete: () => Promise<unknown>;
}) {
  const { showToast } = useGlobalToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const run = async (task: () => Promise<unknown>, message: string) => {
    setBusy(true);
    try {
      await task();
      showToast("success", message);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "No se pudo cambiar el logo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const pick = (file: File | undefined) => {
    if (!file) return;
    if (!LOGO_TYPES.includes(file.type)) {
      showToast("error", "El logo tiene que ser PNG, JPG o WebP.");
      return;
    }
    if (file.size > LOGO_MAX_BYTES) {
      showToast("error", "El logo pesa demasiado: hasta 2 MB.");
      return;
    }
    run(() => onUpload(file), "Logo subido. Los pases se actualizan solos.");
  };

  return (
    <div className="space-y-1.5">
      <p className={LABEL}>Logo (opcional)</p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-14 w-20 items-center justify-center overflow-hidden rounded-md border border-border-subtle bg-surface-raised">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo del pase" className="max-h-12 max-w-16 object-contain" />
          ) : (
            <ImagePlus className="h-5 w-5 text-foreground-subtle" aria-hidden />
          )}
        </div>
        <input
          ref={inputRef}
          id="loyaltyLogo"
          type="file"
          accept={LOGO_TYPES.join(",")}
          className="sr-only"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="secondary"
          loading={busy}
          onClick={() => inputRef.current?.click()}
        >
          {logoUrl ? "Cambiar logo" : "Subir logo"}
        </Button>
        {logoUrl && (
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={() => run(onDelete, "Logo quitado: los pases llevan el de Businext.")}
          >
            Quitar
          </Button>
        )}
      </div>
      <p className="text-caption text-foreground-subtle">
        PNG, JPG o WebP de hasta 2 MB. Si no subes ninguno, la tarjeta lleva el de Businext.
      </p>
    </div>
  );
}
