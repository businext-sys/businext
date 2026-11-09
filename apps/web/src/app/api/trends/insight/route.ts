import { proxyTrends } from "@/lib/trends/proxy";

export async function GET() {
  return proxyTrends("/insight");
}
