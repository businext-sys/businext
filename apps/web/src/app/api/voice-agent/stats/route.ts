import { NextRequest } from "next/server";
import { proxyVoiceAgent } from "@/lib/voice-agent/proxy";

// KPIs de las llamadas del agente de voz (`?days=`).
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();
  return proxyVoiceAgent(`/stats${query ? `?${query}` : ""}`);
}
