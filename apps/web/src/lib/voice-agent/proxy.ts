import { NextResponse } from "next/server";
import { getVerifiedServerAccessToken } from "@/lib/auth/server-session";

const ERROR = "Error con el agente de voz";

export async function proxyVoiceAgent(
  path: string,
  method: "GET" | "PATCH" = "GET",
  body?: unknown
) {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
    const auth = await getVerifiedServerAccessToken();
    if ("error" in auth) return auth.error;
    const jwt = auth.jwt;
    const response = await fetch(`${API_BASE}/voice-agent${path}`, {
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
        { error: data.detail || data.error || ERROR },
        { status: response.status }
      );
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`${ERROR} (${method} ${path}):`, error);
    return NextResponse.json({ error: ERROR }, { status: 500 });
  }
}
