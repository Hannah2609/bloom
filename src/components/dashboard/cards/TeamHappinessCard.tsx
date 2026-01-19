"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChartView } from "@/components/dashboard/analytics/charts/LineChartView";
import type { ChartConfig } from "@/components/ui/chart/chart";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { WeeklyHappinessData } from "@/types/analytics";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Get ISO week number from a date
 * ISO 8601: Week 1 is the first week with at least 4 days in the new year
 */
function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

interface TeamHappinessCardProps {
  teamId: string;
  teamName: string;
  initialWeeks?: number;
}

type ChartDataPoint = {
  week: string;
  weekStart: string;
  team: number;
};

export function TeamHappinessCard({
  teamId,
  teamName,
  initialWeeks = 12,
}: TeamHappinessCardProps) {
  const [data, setData] = useState<WeeklyHappinessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeks, setWeeks] = useState(initialWeeks);
  const [viewType, setViewType] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          weeks: weeks.toString(),
          teamId: teamId,
          companyLevel: "false",
          viewType: viewType,
        });

        const res = await fetch(`/api/dashboard/happiness/weekly?${params}`);
        if (res.ok) {
          const result = await res.json();
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching team happiness:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [weeks, teamId, viewType]);

  // Prepare chart data
  const chartData: ChartDataPoint[] = data.map((week) => {
    const date = new Date(week.weekStart);
    const label =
      viewType === "monthly"
        ? format(date, "MMM yyyy")
        : `Week ${getWeekNumber(date)}`;

    // Find team average for this week
    const teamData = week.teamAverages.find((t) => t.teamId === teamId);
    const teamAverage = teamData ? teamData.average : 0;

    return {
      week: label,
      weekStart: week.weekStart,
      team: Number(teamAverage.toFixed(2)),
    };
  });

  // Calculate current average + trend
  const currentAverage =
    data.length > 0
      ? data[data.length - 1]?.teamAverages.find((t) => t.teamId === teamId)
          ?.average || 0
      : 0;
  const previousAverage =
    data.length > 1
      ? data[data.length - 2]?.teamAverages.find((t) => t.teamId === teamId)
          ?.average || 0
      : 0;
  const trend = currentAverage - previousAverage;

  // Check if chartData has meaningful values (not all zeros)
  const hasChartData = chartData.some((point) => point.team > 0);

  // Check if there's actual data to display
  const hasData = data.length > 0 && hasChartData;

  // Chart config
  const chartConfig: ChartConfig = {
    team: {
      label: teamName,
      color: "var(--color-analytics-green)",
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Team Happiness Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't render if there's no data
  if (!hasData) {
    return null;
  }

  return (
    <Card className="to-secondary-50! dark:to-secondary-950/50! min-w-0">
      <CardHeader>
        <div className="space-y-4 min-w-0">
          <CardTitle className="text-2xl font-semibold">
            {viewType === "monthly" ? "Monthly" : "Weekly"} Happiness Analytics
          </CardTitle>
          <div className="flex flex-col pt-4 md:pt-0 xl:flex-row xl:items-start gap-4 text-sm justify-between">
            <div className="flex items-center gap-2">
              {trend > 0 ? (
                <TrendingUp className="size-8 text-primary" />
              ) : (
                <TrendingDown className="size-8 text-primary" />
              )}
              <span className="font-bold text-lg">
                {currentAverage.toFixed(2)}
              </span>
              <span className="text-muted-foreground">/ 5.0</span>
              {trend !== 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={`text-xs cursor-help ${
                        trend > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {trend > 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(2)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {trend > 0 ? "Improvement" : "Decline"} from previous{" "}
                      {viewType === "monthly" ? "month" : "week"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <Select
                value={viewType}
                onValueChange={(value) =>
                  setViewType(value as "weekly" | "monthly")
                }
              >
                <SelectTrigger className="h-9 w-[100px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={weeks.toString()}
                onValueChange={(value) => setWeeks(parseInt(value))}
              >
                <SelectTrigger className="h-9 w-[100px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">
                    {viewType === "monthly" ? "4 months" : "4 weeks"}
                  </SelectItem>
                  <SelectItem value="8">
                    {viewType === "monthly" ? "8 months" : "8 weeks"}
                  </SelectItem>
                  <SelectItem value="12">
                    {viewType === "monthly" ? "12 months" : "12 weeks"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <LineChartView
          data={chartData}
          config={chartConfig}
          showCompany={false}
          showTeams={[]}
        />
      </CardContent>
    </Card>
  );
}
