import { NextRequest } from "next/server";
import { proxyCustomerMessages } from "@/lib/customer-messages/proxy";

export async function POST(request: NextRequest) {
  return proxyCustomerMessages("/", "POST", await request.json());
}
