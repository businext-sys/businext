"use client";
import useSWR from "swr";
import type { LocationData, LocationCreate, LocationUpdate } from "../location";
import { locationApi } from "../api/locationApi";

export function useLocations() {
  const { data, error, isLoading, mutate } = useSWR<LocationData[]>(
    "/api/locations",
    () => locationApi.list(),
    { dedupingInterval: 60_000 }
  );

  const createLocation = async (input: LocationCreate): Promise<LocationData | null> => {
    try {
      const created = await locationApi.create(input);
      await mutate();
      return created;
    } catch {
      return null;
    }
  };

  const updateLocation = async (
    id: number,
    input: LocationUpdate
  ): Promise<LocationData | null> => {
    try {
      const updated = await locationApi.update(id, input);
      await mutate();
      return updated;
    } catch {
      return null;
    }
  };

  const deleteLocation = async (id: number): Promise<boolean> => {
    try {
      await locationApi.remove(id);
      await mutate();
      return true;
    } catch {
      return false;
    }
  };

  return {
    locations: data ?? [],
    loading: isLoading,
    error,
    createLocation,
    updateLocation,
    deleteLocation,
    mutate,
  };
}
