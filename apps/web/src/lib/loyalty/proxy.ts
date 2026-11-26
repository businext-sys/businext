import { NextRequest, NextResponse } from "next/server";
import { getVerifiedServerAccessToken } from "@/lib/auth/server-session";

const ERROR = "Error con la tarjeta de fidelidad";
const SEGMENT = /^[A-Za-z0-9._-]+$/;

/**
 * Proxy de la tarjeta de fidelidad hacia el backend con la misma ruta:
 * `/api/loyalty/*` → `/loyalty/*` (con la sesión) y
 * `/api/public/loyalty/*` → `/public/loyalty/*` (sin auth). Así
 * `loyaltyApi` (shared-core) usa las mismas rutas en web y en mobile.
 */
export async function proxyLoyalty(
  request: NextRequest,
  segments: string[],
  { base, authenticated }: { base: "/loyalty" | "/public/loyalty"; authenticated: boolean }
) {
  if (segments.some((s) => !SEGMENT.test(s) || s === "." || s === "..")) {
    return NextResponse.json({ error: "Ruta no válida" }, { status: 400 });
  }
  const path = `${base}/${segments.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authenticated) {
      const auth = await getVerifiedServerAccessToken();
      if ("error" in auth) return auth.error;
      headers.Authorization = `Bearer ${auth.jwt}`;
    }
    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const body = hasBody ? await request.text() : "";
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
      method: request.method,
      headers,
      ...(body ? { body } : {}),
      cache: "no-store",
    });
    const data = response.headers.get("content-type")?.includes("application/json")
      ? await response.json()
      : { error: await response.text() };
    if (!response.ok) {
      const detail = typeof data.detail === "string" ? data.detail : data.error || ERROR;
      return NextResponse.json({ detail, error: detail }, { status: response.status });
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`${ERROR} (${request.method} ${path}):`, error);
    return NextResponse.json({ error: ERROR }, { status: 500 });
  }
}
