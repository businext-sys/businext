export type Finances = {
  id?: number;
  concept: string;
  amount: number;
  type: string;
  creator: string;
  created_at?: string;
  reservation_id?: number | null;
  product_id?: number | null;
  customer_name?: string | null;
  commission_rate?: number;
  commission_amount?: number;
};

export const FinancesTypeOptions = {
  INCOME: "Ingreso",
  EXPENSE: "Gasto",
};

export const FinanceBalanceType = {
  income: "Total Ingresos",
  expense: "Total Gastos",
  balance: "Balance General",
} as const;

export type AnualBalances = {
  month: number;
  balance: number;
};

export const ChartsColors = [
  "#6366f1", // Indigo
  "#06b6d4", // Cyan
  "#f59e42", // Orange
  "#10b981", // Emerald
  "#f43f5e", // Rose
  "#a21caf", // Purple
  "#fbbf24", // Amber
  "#0ea5e9", // Sky
  "#eab308", // Yellow
  "#14b8a6", // Teal
];

export const monthOptions = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
