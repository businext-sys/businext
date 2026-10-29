"use client";

import { useState } from "react";
import { PhoneOff } from "lucide-react";
import type { VoiceCallFilters } from "@businext/shared-core";
import { useVoiceAgentCalls } from "@/hooks/useVoiceAgentCalls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { VoiceCallDetailDrawer } from "./VoiceCallDetailDrawer";
import { callOutcome, formatCallDateTime, formatDuration } from "./format";

const PAGE_SIZE = 20;

const FILTERS: { label: string; filters: VoiceCallFilters }[] = [
  { label: "Todas", filters: {} },
  { label: "Con reserva", filters: { booked: true } },
  { label: "Sin reserva", filters: { status: "ended", booked: false } },
  { label: "Rechazadas", filters: { status: "rejected" } },
];

export function VoiceCallList() {
  const [filterIndex, setFilterIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { calls, total, loading, error } = useVoiceAgentCalls({
    ...FILTERS[filterIndex].filters,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter, index) => (
          <button
            key={filter.label}
            onClick={() => {
              setFilterIndex(index);
              setPage(0);
            }}
            className={cn(
              "h-8 rounded-full px-3 text-caption font-medium transition-colors",
              filterIndex === index
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading && calls.length === 0 ? (
        <SectionSkeleton />
      ) : error ? (
        <p className="text-body-sm text-danger">No se pudieron cargar las llamadas.</p>
      ) : calls.length === 0 ? (
        <EmptyState
          icon={<PhoneOff />}
          title="Sin llamadas"
          description="Aquí verás cada llamada que atienda el agente, con su resumen y si terminó en reserva."
        />
      ) : (
        <div className="rounded-lg border border-border-subtle bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead className="hidden md:table-cell">Resumen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => {
                const outcome = callOutcome(call);
                return (
                  <TableRow
                    key={call.id}
                    onClick={() => setSelectedId(call.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="whitespace-nowrap">
                      {formatCallDateTime(call.startedAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono">
                      {call.fromNumber ?? "Oculto"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDuration(call.durationSeconds)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={outcome.variant}>{outcome.label}</Badge>
                    </TableCell>
                    <TableCell className="hidden max-w-md truncate text-foreground-muted md:table-cell">
                      {call.summary ?? "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <span className="text-caption text-foreground-muted">
            Página {page + 1} de {pages} · {total} llamadas
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page + 1 >= pages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      <VoiceCallDetailDrawer callId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
