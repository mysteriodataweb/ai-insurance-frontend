"use client";

import { useEffect, useState } from "react";
import { getAnalyticsMetrics } from "@/lib/api";
import KPICard from "@/components/KPICard";
import ProgressMetricCard from "@/components/ProgressMetricCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { FileText, CheckCircle, AlertTriangle, Clock, Zap } from "lucide-react";

const riskData = [
  { name: "Low", value: 1, fill: "#22c55e" },
  { name: "Medium", value: 2, fill: "#eab308" },
  { name: "High", value: 1, fill: "#ef4444" },
  { name: "Unrated", value: 1, fill: "#9ca3af" },
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

const processingTime = [
  { date: "Manual", value: 25 },
  { date: "With AI", value: 8 },
];

const weeklyTrend = [
  { date: "Week 1", value: 2 },
  { date: "Week 2", value: 3 },
  { date: "Week 3", value: 1 },
  { date: "Week 4", value: 4 },
  { date: "Week 5", value: 2 },
];

export default function Analytics() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsMetrics().then(setMetrics).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Analytics & Business Impact</h1>
        <p className="text-gray-400 text-sm">Measurable operational value of the platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Claims" value={metrics?.total_claims || 0} icon={FileText} color="brand" />
        <KPICard title="Approved" value={metrics?.approved_claims || 0} icon={CheckCircle} color="green" trend="+100% automation" />
        <KPICard title="High Risk" value={metrics?.high_risk_claims || 0} icon={AlertTriangle} color="red" />
        <KPICard title="Under Review" value={metrics?.under_review || 0} icon={Clock} color="yellow" />
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressMetricCard
          title="Claims Volume"
          data={claimsOverTime}
          color="#3b82f6"
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
          color="#22c55e"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Claims by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {riskData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {riskData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">Processing Time Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={processingTime} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="date" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {processingTime.map((_, index) => <Cell key={index} fill={index === 0 ? "#ef4444" : "#22c55e"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white noise relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={20} />
            <h3 className="font-semibold">Automation Impact</h3>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-white/70 text-sm mb-2">Processing Time</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg line-through text-white/50">{metrics?.avg_processing_time_before}</span>
                <span className="text-white/50">→</span>
                <span className="text-3xl font-bold">{metrics?.avg_processing_time_after}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-sm mb-2">Time Saved</p>
              <p className="text-4xl font-bold"><AnimatedCounter value={68} suffix="%" /></p>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-sm mb-2">Automation Rate</p>
              <p className="text-4xl font-bold"><AnimatedCounter value={40} suffix="%" /></p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800 flex items-start gap-2">
        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
        <div>Note: Processing time metrics are simulated for demonstration purposes. In production, these would be calculated from real audit log timestamps.</div>
      </div>
    </div>
  );
}