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

const COLORS = [
  "#dc2626", // Rating 1 - Red
  "#f59e0b", // Rating 2 - Amber
  "#fbbf24", // Rating 3 - Yellow
  "#a3e635", // Rating 4 - Lime
  "#22c55e", // Rating 5 - Green
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
