import { describe, it, expect } from "vitest";
import { themeColors } from "../../src/theme";
import type { ThemeColors, ThemeMode } from "../../src/theme";

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const textTokens: (keyof ThemeColors)[] = [
  "foreground",
  "foregroundMuted",
  "foregroundSubtle",
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
];
const groundTokens: (keyof ThemeColors)[] = ["background", "surface", "surfaceRaised"];
const fillPairs: [keyof ThemeColors, keyof ThemeColors][] = [
  ["primaryForeground", "primary"],
  ["secondaryForeground", "secondary"],
  ["accentForeground", "accent"],
  ["mutedForeground", "muted"],
  ["successForeground", "success"],
  ["dangerForeground", "danger"],
  ["warningForeground", "warning"],
];

describe.each<ThemeMode>(["dark", "light"])("themeColors.%s", (mode) => {
  const colors = themeColors[mode];

  it.each(textTokens.flatMap((text) => groundTokens.map((ground) => [text, ground])))(
    "%s sobre %s pasa WCAG AA",
    (text, ground) => {
      expect(contrast(colors[text], colors[ground])).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each(fillPairs)("%s sobre %s pasa WCAG AA", (text, fill) => {
    expect(contrast(colors[text], colors[fill])).toBeGreaterThanOrEqual(4.5);
  });
});
