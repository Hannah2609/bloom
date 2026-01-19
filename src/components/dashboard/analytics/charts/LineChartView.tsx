"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart/chart";
import { useIsMobile } from "@/hooks/useMobile";

export type ChartDataPoint = {
  week: string;
  weekStart: string;
  [key: string]: string | number; // Allow dynamic keys for company/teams
};

interface LineChartViewProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  showCompany?: boolean;
  showTeams?: Array<{ id: string; name: string }>;
  selectedTeamId?: string | null;
  getTeamColor?: (index: number) => string;
}

export function LineChartView({
  data,
  config,
  showCompany = false,
  showTeams = [],
  selectedTeamId = null,
  getTeamColor,
}: LineChartViewProps) {
  const isMobile = useIsMobile();

  return (
    <ChartContainer config={config} className="h-[250px] w-full">
      <LineChart
        data={data}
        margin={
          isMobile
            ? { top: 5, right: 5, bottom: 5, left: -15 }
            : { top: 5, right: 5, bottom: 5, left: 5 }
        }
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="week"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value.replace(/^Week\s+/i, "")}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          domain={[0, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tick={{ fontSize: 12 }}
          width={isMobile ? 30 : 60}
          label={
            !isMobile
              ? {
                  value: "Happiness Score",
                  angle: -90,
                  position: "insideLeft",
                }
              : undefined
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
              formatter={(value, name, item) => {
                const key = item?.dataKey || name || "value";
                const itemConfig = config[key as string];
                const color =
                  itemConfig?.color || item?.color || item?.payload?.fill;

                // For single team view, show simpler format
                if (!showCompany && showTeams.length === 0 && key === "team") {
                  return [
                    <span
                      key="value"
                      className="font-mono font-medium tabular-nums"
                    >
                      {Number(value).toFixed(2)} / 5.0
                    </span>,
                    "",
                  ];
                }

                return (
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-muted-foreground">
                      {itemConfig?.label || name}:
                    </span>
                    <span className="font-mono font-medium tabular-nums">
                      {Number(value).toFixed(2)} / 5.0
                    </span>
                  </div>
                );
              }}
            />
          }
        />
        {showCompany || showTeams.length > 0 ? (
          <Legend content={<ChartLegendContent />} />
        ) : null}
        {showCompany && config.company && (
          <Line
            type="monotone"
            dataKey="company"
            stroke={config.company.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        )}
        {showTeams.length > 0 &&
          (selectedTeamId
            ? showTeams
                .filter((t) => t.id === selectedTeamId)
                .map((team) => (
                  <Line
                    key={team.id}
                    type="monotone"
                    dataKey={team.name}
                    stroke={
                      config[team.name]?.color ||
                      (getTeamColor ? getTeamColor(0) : "#000")
                    }
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                ))
            : showTeams.map((team, index) => (
                <Line
                  key={team.id}
                  type="monotone"
                  dataKey={team.name}
                  stroke={
                    config[team.name]?.color ||
                    (getTeamColor ? getTeamColor(index) : "#000")
                  }
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )))}
        {/* Single line for team-only view */}
        {!showCompany && showTeams.length === 0 && config.team && (
          <Line
            type="monotone"
            dataKey="team"
            stroke={config.team.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        )}
      </LineChart>
    </ChartContainer>
  );
}
