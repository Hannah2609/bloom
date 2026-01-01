"use client";

import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart/chart";
import type { QuestionAnalytics } from "@/types/analytics";

export function RadialChartView({ data }: { data: QuestionAnalytics }) {
  // Convert average (1-5) to percentage (0-100)
  const percentage = (data.average / 5) * 100;

  const chartData = [
    {
      name: "Average Rating",
      value: percentage,
      fill: "hsl(var(--primary))",
    },
  ];

  const chartConfig = {
    value: {
      label: "Rating",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
            fill="var(--color-value)"
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground text-4xl font-bold"
          >
            {data.average.toFixed(2)}
          </text>
          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-sm"
          >
            out of 5
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
