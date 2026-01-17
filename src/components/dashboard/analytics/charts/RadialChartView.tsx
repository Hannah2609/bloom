"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart/chart";

interface RadialChartViewProps {
  score: number;
  maxScore?: number;
}

export function RadialChartView({
  score,
  maxScore = 5.0,
}: RadialChartViewProps) {
  // Determine color based on score (rating-based colors)
  const getScoreColor = (score: number): string => {
    if (score < 1.5) {
      return "var(--color-analytics-red)"; // Rating 1
    } else if (score < 2.5) {
      return "var(--color-analytics-amber)"; // Rating 2
    } else if (score < 3.5) {
      return "var(--color-analytics-yellow)"; // Rating 3
    } else if (score < 4.5) {
      return "var(--color-analytics-lime)"; // Rating 4
    } else {
      return "var(--color-analytics-green)"; // Rating 5
    }
  };

  // Create chart data - filled portion and remaining portion
  const chartData = [
    {
      name: "score",
      filled: score,
      remaining: maxScore - score,
    },
  ];

  const chartConfig = {
    filled: {
      label: "Happiness Score",
      color: getScoreColor(score),
    },
    remaining: {
      label: "",
      color: "var(--color-muted-foreground)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[200px]"
    >
      <RadialBarChart
        data={chartData}
        endAngle={180}
        innerRadius={80}
        outerRadius={130}
      >
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {score.toFixed(2)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground text-sm"
                    >
                      / {maxScore.toFixed(1)}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="filled"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-filled)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="remaining"
          fill="var(--color-remaining)"
          fillOpacity={0.15}
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
          isAnimationActive={false}
        />
      </RadialBarChart>
    </ChartContainer>
  );
}

