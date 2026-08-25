"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import clsx from "clsx";

interface DataPoint {
  value: number;
  date: string;
}

interface ProgressMetricCardProps {
  title: string;
  data: DataPoint[];
  total?: string;
  delta?: string;
  deltaLabel?: string;
  trend?: "up" | "down" | "flat";
  size?: "sm" | "md" | "lg";
  color?: string;
  showStats?: boolean;
}

const SIZES = {
  sm: { minH: "min-h-[220px]", pad: "px-5 pt-4", title: "text-[13px]", headline: "text-3xl" },
  md: { minH: "min-h-[280px]", pad: "px-6 pt-5", title: "text-[14px]", headline: "text-4xl" },
  lg: { minH: "min-h-[340px]", pad: "px-8 pt-6", title: "text-[15px]", headline: "text-5xl" },
};

export default function ProgressMetricCard({
  title,
  data,
  total,
  delta,
  deltaLabel = "vs last period",
  trend = "up",
  size = "md",
  color = "#3b82f6",
  showStats = true,
}: ProgressMetricCardProps) {
  const [view, setView] = useState<"area" | "bar">("area");
  const sz = SIZES[size];

  const vals = data.map((d) => d.value);
  const sum = vals.reduce((a, b) => a + b, 0);
  const peak = vals.length ? Math.max(...vals) : 0;
  const low = vals.length ? Math.min(...vals) : 0;
  const avg = vals.length ? Math.round(sum / vals.length) : 0;

  const displayTotal = total ?? sum.toLocaleString();
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : ArrowRight;
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-gray-500";

  return (
    <div className={clsx("relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]", sz.minH)}>
      {/* Background gradient */}
      <div className="absolute inset-y-0 right-0 w-[55%]" style={{ background: `linear-gradient(to left, ${color}12, transparent 75%)` }} />

      {/* Content */}
      <div className={clsx("relative z-10 flex flex-1 flex-col", sz.pad)}>
        <div className="flex items-center justify-between">
          <h3 className={clsx("font-semibold tracking-tight text-gray-900", sz.title)}>{title}</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setView("area")} className={clsx("text-[10px] font-medium px-2 py-1 rounded-md transition-colors", view === "area" ? "bg-gray-100 text-gray-700" : "text-gray-400 hover:text-gray-600")}>
              Curve
            </button>
            <button onClick={() => setView("bar")} className={clsx("text-[10px] font-medium px-2 py-1 rounded-md transition-colors", view === "bar" ? "bg-gray-100 text-gray-700" : "text-gray-400 hover:text-gray-600")}>
              Bars
            </button>
          </div>
        </div>

        <div className={clsx("font-medium leading-none tracking-tight text-gray-900 mt-3", sz.headline)}>
          {displayTotal}
        </div>

        {/* Chart */}
        <div className="mt-3 flex-1 min-h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            {view === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${title})`} />
              </AreaChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px" }}
                />
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-gray-100 px-6 py-3 text-[13px]">
        <div className="flex items-center gap-1.5">
          <TrendIcon size={14} className={trendColor} />
          <span className={clsx("font-semibold", trendColor)}>{delta ?? "+12%"}</span>
          <span className="text-gray-400">{deltaLabel}</span>
        </div>
        {showStats && (
          <div className="flex items-center gap-2.5 text-[11px] text-gray-400">
            <span><span className="font-medium text-gray-600">{peak}</span> peak</span>
            <span className="opacity-40">·</span>
            <span><span className="font-medium text-gray-600">{low}</span> low</span>
            <span className="opacity-40">·</span>
            <span><span className="font-medium text-gray-600">{avg}</span> avg</span>
          </div>
        )}
      </div>
    </div>
  );
}