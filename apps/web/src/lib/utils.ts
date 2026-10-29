import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
];
