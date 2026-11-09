import { describe, it, expect } from "vitest";
import { countNewSuggestions, isCurrentSuggestion } from "../../src/services/contentSuggestions";
import type { ContentSuggestion } from "../../src/trends";

const NOW = new Date(2026, 10, 9, 20, 0);

const suggestion = (publishAt: Date, status: ContentSuggestion["status"] = "sent"): ContentSuggestion => ({
  id: 1,
  network: "instagram",
  format: "reel",
  idea: "Idea",
  script: [],
  captionHint: "Texto",
  audioHint: null,
  publishAt: publishAt.toISOString(),
  sourceTrendIds: [],
  status,
  sentAt: null,
});

describe("isCurrentSuggestion (#178)", () => {
  it("una idea de hoy sigue vigente aunque su hora haya pasado", () => {
    expect(isCurrentSuggestion(suggestion(new Date(2026, 10, 9, 15, 0)), NOW)).toBe(true);
  });

  it("una idea de un dia pasado ya no esta vigente", () => {
    expect(isCurrentSuggestion(suggestion(new Date(2026, 10, 8, 15, 0)), NOW)).toBe(false);
  });

  it("descartada o publicada no esta vigente", () => {
    const tomorrow = new Date(2026, 10, 10, 15, 0);
    expect(isCurrentSuggestion(suggestion(tomorrow, "dismissed"), NOW)).toBe(false);
    expect(isCurrentSuggestion(suggestion(tomorrow, "published"), NOW)).toBe(false);
    expect(isCurrentSuggestion(suggestion(tomorrow, "pending"), NOW)).toBe(true);
  });
});

describe("countNewSuggestions (#178)", () => {
  it("solo cuenta las enviadas sin abrir de hoy en adelante", () => {
    const today = new Date(2026, 10, 9, 15, 0);
    expect(
      countNewSuggestions(
        [
          suggestion(new Date(2026, 10, 2, 15, 0)),
          suggestion(today),
          suggestion(today, "opened"),
          suggestion(new Date(2026, 10, 10, 15, 0), "pending"),
        ],
        NOW
      )
    ).toBe(1);
  });
});
