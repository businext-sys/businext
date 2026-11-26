import { NextRequest } from "next/server";
import { proxyLoyalty } from "@/lib/loyalty/proxy";

type Params = { params: Promise<{ path: string[] }> };

// Tarjeta de fidelidad (ADR 0003 del backend): regla, tarjetas, sellos, canje, escaneo y logo del pase.
async function handler(request: NextRequest, { params }: Params) {
  const { path } = await params;
  return proxyLoyalty(request, path, { base: "/loyalty", authenticated: true });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
