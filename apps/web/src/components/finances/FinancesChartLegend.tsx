import React from "react";

export type FinancesChartLegendItem = {
  label: string;
  value: string;
  color: string;
};

export const FinancesChartLegend = ({
  items,
}: {
  items: FinancesChartLegendItem[];
}) => {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex min-w-0 items-center gap-2 text-caption"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="truncate text-foreground-muted">{item.label}</span>
          <span className="font-semibold text-foreground">{item.value}</span>
        </li>
      ))}
    </ul>
  );
};
