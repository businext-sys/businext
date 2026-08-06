"use client";
import useSWR from "swr";
import type { Employee } from "../employee";
import { employeeApi } from "../api/employeeApi";

const SWR_KEY = "/api/personal-management";

export function useEmployee() {
  const {
    data: employees = [],
    isLoading: loading,
    error,
  } = useSWR<Employee[]>(SWR_KEY, () => employeeApi.list(), {
    revalidateOnFocus: false,
  });

  const activeEmployees = employees.filter((e) => e.status === "active");

  return { employees, activeEmployees, loading, error };
}
