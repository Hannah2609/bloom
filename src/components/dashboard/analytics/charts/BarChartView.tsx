"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart/chart";
import type { QuestionAnalytics } from "@/types/analytics";

// Brug CSS variabler fra Tailwind palette
const COLORS = [
  "var(--color-analytics-red)", // Rating 1 - Red
  "var(--color-analytics-amber)", // Rating 2 - Amber
  "var(--color-analytics-yellow)", // Rating 3 - Yellow
  "var(--color-analytics-lime)", // Rating 4 - Lime
  "var(--color-analytics-green)", // Rating 5 - Green
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

export function BarChartView({ data }: { data: QuestionAnalytics }) {
  const labels = LABELS[data.answerType];

  const chartData = data.distribution.map((d) => ({
    rating: labels[d.rating - 1],
    count: d.count,
    percentage: d.percentage,
    fill: COLORS[d.rating - 1],
  }));

  const chartConfig = chartData.reduce(
    (acc, item) => {
      acc[item.rating] = {
        label: item.rating,
        color: item.fill,
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>
  );

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="rating"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            label={{ value: "Responses", angle: -90, position: "insideLeft" }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="count" fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
