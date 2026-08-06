import { UseFormRegister } from "react-hook-form";
import type { Finances } from "@businext/shared-core";

export type { Finances };
export {
  FinancesTypeOptions,
  FinanceBalanceType,
  ChartsColors,
  monthOptions,
} from "@businext/shared-core";
export type { AnualBalances } from "@businext/shared-core";

export type FinancesModalProps = {
  isOpen: boolean;
  handleOpenModal: () => void;
  isEmployee?: boolean;
  employeeName?: string;
  employees?: { memberUserId: string; displayName?: string | null; email?: string | null }[];
  currentUserName?: string;
};

export type FinanceRecordItemProps = Finances & { customerName?: string; isEmployee?: boolean };

export const PlaceHoldersFinancesMapping = {
  id: "ID",
  concept: "Concepto",
  amount: "Cuantía",
  type: "Tipo de registro",
  creator: "Emisor",
  created_at: "Fecha de creación",
} as const;

export type FinancesInputProps = {
  label: keyof typeof PlaceHoldersFinancesMapping;
  register: UseFormRegister<Finances>;
  required: boolean;
  disabled?: boolean;
  options?: { [key: string]: string };
  type?: string;
};

export type FinancesDeleteModalProps = {
  id: number;
  concept: string;
  openDeleteModal: boolean;
  handleOpenDeleteModal: () => void;
  deleteFinanceRecord: (id: number) => Promise<void>;
};

export type FinancesBalanceCardProps = {
  type: keyof typeof import("@businext/shared-core").FinanceBalanceType;
  amount: number;
  monthName: string;
  label?: string;
  helperText?: string;
};
