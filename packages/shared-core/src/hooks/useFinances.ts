"use client";
import useSWR from "swr";
import type { Finances, AnualBalances } from "../finances";
import { financesApi } from "../api/financesApi";

const SWR_KEY = "/api/finances";

/**
 * year — when provided, also fetches annual balance data for that year via SWR.
 * Omit it in components that only need CRUD (modals, list items).
 */
export function useFinances(year?: number) {
  const {
    data: financesData = [],
    isLoading: loading,
    error,
    mutate,
  } = useSWR<Finances[]>(SWR_KEY, () => financesApi.list());

  const { data: anualFinancesData = [] } = useSWR<AnualBalances[]>(
    year ? `/api/finances/anual/${year}` : null,
    year ? () => financesApi.listAnual(year) : null
  );

  const getAllFinances = () => mutate();

  const createFinance = async (
    newFinance: Omit<Finances, "id">
  ): Promise<Finances | null> => {
    const tempId = -Date.now();
    const optimisticItem: Finances = { ...newFinance, id: tempId };
    try {
      await mutate(
        async (current: Finances[] = []) => {
          const created = await financesApi.create(newFinance);
          return [...current.filter((f) => f.id !== tempId), created];
        },
        {
          optimisticData: (current: Finances[] = []) => [...current, optimisticItem],
          rollbackOnError: true,
          revalidate: false,
        }
      );
      return optimisticItem;
    } catch {
      return null;
    }
  };

  const deleteFinance = async (id: number): Promise<void> => {
    await mutate(
      async (current: Finances[] = []) => {
        await financesApi.remove(id);
        return current.filter((f) => f.id !== id);
      },
      {
        optimisticData: (current: Finances[] = []) =>
          current.filter((f) => f.id !== id),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  };

  const updateFinance = async (finance: Finances): Promise<true | null> => {
    const { id, ...updateData } = finance;
    try {
      await mutate(
        async (current: Finances[] = []) => {
          const updated = await financesApi.update(finance);
          return current.map((f) => (f.id === id ? updated : f));
        },
        {
          optimisticData: (current: Finances[] = []) =>
            current.map((f) => (f.id === id ? { ...f, ...updateData, id } : f)),
          rollbackOnError: true,
          revalidate: false,
        }
      );
      return true;
    } catch {
      return null;
    }
  };

  return {
    financesData,
    anualFinancesData,
    loading,
    error,
    getAllFinances,
    createFinance,
    deleteFinance,
    updateFinance,
  };
}
