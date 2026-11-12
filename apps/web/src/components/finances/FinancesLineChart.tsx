import { AnualBalances, monthOptions } from "@/lib/finances/types";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useThemeMode } from "@/hooks/useThemeMode";
import { darkChartOptions, paletteColor } from "@/lib/chartjs-dark-theme";
import { colorToken, withAlpha } from "@/lib/theme-tokens";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FinancesChartLegend } from "@/components/finances/FinancesChartLegend";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const FinancesLineChart = ({
  financesData,
  year,
}: {
  financesData: AnualBalances[];
  year: number;
}) => {
  const yearBalance = financesData.reduce((sum, item) => sum + item.balance, 0);
  useThemeMode();
  const baseOptions = darkChartOptions();
  const seriesColor = paletteColor(0);

  const data = {
    labels: financesData.map((item) => monthOptions[item.month - 1]),
    datasets: [
      {
        label: "Balance por Mes (€)",
        data: financesData.map((item) => item.balance),
        borderColor: seriesColor,
        backgroundColor: withAlpha(seriesColor, 0.1),
        pointBackgroundColor: seriesColor,
        pointBorderColor: colorToken("surface"),
        pointHoverBackgroundColor: colorToken("foreground"),
        pointHoverBorderColor: seriesColor,
        tension: 0.4,
        fill: true,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="font-heading text-h4 font-semibold text-foreground">
          Balance por mes
        </h2>
        <p className="text-caption text-foreground-muted">Año {year}</p>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px]">
          <Line
            data={data}
            options={{
              ...baseOptions,
              plugins: {
                ...baseOptions.plugins,
                legend: { display: false },
                title: { display: false },
              },
              scales: {
                ...baseOptions.scales,
                y: {
                  ...baseOptions.scales.y,
                  ticks: {
                    ...baseOptions.scales.y.ticks,
                    callback: function (value: string | number) {
                      return "€ " + value;
                    },
                  },
                },
              },
            }}
          />
        </div>
        <FinancesChartLegend
          items={[
            {
              label: "Balance del año",
              value: `${yearBalance.toLocaleString("es-ES")}€`,
              color: seriesColor,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
