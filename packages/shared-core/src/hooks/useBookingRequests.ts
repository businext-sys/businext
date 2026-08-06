"use client";
import useSWR from "swr";
import type { BookingRequest } from "../booking-request";
import { bookingRequestApi } from "../api/bookingRequestApi";

const SWR_KEY = "/api/booking-requests";

export function useBookingRequests() {
  const {
    data: bookingRequests = [],
    isLoading: loading,
    error,
    mutate,
  } = useSWR<BookingRequest[]>(SWR_KEY, () => bookingRequestApi.list());

  const acceptRequest = async (id: number): Promise<boolean> => {
    try {
      const ok = await bookingRequestApi.accept(id);
      if (ok) await mutate();
      return ok;
    } catch {
      return false;
    }
  };

  const rejectRequest = async (id: number, reason?: string): Promise<boolean> => {
    try {
      const ok = await bookingRequestApi.reject(id, reason);
      if (ok) await mutate();
      return ok;
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
