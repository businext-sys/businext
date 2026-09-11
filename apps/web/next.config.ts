import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // La raiz de tracing debe ser la raiz del monorepo pnpm: las dependencias
  // estan hoisteadas en <root>/node_modules/.pnpm, no dentro de apps/web.
  // Con __dirname (apps/web) el tracer no encontraba modulos como
  // `next/dist/compiled/source-map`, y las server actions crasheaban en
  // runtime con "Cannot find module next/dist/compiled/source-map" (500).
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // Fuerza la inclusion del modulo compilado de source-map que el tracer de
  // Next 15.5.x omite en el bundle serverless (bug de empaquetado). Sin esto,
  // cualquier server action (p. ej. el login) devuelve 500.
  outputFileTracingIncludes: {
    "/**": ["../../node_modules/next/dist/compiled/source-map/**"],
  },
  allowedDevOrigins: ["192.168.1.*"],
  // Permite que Next.js transpile el codigo fuente TS de @businext/shared-core
  // (paquete de workspace pnpm sin build propio, ver packages/shared-core).
  transpilePackages: ["@businext/shared-core"],
  // Imágenes externas permitidas - Necesario para Stripe y Supabase
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.stripe.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // Configuración de TypeScript y ESLint
  typescript: {
    ignoreBuildErrors: false, // Mantenemos los chequeos de TypeScript activos
  },
  eslint: {
    ignoreDuringBuilds: false, // Mantenemos los chequeos de ESLint activos
  },
};

export default nextConfig;
