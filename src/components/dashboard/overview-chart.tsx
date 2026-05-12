"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Sample data — replace with real query results.
const data = Array.from({ length: 14 }).map((_, i) => {
  const day = new Date(Date.now() - (13 - i) * 86400_000);
  const triggers = Math.round(40 + Math.sin(i / 2) * 18 + Math.random() * 16);
  const dms = Math.max(0, triggers - Math.round(Math.random() * 4));
  return {
    label: day.toLocaleDateString("en", { month: "short", day: "numeric" }),
    triggers,
    dms,
  };
});

export function OverviewChart() {
  return (
    <div className="h-72 -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="triggers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="dms" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="rgba(255,255,255,0.3)"
            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.45)" }}
            tickLine={false}
            axisLine={false}
            interval={1}
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.45)" }}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.08)" }}
            contentStyle={{
              background: "#0c0c0c",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              fontSize: 12,
              padding: "8px 10px",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.6)", marginBottom: 4 }}
            itemStyle={{ color: "white" }}
          />
          <Area
            dataKey="triggers"
            type="monotone"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth={1.5}
            fill="url(#triggers)"
          />
          <Area
            dataKey="dms"
            type="monotone"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1.5}
            fill="url(#dms)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
