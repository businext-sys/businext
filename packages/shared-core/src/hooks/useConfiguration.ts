"use client";
import useSWR from "swr";
import type { Configuration } from "../configuration";
import { configurationApi } from "../api/configurationApi";

const SWR_KEY = "/api/configuration";

export function useConfiguration() {
  const {
    data: configurationData = [],
    isLoading: loading,
    error,
    mutate,
  } = useSWR<Configuration[]>(SWR_KEY, () => configurationApi.list());

  const getAllConfigurations = () => mutate();

  const createConfiguration = async (
    newConfiguration: Omit<Configuration, "id">
  ): Promise<Configuration | null> => {
    const optimistic: Configuration = { ...newConfiguration, id: -1 };
    try {
      await mutate(
        async (current: Configuration[] = []) => {
          const created = await configurationApi.create(newConfiguration);
          return [...current.filter((c) => c.id !== -1), created];
        },
        {
          optimisticData: (current: Configuration[] = []) => [
            ...current,
            optimistic,
          ],
          rollbackOnError: true,
          revalidate: false,
        }
      );
      return optimistic;
    } catch {
      return null;
    }
  };

  const deleteConfiguration = async (id: number) => {
    try {
      await mutate(
        async (current: Configuration[] = []) => {
          await configurationApi.remove(id);
          return current.filter((c) => c.id !== id);
        },
        {
          optimisticData: (current: Configuration[] = []) =>
            current.filter((c) => c.id !== id),
          rollbackOnError: true,
          revalidate: false,
        }
      );
    } catch {
      return null;
    }
  };

  const updateConfiguration = async (
    configuration: Configuration
  ): Promise<true | null> => {
    const { id, ...updateData } = configuration;
    try {
      await mutate(
        async (current: Configuration[] = []) => {
          const updated = await configurationApi.update(configuration);
          return current.map((c) => (c.id === id ? updated : c));
        },
        {
          optimisticData: (current: Configuration[] = []) =>
            current.map((c) => (c.id === id ? { ...c, ...updateData } : c)),
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
    configurationData,
    loading,
    error,
    getAllConfigurations,
    createConfiguration,
    deleteConfiguration,
    updateConfiguration,
  };
}
