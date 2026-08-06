"use client";
import useSWR from "swr";
import type { WeeklySummaryData } from "../intelligence";
import { weeklySummaryApi } from "../api/weeklySummaryApi";

const SWR_KEY = "/api/intelligence/summary";

export function useWeeklySummary() {
  const {
    data: summary,
    isLoading: loading,
    error,
    mutate,
  } = useSWR<WeeklySummaryData>(SWR_KEY, () => weeklySummaryApi.get());

  const generateSummary = async (): Promise<WeeklySummaryData | null> => {
    const data = await weeklySummaryApi.generate();
    await mutate(data, { revalidate: false });
    return data;
  };

  return { summary, loading, error, generateSummary, mutate };
}
