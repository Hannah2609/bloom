"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart/chart";
import type { QuestionAnalytics } from "@/types/analytics";

const COLORS = [
  "hsl(var(--destructive))", // Rating 1 - Red
  "hsl(var(--orange))", // Rating 2 - Orange
  "hsl(var(--warning))", // Rating 3 - Yellow
  "hsl(var(--success))", // Rating 4 - Light Green
  "hsl(var(--primary))", // Rating 5 - Primary Green
];

export function PieChartView({ data }: { data: QuestionAnalytics }) {
  const chartData = data.distribution
    .filter((d) => d.count > 0) // Only show ratings with responses
    .map((d) => ({
      name: `Rating ${d.rating}`,
      value: d.count,
      percentage: d.percentage,
    }));

  const chartConfig = chartData.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: COLORS[index] || "hsl(var(--primary))",
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }) => `${percentage.toFixed(1)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
