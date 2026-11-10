import { NextResponse, NextRequest } from "next/server";
import { getVerifiedServerAccessToken } from "@/lib/auth/server-session";

// Proxy de GET/PUT /configuration/reminders. El backend solo lo permite a owner y manager (403).
async function proxy(method: "GET" | "PUT", body?: unknown) {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
    const auth = await getVerifiedServerAccessToken();
    if ("error" in auth) return auth.error;
    const jwt = auth.jwt;
    const response = await fetch(`${API_BASE}/configuration/reminders`, {
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
        { error: data.detail || data.error || "Error con el ajuste de recordatorios" },
        { status: response.status }
      );
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error con el ajuste de recordatorios:", error);
    return NextResponse.json(
      { error: "Error con el ajuste de recordatorios" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return proxy("GET");
}

export async function PUT(request: NextRequest) {
  return proxy("PUT", await request.json());
}
