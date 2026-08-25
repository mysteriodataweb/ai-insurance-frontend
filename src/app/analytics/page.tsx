"use client";

import { useEffect, useState } from "react";
import { getAnalyticsMetrics } from "@/lib/api";
import ProgressMetricCard from "@/components/ProgressMetricCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { AlertTriangle, Zap } from "lucide-react";

const riskData = [
  { name: "Low", value: 1, fill: "#71717a" },
  { name: "Medium", value: 2, fill: "#a1a1aa" },
  { name: "High", value: 1, fill: "#27272a" },
  { name: "Unrated", value: 1, fill: "#e4e4e7" },
];

const typeData = [
  { name: "Car Accident", count: 2 },
  { name: "Water Damage", count: 1 },
  { name: "Theft", count: 1 },
  { name: "Fire", count: 1 },
];

const claimsOverTime = [
  { date: "Mon", value: 2 },
  { date: "Tue", value: 1 },
  { date: "Wed", value: 1 },
  { date: "Thu", value: 1 },
  { date: "Fri", value: 0 },
];

const weeklyTrend = [
  { date: "Week 1", value: 2 },
  { date: "Week 2", value: 3 },
  { date: "Week 3", value: 1 },
  { date: "Week 4", value: 4 },
  { date: "Week 5", value: 2 },
];

const processingTime = [
  { date: "Manual", value: 25 },
  { date: "With AI", value: 8 },
];

export default function Analytics() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsMetrics().then(setMetrics).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Analytics</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Business impact and operational metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProgressMetricCard
          title="Claims Volume"
          data={claimsOverTime}
          color="#27272a"
          delta="+25%"
          deltaLabel="vs last week"
          trend="up"
        />
        <ProgressMetricCard
          title="Processing Time"
          data={[
            { date: "Mon", value: 22 },
            { date: "Tue", value: 18 },
            { date: "Wed", value: 15 },
            { date: "Thu", value: 12 },
            { date: "Fri", value: 8 },
          ]}
          total="8 min"
          delta="-68%"
          deltaLabel="vs manual"
          trend="down"
          color="#27272a"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Claims by Type</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <YAxis tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <Tooltip />
              <Bar dataKey="count" fill="#27272a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {riskData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {riskData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <YAxis tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#27272a" fill="#27272a" fillOpacity={0.05} strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Processing Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={processingTime} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <YAxis dataKey="date" type="category" tick={{ fontSize: 11 }} width={80} stroke="#a1a1aa" />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {processingTime.map((_, index) => <Cell key={index} fill={index === 0 ? "#a1a1aa" : "#27272a"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-2 mb-6">
          <Zap size={18} className="text-zinc-400" />
          <h3 className="text-sm font-semibold">Automation Impact</h3>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-zinc-400 text-xs mb-2">Processing Time</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-zinc-400 line-through">{metrics?.avg_processing_time_before}</span>
              <span className="text-zinc-300">→</span>
              <span className="text-2xl font-bold">{metrics?.avg_processing_time_after}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-zinc-400 text-xs mb-2">Time Saved</p>
            <p className="text-3xl font-bold"><AnimatedCounter value={68} suffix="%" /></p>
          </div>
          <div className="text-center">
            <p className="text-zinc-400 text-xs mb-2">Automation Rate</p>
            <p className="text-3xl font-bold"><AnimatedCounter value={40} suffix="%" /></p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm text-zinc-500">
        Note: Processing time metrics are simulated for demonstration purposes.
      </div>
    </div>
  );
}
