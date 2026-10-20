"use client";

import { useEffect, useState } from "react";
import { getAnalyticsMetrics } from "@/lib/api";
import type { AnalyticsMetrics } from "@/lib/types";
import { RequireAuth } from "@/components/AuthProvider";
import ProgressMetricCard from "@/components/ProgressMetricCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Zap } from "lucide-react";

const RISK_COLORS = [
  { key: "low", name: "Low", fill: "#a1a1aa" },
  { key: "medium", name: "Medium", fill: "#71717a" },
  { key: "high", name: "High", fill: "#27272a" },
  { key: "unrated", name: "Unrated", fill: "#e4e4e7" },
] as const;

function formatPct(value: number | null) {
  return value === null ? "—" : `${value}%`;
}

function formatDuration(hours: number | null) {
  if (hours === null) return "—";
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 48) return `${hours.toFixed(1)} h`;
  return `${(hours / 24).toFixed(1)} days`;
}

function shortDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function AnalyticsContent() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAnalyticsMetrics()
      .then(setMetrics)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load metrics"));
  }, []);

  if (error) {
    return <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">{error}</div>;
  }
  if (!metrics) {
    return <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" /></div>;
  }

  const perDay = metrics.claims_per_day.slice(-7).map((d) => ({ date: shortDate(d.date), value: d.count }));
  const perWeek = metrics.claims_per_week.map((w) => ({ date: shortDate(w.week_start), value: w.count }));
  const riskData = RISK_COLORS.map((r) => ({ name: r.name, value: metrics.by_risk[r.key] ?? 0, fill: r.fill }));
  const hasRiskData = riskData.some((r) => r.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Analytics</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Operational metrics computed from live claim data</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Claims", value: String(metrics.total_claims) },
          { label: "Awaiting Customer", value: String(metrics.awaiting_customer) },
          { label: "To Review", value: String(metrics.under_review) },
          { label: "Decided", value: String(metrics.approved_claims + metrics.rejected_claims) },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <p className="text-xs text-zinc-400 font-medium mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProgressMetricCard title="Claims Volume (last 7 days)" data={perDay} color="#27272a" />
        <ProgressMetricCard title="Claims Volume (last 8 weeks)" data={perWeek} color="#27272a" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Claims by Type</h3>
          {metrics.by_type.length === 0 ? (
            <p className="text-sm text-zinc-400 py-20 text-center">No claims yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={metrics.by_type}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#a1a1aa" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#a1a1aa" />
                <Tooltip />
                <Bar dataKey="count" name="Claims" fill="#27272a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Risk Distribution</h3>
          {!hasRiskData ? (
            <p className="text-sm text-zinc-400 py-20 text-center">No claims yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {riskData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {riskData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-2 mb-6">
          <Zap size={18} className="text-zinc-400" />
          <h3 className="text-sm font-semibold">Automation &amp; Review</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {[
            { label: "Processed by AI", value: formatPct(metrics.ai_processed_rate), sub: `${metrics.ai_processed_claims} of ${metrics.total_claims} claims` },
            { label: "Avg. time to AI triage", value: formatDuration(metrics.avg_triage_minutes === null ? null : metrics.avg_triage_minutes / 60), sub: "submission → extraction" },
            { label: "Need human review", value: formatPct(metrics.human_review_rate), sub: "medium or high risk" },
            { label: "Fast-track eligible", value: String(metrics.fast_track_eligible), sub: "low risk, awaiting review" },
            { label: "Avg. time to decision", value: formatDuration(metrics.avg_decision_hours), sub: "submission → approve/reject" },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-zinc-400 text-xs mb-2">{m.label}</p>
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-[11px] text-zinc-400 mt-1">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <RequireAuth>
      <AnalyticsContent />
    </RequireAuth>
  );
}
