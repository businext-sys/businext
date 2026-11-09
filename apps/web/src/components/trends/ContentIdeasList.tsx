"use client";

import { useContentSuggestions } from "@/hooks/useTrends";
import { useGlobalToast } from "@/context/ToastContext";
import { EmptyState } from "@/components/ui/empty-state";
import { ListSkeleton } from "@/components/ui/skeleton";
import { SuggestionCard } from "@/components/trends/SuggestionCard";
import { Sparkles } from "lucide-react";

export function ContentIdeasList() {
  const { showToast } = useGlobalToast();
  const { suggestions, loading, markOpened, dismiss } = useContentSuggestions();

  const ideas = suggestions
    .filter((s) => s.status === "sent" || s.status === "opened")
    .sort((a, b) => a.publishAt.localeCompare(b.publishAt));

  const handleDismiss = async (id: number) => {
    if (!(await dismiss(id))) showToast("error", "No se pudo descartar la idea");
  };

  if (loading) return <ListSkeleton />;

  if (ideas.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles />}
        title="Sin ideas nuevas"
        description="Aquí aparecerán las ideas de contenido que te enviemos a partir de las tendencias."
        className="py-8"
      />
    );
  }

  return (
    <div className="space-y-3">
      {ideas.map((suggestion) => (
        <SuggestionCard
          key={suggestion.id}
          suggestion={suggestion}
          onOpen={markOpened}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
}
