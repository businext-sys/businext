import { Big_Shoulders, DM_Sans, Sora } from "next/font/google";

export const bigShoulders = Big_Shoulders({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-heading",
  weight: ["700", "800", "900"],
  // next/font no tiene metricas de fallback para Big Shoulders.
  adjustFontFallback: false,
});

export const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

export const sora = Sora({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-landing",
  weight: ["600", "700"],
});
