import { NextRequest, NextResponse } from "next/server";
import { proxyTrends } from "@/lib/trends/proxy";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();
  return proxyTrends(`/suggestions${query ? `?${query}` : ""}`);
}

// shared-core manda el id como `?id=` (resourcePath) en vez de en la ruta.
export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta el id de la sugerencia" }, { status: 400 });
  return proxyTrends(`/suggestions/${encodeURIComponent(id)}`, "PATCH", await request.json());
}
