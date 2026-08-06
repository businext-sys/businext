"use client";
import useSWR, { useSWRConfig } from "swr";
import type { Reservation } from "../reservation";
import { reservationApi } from "../api/reservationApi";

const SWR_KEY = "/api/reservations";

export function useReservation() {
  const { mutate: globalMutate } = useSWRConfig();
  const {
    data: reservationData = [],
    isLoading: loading,
    error,
    mutate,
  } = useSWR<Reservation[]>(SWR_KEY, () => reservationApi.list());

  const getAllReservations = () => mutate();

  const createReservation = async (
    newReservation: Omit<Reservation, "id">
  ): Promise<Reservation | null> => {
    const tempId = -Date.now();
    const optimisticItem: Reservation = { ...(newReservation as Reservation), id: tempId };
    let created: Reservation | null = null;
    try {
      await mutate(
        async (current: Reservation[] = []) => {
          created = await reservationApi.create(newReservation);
          return [...current.filter((r) => r.id !== tempId), created];
        },
        {
          optimisticData: (current: Reservation[] = []) => [...current, optimisticItem],
          rollbackOnError: true,
          revalidate: false,
        }
      );
      return created;
    } catch {
      return null;
    }
  };

  const deleteReservation = async (id: number): Promise<void> => {
    try {
      await mutate(
        async (current: Reservation[] = []) => {
          await reservationApi.remove(id);
          return current.filter((r) => r.id !== id);
        },
        {
          optimisticData: (current: Reservation[] = []) =>
            current.filter((r) => r.id !== id),
          rollbackOnError: true,
          revalidate: false,
        }
      );
    } catch {
      // SWR rollback restores previous state
    }
  };

  const updateReservation = async (
    reservation: Reservation
  ): Promise<Reservation | null> => {
    try {
      await mutate(
        async (current: Reservation[] = []) => {
          const updated = await reservationApi.update(reservation);
          return current.map((r) => (r.id === reservation.id ? updated : r));
        },
        {
          optimisticData: (current: Reservation[] = []) =>
            current.map((r) => (r.id === reservation.id ? reservation : r)),
          rollbackOnError: true,
          revalidate: false,
        }
      );
      return reservation;
    } catch {
      return null;
    }
  };

  const revertReservation = async (id: number): Promise<boolean> => {
    try {
      await mutate(
        async (current: Reservation[] = []) => {
          const updated = await reservationApi.revert(id);
          return current.map((r) => (r.id === id ? updated : r));
        },
        {
          optimisticData: (current: Reservation[] = []) =>
            current.map((r) => (r.id === id ? { ...r, status: "PENDING" } : r)),
          rollbackOnError: true,
          revalidate: false,
        }
      );
      // Revalidate finances since revert deletes the linked finance record
      globalMutate("/api/finances");
      return true;
    } catch {
      return false;
    }
  };

  return {
    reservationData,
    loading,
    error,
    getAllReservations,
    createReservation,
    deleteReservation,
    updateReservation,
    revertReservation,
  };
}
