"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart/chart";
import type { QuestionAnalytics } from "@/types/analytics";

// Brug CSS variabler fra Tailwind palette
const COLORS = [
  "var(--color-analytics-red)", // Rating 1 - Deeper Red
  "var(--color-analytics-amber)", // Rating 2 - Amber
  "var(--color-analytics-yellow)", // Rating 3 - Warm Yellow
  "var(--color-analytics-lime)", // Rating 4 - Lime
  "var(--color-analytics-green)", // Rating 5 - Emerald Green
];

const LABELS = {
  SATISFACTION: [
    "Very dissatisfied",
    "Dissatisfied",
    "Neutral",
    "Satisfied",
    "Very satisfied",
  ],
  AGREEMENT: [
    "Strongly disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly agree",
  ],
  SCALE: ["1", "2", "3", "4", "5"],
};

export function PieChartView({ data }: { data: QuestionAnalytics }) {
  const labels = LABELS[data.answerType];

  const chartData = data.distribution
    .filter((d) => d.count > 0) // Only show ratings with responses
    .map((d) => ({
      name: labels[d.rating - 1],
      value: d.count,
      percentage: d.percentage,
      fill: COLORS[d.rating - 1],
    }));

  const chartConfig = chartData.reduce(
    (acc, item) => {
      acc[item.name] = {
        label: item.name,
        color: item.fill,
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>
  );

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
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
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
