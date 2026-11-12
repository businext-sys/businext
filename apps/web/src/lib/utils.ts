import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Sin esto tailwind-merge toma los tamaños de `--text-*` de globals.css por colores y descarta el color del texto.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["h1", "h2", "h3", "h4", "body", "body-sm", "caption", "label"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const routesWithoutHeader = [
  "/",
  "/en",
  "/login",
  "/login/verify",
  "/resetpassword",
  "/employee/onboarding",
  "/payment",
  "/paymentredirection",
];

export const authOnlyRoutes = [
  "/payment",
  "/paymentredirection",
  "/employee/onboarding",
];

export const publicRoutes = [
  "/",
  "/en",
  "/login",
  "/login/verify",
  "/auth/confirm",
  "/resetpassword",
  "/error",
  "/privacidad",
  "/eliminar-cuenta",
];
