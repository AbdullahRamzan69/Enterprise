import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}
import { cn } from "@/lib/utils";

interface TrendDataPoint {
  day: string;
  present: number;
  absent: number;
}

interface AttendanceTrendProps {
  data7d: TrendDataPoint[];
  data30d: TrendDataPoint[];
  totalEmployees: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-xl px-4 py-3 text-sm min-w-[140px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center gap-2 text-xs mb-1 last:mb-0"
        >
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground capitalize">
            {entry.name}:
          </span>
          <span className="font-semibold text-foreground ml-auto">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

type FilterType = "7d" | "30d";

export function AttendanceTrend({
  data7d,
  data30d,
  totalEmployees,
}: AttendanceTrendProps) {
  const [filter, setFilter] = useState<FilterType>("7d");
  const data = filter === "7d" ? data7d : data30d;

  return (
    <div className="bg-card border border-border rounded-2xl">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Attendance Trend
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Employee attendance over the last{" "}
            {filter === "7d" ? "7 days" : "30 days"}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-1">
          {(["7d", "30d"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                filter === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "7d" ? "7 Days" : "30 Days"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-2 pb-6">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="gradAbsent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-border"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-muted-foreground"
              axisLine={false}
              tickLine={false}
              interval={filter === "30d" ? 4 : 0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-muted-foreground"
              axisLine={false}
              tickLine={false}
              domain={[0, Math.max(totalEmployees, 5) + 2]}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="present"
              name="Present"
              stroke="#2563EB"
              strokeWidth={2.5}
              fill="url(#gradPresent)"
              dot={false}
              activeDot={{ r: 5, fill: "#2563EB", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="absent"
              name="Absent"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#gradAbsent)"
              dot={false}
              activeDot={{ r: 4, fill: "#EF4444", strokeWidth: 0 }}
              strokeDasharray="4 2"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="flex items-center gap-6 px-4 mt-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-3 h-0.5 bg-blue-500 rounded inline-block" />
            Present
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="w-3 h-0.5 bg-red-400 rounded inline-block"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, #EF4444 0, #EF4444 4px, transparent 4px, transparent 6px)",
              }}
            />
            Absent
          </div>
        </div>
      </div>
    </div>
  );
}
