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

export function BarChartView({ data }: { data: QuestionAnalytics }) {
  const chartData = data.distribution.map((d) => ({
    rating: `${d.rating}`,
    count: d.count,
    percentage: d.percentage,
  }));

  const chartConfig = {
    count: {
      label: "Responses",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="rating"
            tickLine={false}
            axisLine={false}
            label={{ value: "Rating", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            label={{ value: "Responses", angle: -90, position: "insideLeft" }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
