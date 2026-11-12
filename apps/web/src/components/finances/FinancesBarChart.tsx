import { Finances } from "@/lib/finances/types";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useThemeMode } from "@/hooks/useThemeMode";
import { darkChartOptions, paletteColor } from "@/lib/chartjs-dark-theme";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FinancesChartLegend } from "@/components/finances/FinancesChartLegend";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const FinancesBarChart = ({
  financesData,
  period,
}: {
  financesData: Finances[];
  period: string;
}) => {
  const createDataSet = (financesArray: Finances[]) => {
    const getIncomes = financesArray
      .filter((item) => item.type === "INCOME")
      .reduce((acc: Record<string, number>, item: Finances) => {
        acc[item.concept] = (acc[item.concept] || 0) + item.amount;
        return acc;
      }, {});

    const dataset = Object.keys(getIncomes).map((key) => {
      return {
        label: key,
        amount: getIncomes[key],
      };
    });

    return dataset;
  };
  const dataset = createDataSet(financesData);
  const hasIncomes = dataset.length > 0;
  useThemeMode();
  const baseOptions = darkChartOptions();

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="font-heading text-h4 font-semibold text-foreground">
          Ingresos por servicio
        </h2>
        <p className="text-caption text-foreground-muted">{period}</p>
      </CardHeader>
      <CardContent>
        {hasIncomes ? (
          <>
            <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px]">
              <Bar
                data={{
                  labels: dataset.map((data: { label: string }) => data.label),
                  datasets: [
                    {
                      label: "Total Ingresos (€)",
                      data: dataset.map(
                        (data: { amount: number }) => data.amount
                      ),
                      backgroundColor: dataset.map((_, i: number) =>
                        paletteColor(i)
                      ),
                      borderRadius: 8,
                      borderSkipped: false,
                      borderWidth: 0,
                      hoverBackgroundColor: dataset.map((_, i: number) =>
                        paletteColor(i + 2)
                      ),
                      barPercentage: 0.7,
                      categoryPercentage: 0.6,
                    },
                  ],
                }}
                options={{
                  ...baseOptions,
                  plugins: {
                    ...baseOptions.plugins,
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    ...baseOptions.scales,
                    x: {
                      ...baseOptions.scales.x,
                      ticks: { display: false },
                    },
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
              items={dataset.map((data, i) => ({
                label: data.label,
                value: `${data.amount.toLocaleString("es-ES")}€`,
                color: paletteColor(i),
              }))}
            />
          </>
        ) : (
          <p className="py-8 text-center text-body-sm text-foreground-muted">
            Sin ingresos en {period}.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
