import { NextRequest } from "next/server";
import { proxyCustomerMessages } from "@/lib/customer-messages/proxy";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email") ?? "";
  return proxyCustomerMessages(`/draft?email=${encodeURIComponent(email)}`);
}
