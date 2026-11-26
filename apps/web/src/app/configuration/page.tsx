"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarCheck,
  PackageSearch,
  Settings,
  ShieldAlert,
  Sparkles,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  LEGACY_SETTINGS_BLOCKS,
  resolveSettingsSection,
  visibleSettingsSections,
  type SettingsSectionId,
} from "@businext/shared-core/services";
import type { AccessRole } from "@businext/shared-core";
import { useAccessContext } from "@/hooks/useAccessContext";
import { useConfiguration } from "@/hooks/useConfiguration";
import { SectionSkeleton } from "@/components/common/SkeletonLoader";
import { PageContainer, PageHeader } from "@/components/common/PageLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductsSection } from "@/components/configuration/ProductsSection";
import { BusinessSection } from "@/components/configuration/sections/BusinessSection";
import { TeamSection } from "@/components/configuration/sections/TeamSection";
import { BookingsSection } from "@/components/configuration/sections/BookingsSection";
import { AssistantSection } from "@/components/configuration/sections/AssistantSection";
import { AccountSection } from "@/components/configuration/sections/AccountSection";
import { cn } from "@/lib/utils";

const SECTION_ICONS: Record<SettingsSectionId, LucideIcon> = {
  negocio: Building2,
  equipo: Users,
  servicios: PackageSearch,
  reservas: CalendarCheck,
  asistente: Sparkles,
  cuenta: UserCircle,
};

/**
 * Configuracion en seis apartados (docs/plans/configuracion-simplificada.md).
 * `?section=` acepta los apartados nuevos y los de antes (`content`, `hours`...),
 * que abren el apartado nuevo y bajan hasta su bloque.
 */
export default function ConfigurationPage() {
  const { capabilities, context, loading: contextLoading } = useAccessContext();
  const { loading: configurationLoading } = useConfiguration();
  const isOwner = context?.role === "owner";

  const sections = useMemo(
    () => visibleSettingsSections({ role: context?.role as AccessRole | undefined, capabilities }),
    [context?.role, capabilities]
  );

  const [requested, setRequested] = useState<{ section: string | null; block: string | null }>({
    section: null,
    block: null,
  });
  const [active, setActive] = useState<SettingsSectionId | null>(null);

  // Lee `?section=` y el ancla una sola vez (los enlaces de antes siguen funcionando).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    const hash = window.location.hash.replace(/^#bloque-/, "");
    setRequested({
      section,
      block: hash || (section ? LEGACY_SETTINGS_BLOCKS[section] ?? null : null),
    });
  }, []);

  useEffect(() => {
    if (contextLoading || sections.length === 0) return;
    setActive((current) => current ?? resolveSettingsSection(requested.section, sections));
  }, [contextLoading, sections, requested.section]);

  // Baja hasta el bloque pedido cuando ya esta pintado.
  useEffect(() => {
    if (!active || !requested.block) return;
    const timer = window.setTimeout(() => {
      document.getElementById(`bloque-${requested.block}`)?.scrollIntoView({ block: "start" });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [active, requested.block]);

  const open = (id: SettingsSectionId) => {
    setActive(id);
    setRequested({ section: id, block: null });
    window.history.replaceState(null, "", `/configuration?section=${id}`);
  };

  if (!contextLoading && !capabilities.canManageConfiguration) {
    return (
      <PageContainer>
        <EmptyState
          icon={<ShieldAlert />}
          title="Acceso restringido"
          description="No tienes permisos para acceder a la configuración."
        />
      </PageContainer>
    );
  }

  const current = sections.find((section) => section.id === active);

  return (
    <PageContainer>
      <PageHeader
        icon={Settings}
        title="Configuración"
        description="Lo de tu negocio, ordenado por temas. Lo que casi nunca se toca está plegado."
      />

      {contextLoading || configurationLoading || !current ? (
        <SectionSkeleton />
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <nav aria-label="Apartados de configuración" className="flex-shrink-0 lg:w-64">
            <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
              {sections.map((section) => {
                const Icon = SECTION_ICONS[section.id];
                const selected = section.id === current.id;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => open(section.id)}
                      aria-current={selected ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 w-full items-start gap-3 whitespace-nowrap rounded-md px-3 py-2.5 text-left transition-colors duration-150 lg:whitespace-normal",
                        selected
                          ? "bg-surface-raised text-foreground"
                          : "text-foreground-muted hover:bg-surface-raised/60 hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn("mt-0.5 h-5 w-5 shrink-0", selected ? "text-primary" : "")}
                      />
                      <span className="min-w-0">
                        <span className="block text-body-sm font-semibold">{section.label}</span>
                        <span className="hidden text-caption text-foreground-subtle lg:block">
                          {section.description}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <section aria-labelledby="apartado-titulo" className="min-w-0 flex-1 space-y-6">
            <div className="lg:hidden">
              <p className="text-body-sm text-foreground-muted">{current.description}</p>
            </div>
            <h2 id="apartado-titulo" className="sr-only">
              {current.label}
            </h2>
            {current.id === "negocio" && <BusinessSection blocks={current.blocks} canEdit={isOwner} />}
            {current.id === "equipo" && <TeamSection blocks={current.blocks} />}
            {current.id === "servicios" && <ProductsSection />}
            {current.id === "reservas" && (
              <BookingsSection
                blocks={current.blocks}
                businessId={context?.businessId ?? ""}
                canEditLoyalty={isOwner}
              />
            )}
            {current.id === "asistente" && <AssistantSection blocks={current.blocks} />}
            {current.id === "cuenta" && <AccountSection blocks={current.blocks} />}
          </section>
        </div>
      )}
    </PageContainer>
  );
}
