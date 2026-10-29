import { BigShoulders_900Black } from "@expo-google-fonts/big-shoulders";
import { DMSans_400Regular, DMSans_700Bold } from "@expo-google-fonts/dm-sans";

/** Fuentes de `DESIGN.md`: Big Shoulders para titulares, DM Sans para el texto. */
export const fontAssets = {
  BigShoulders_900Black,
  DMSans_400Regular,
  DMSans_700Bold,
};

export const fonts = {
  display: "BigShoulders_900Black",
  body: "DMSans_400Regular",
  bodyBold: "DMSans_700Bold",
} as const;
