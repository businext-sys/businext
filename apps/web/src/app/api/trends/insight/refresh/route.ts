import { proxyTrends } from "@/lib/trends/proxy";

export async function POST() {
  return proxyTrends("/insight/refresh", "POST");
}
