// components/dashboard/analytics/QuestionAnalyticsCard.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import { BarChart3, PieChart, ActivitySquare } from "lucide-react";
import { BarChartView } from "./charts/BarChartView";
import { PieChartView } from "./charts/PieChartView";
import { RadialChartView } from "./charts/RadialChartView";
import type { QuestionAnalytics, ChartType } from "@/types/analytics";

interface QuestionAnalyticsCardProps {
  data: QuestionAnalytics;
}

export function QuestionAnalyticsCard({ data }: QuestionAnalyticsCardProps) {
  const [chartType, setChartType] = useState<ChartType>("bar");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg">{data.title}</CardTitle>
            {data.description && (
              <p className="text-sm text-muted-foreground">
                {data.description}
              </p>
            )}
          </div>

          {/* Chart Type Selector */}
          <div className="flex gap-1 shrink-0">
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="icon"
              onClick={() => setChartType("bar")}
              title="Bar Chart"
            >
              <BarChart3 className="size-4" />
            </Button>
            <Button
              variant={chartType === "pie" ? "default" : "outline"}
              size="icon"
              onClick={() => setChartType("pie")}
              title="Pie Chart"
            >
              <PieChart className="size-4" />
            </Button>
            <Button
              variant={chartType === "radial" ? "default" : "outline"}
              size="icon"
              onClick={() => setChartType("radial")}
              title="Radial Chart"
            >
              <ActivitySquare className="size-4" />
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex gap-6 text-sm pt-2">
          <div>
            <span className="text-muted-foreground">Average: </span>
            <span className="font-bold text-lg">{data.average.toFixed(2)}</span>
            <span className="text-muted-foreground"> / 5</span>
          </div>
          <div>
            <span className="text-muted-foreground">Responses: </span>
            <span className="font-semibold">{data.responseCount}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Render selected chart type */}
        {chartType === "bar" && <BarChartView data={data} />}
        {chartType === "pie" && <PieChartView data={data} />}
        {chartType === "radial" && <RadialChartView data={data} />}
      </CardContent>
    </Card>
  );
}
