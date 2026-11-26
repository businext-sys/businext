import { NextRequest } from "next/server";
import { proxyLoyalty } from "@/lib/loyalty/proxy";

type Params = { params: Promise<{ path: string[] }> };

// Página pública de reservas: si el negocio tiene la tarjeta de fidelidad activa. Sin auth.
export async function GET(request: NextRequest, { params }: Params) {
  const { path } = await params;
  return proxyLoyalty(request, path, { base: "/public/loyalty", authenticated: false });
}
