"use client";

import { useEffect, useState } from "react";
import { getAnalyticsMetrics } from "@/lib/api";
import KPICard from "@/components/KPICard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { FileText, CheckCircle, AlertTriangle, Clock, TrendingUp, Zap } from "lucide-react";

const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#eab308", "#8b5cf6"];

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

const timeData = [
  { name: "Mon", claims: 2, automated: 1 },
  { name: "Tue", claims: 1, automated: 0 },
  { name: "Wed", claims: 1, automated: 1 },
  { name: "Thu", claims: 1, automated: 0 },
  { name: "Fri", claims: 0, automated: 0 },
];

const processingData = [
  { name: "Manual", time: 25 },
  { name: "With AI", time: 8 },
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
        <h1 className="text-2xl font-bold">Analytics & Business Impact</h1>
        <p className="text-gray-500 text-sm">Measurable operational value of the platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Claims" value={metrics?.total_claims || 0} icon={FileText} color="brand" />
        <KPICard title="Approved" value={metrics?.approved_claims || 0} icon={CheckCircle} color="green" trend="+100% automation" />
        <KPICard title="High Risk" value={metrics?.high_risk_claims || 0} icon={AlertTriangle} color="red" />
        <KPICard title="Under Review" value={metrics?.under_review || 0} icon={Clock} color="yellow" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
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

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
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
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold mb-4">Claims Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="claims" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
              <Area type="monotone" dataKey="automated" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold mb-4">Processing Time Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={processingData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="time" radius={[0, 8, 8, 0]}>
                {processingData.map((entry, index) => <Cell key={index} fill={index === 0 ? "#ef4444" : "#22c55e"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl p-8 text-white">
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

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800 flex items-start gap-2">
        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
        <div>Note: Processing time metrics are simulated for demonstration purposes. In production, these would be calculated from real audit log timestamps.</div>
      </div>
    </div>
  );
}