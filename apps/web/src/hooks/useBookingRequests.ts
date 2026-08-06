"use client";

import useSWR from "swr";
import { BookingRequest } from "@/lib/booking-request/types";
import { fetcher } from "@/lib/fetcher";
import { mapBookingRequestFromApi } from "@businext/shared-core";

const SWR_KEY = "/api/booking-requests";

export function useBookingRequests() {
  const {
    data: raw = [],
    isLoading: loading,
    error,
    mutate,
  } = useSWR<Record<string, unknown>[]>(SWR_KEY, fetcher);

  const bookingRequests: BookingRequest[] = raw.map(mapBookingRequestFromApi);

  const acceptRequest = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/booking-requests/${id}/accept`, {
        method: "POST",
      });
      if (!response.ok) return false;
      await mutate();
      return true;
    } catch {
      return false;
    }
  };

  const rejectRequest = async (id: number, reason?: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/booking-requests/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) return false;
      await mutate();
      return true;
    } catch {
      return false;
    }
  };

  return {
    bookingRequests,
    loading,
    error,
    mutate,
    acceptRequest,
    rejectRequest,
  };
}
