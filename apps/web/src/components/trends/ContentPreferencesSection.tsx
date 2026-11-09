"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ContentPreferencesFormSchema } from "@businext/shared-core/schemas";
import type { ContentPreferences, SocialNetwork } from "@businext/shared-core/trends";
import { useContentPreferences } from "@/hooks/useTrends";
import { useGlobalToast } from "@/context/ToastContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { NETWORK_LABELS } from "@/components/trends/SuggestionCard";
import { Megaphone } from "lucide-react";

const NETWORKS: SocialNetwork[] = ["instagram", "tiktok"];

const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "en", label: "Inglés" },
  { value: "pt", label: "Portugués" },
];

const LABEL = "text-label font-semibold text-foreground-muted";

/** Preferencias del radar de tendencias y de los avisos de ideas de contenido. */
export function ContentPreferencesSection() {
  const { showToast } = useGlobalToast();
  const { preferences, loading, savePreferences } = useContentPreferences();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContentPreferences>();

  useEffect(() => {
    if (preferences) reset(preferences);
  }, [preferences, reset]);

  const onSubmit: SubmitHandler<ContentPreferences> = async (values) => {
    const parsed = ContentPreferencesFormSchema.safeParse({
      ...values,
      networks: values.networks || [],
      country: values.country.toUpperCase(),
    });
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        setError(issue.path[0] as keyof ContentPreferences, { message: issue.message });
      }
      return;
    }
    const saved = await savePreferences(parsed.data);
    if (saved) showToast("success", "Preferencias guardadas");
    else showToast("error", "No se pudieron guardar las preferencias");
  };

  if (loading || !preferences) return <SectionSkeleton />;

  return (
    <Card>
      <CardContent className="p-5 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-md">
              <Megaphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-h4 font-semibold text-foreground">
                Contenido y redes
              </h2>
              <p className="text-body-sm text-foreground-muted">
                Tendencias de tus redes e ideas de contenido para tu negocio.
              </p>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border-subtle p-4">
            <input type="checkbox" {...register("enabled")} className="mt-1 accent-primary" />
            <span className="space-y-1">
              <span className="block text-body font-semibold text-foreground">
                Activar el radar de tendencias
              </span>
              <span className="block text-caption text-foreground-subtle">
                Cada mañana analizamos lo que funciona en tus redes y te avisamos con ideas.
              </span>
            </span>
          </label>

          <fieldset className="space-y-2">
            <legend className={`mb-2 ${LABEL}`}>Redes</legend>
            <div className="flex flex-wrap gap-4">
              {NETWORKS.map((network) => (
                <label key={network} className="flex min-h-11 cursor-pointer items-center gap-2 text-body-sm text-foreground">
                  <input
                    type="checkbox"
                    value={network}
                    {...register("networks")}
                    className="accent-primary"
                  />
                  {NETWORK_LABELS[network]}
                </label>
              ))}
            </div>
            {errors.networks && <p className="text-caption text-danger">{errors.networks.message}</p>}
          </fieldset>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="maxPerDay" className={LABEL}>Ideas al día</label>
              <Select id="maxPerDay" {...register("maxPerDay", { valueAsNumber: true })}>
                {[1, 2, 3].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="quietFrom" className={LABEL}>Sin avisos desde</label>
              <Input
                id="quietFrom"
                type="time"
                state={errors.quietFrom ? "error" : "default"}
                {...register("quietFrom")}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="quietTo" className={LABEL}>Hasta</label>
              <Input
                id="quietTo"
                type="time"
                state={errors.quietTo ? "error" : "default"}
                {...register("quietTo")}
              />
              {errors.quietTo && <p className="text-caption text-danger">{errors.quietTo.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="niche" className={LABEL}>Tipo de negocio</label>
              <Input
                id="niche"
                state={errors.niche ? "error" : "default"}
                {...register("niche")}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="timezone" className={LABEL}>Zona horaria</label>
              <Input
                id="timezone"
                placeholder="Europe/Madrid"
                state={errors.timezone ? "error" : "default"}
                {...register("timezone")}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="language" className={LABEL}>Idioma de las tendencias</label>
              <Select id="language" {...register("language")}>
                {LANGUAGES.map((language) => (
                  <option key={language.value} value={language.value}>{language.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="country" className={LABEL}>País (código de 2 letras)</label>
              <Input
                id="country"
                maxLength={2}
                placeholder="ES"
                state={errors.country ? "error" : "default"}
                {...register("country")}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Guardar preferencias
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
