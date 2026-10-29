import { NextRequest } from "next/server";
import { proxyVoiceAgent } from "@/lib/voice-agent/proxy";

// Registro de llamadas del agente de voz: `?id=` es el detalle de una llamada
// (`/voice-agent/calls/{id}`); sin el, el listado con sus filtros.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const id = params.get("id");
  if (id !== null) return proxyVoiceAgent(`/calls/${encodeURIComponent(id)}`);
  const query = params.toString();
  return proxyVoiceAgent(`/calls${query ? `?${query}` : ""}`);
}
