"use client";

import { useId, useState } from "react";
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
  color?: string;
}

export default function ProgressMetricCard({
  title,
  data,
  total,
  delta,
  deltaLabel = "vs last period",
  trend = "up",
  color = "#27272a",
}: ProgressMetricCardProps) {
  const [view, setView] = useState<"area" | "bar">("area");
  const gradientId = `grad-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const vals = data.map((d) => d.value);
  const sum = vals.reduce((a, b) => a + b, 0);
  const peak = vals.length ? Math.max(...vals) : 0;
  const low = vals.length ? Math.min(...vals) : 0;
  const avg = vals.length ? Math.round(sum / vals.length) : 0;

  const displayTotal = total ?? sum.toLocaleString();
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : ArrowRight;

  return (
    <div className="card overflow-hidden">
      <div className="px-5 pt-4 pb-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          <div className="flex items-center gap-1">
            <button onClick={() => setView("area")} className={clsx("text-[11px] px-2 py-0.5 rounded transition-colors", view === "area" ? "bg-zinc-100 text-zinc-700 font-medium" : "text-zinc-400 hover:text-zinc-600")}>
              Line
            </button>
            <button onClick={() => setView("bar")} className={clsx("text-[11px] px-2 py-0.5 rounded transition-colors", view === "bar" ? "bg-zinc-100 text-zinc-700 font-medium" : "text-zinc-400 hover:text-zinc-600")}>
              Bar
            </button>
          </div>
        </div>
        <p className="text-2xl font-bold">{displayTotal}</p>
      </div>

      <div className="px-2 h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          {view === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.08} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} fill={`url(#${gradientId})`} />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }} />
              <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 text-xs">
        {delta ? (
          <div className="flex items-center gap-1.5">
            <TrendIcon size={13} className="text-zinc-400" />
            <span className="font-medium">{delta}</span>
            <span className="text-zinc-400">{deltaLabel}</span>
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2 text-zinc-400">
          <span><span className="font-medium text-zinc-600">{peak}</span> peak</span>
          <span>·</span>
          <span><span className="font-medium text-zinc-600">{low}</span> low</span>
          <span>·</span>
          <span><span className="font-medium text-zinc-600">{avg}</span> avg</span>
        </div>
      </div>
    </div>
  );
}
