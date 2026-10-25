import { NextResponse, NextRequest } from "next/server";
import { getVerifiedServerAccessToken } from "@/lib/auth/server-session";

// Configuracion del agente de voz (issue #118): proxy de
// GET/PATCH /voice-agent/config. El backend solo la permite al owner (403).
async function proxy(method: "GET" | "PATCH", body?: unknown) {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
    const auth = await getVerifiedServerAccessToken();
    if ("error" in auth) return auth.error;
    const jwt = auth.jwt;
    const response = await fetch(`${API_BASE}/voice-agent/config`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    let data;
    if (response.headers.get("content-type")?.includes("application/json")) {
      data = await response.json();
    } else {
      data = { error: await response.text() };
    }
    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || data.error || "Error con la configuración del agente de voz" },
        { status: response.status }
      );
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error con la configuración del agente de voz:", error);
    return NextResponse.json(
      { error: "Error con la configuración del agente de voz" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return proxy("GET");
}

export async function PATCH(request: NextRequest) {
  return proxy("PATCH", await request.json());
}
