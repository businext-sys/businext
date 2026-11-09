import { NextRequest } from "next/server";
import { proxyTrends } from "@/lib/trends/proxy";

export async function GET() {
  return proxyTrends("/preferences");
}

export async function PUT(request: NextRequest) {
  return proxyTrends("/preferences", "PUT", await request.json());
}
