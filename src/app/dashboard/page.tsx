"use client";

import { useEffect, useState } from "react";
import { listClaims, getDashboardSummary } from "@/lib/api";
import RiskBadge from "@/components/RiskBadge";
import StatusBadge from "@/components/StatusBadge";
import KPICard from "@/components/KPICard";
import { FileText, AlertTriangle, CheckCircle, Clock, Search } from "lucide-react";

export default function Dashboard() {
  const [claims, setClaims] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [filters, setFilters] = useState({ status: "", risk_level: "" });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [claimsData, summaryData] = await Promise.all([
        listClaims({ ...filters, limit: 50 }),
        getDashboardSummary(),
      ]);
      setClaims(claimsData);
      setSummary(summaryData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filters]);

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return ${Math.floor(seconds / 60)}m ago;
    if (seconds < 86400) return ${Math.floor(seconds / 3600)}h ago;
    return ${Math.floor(seconds / 86400)}d ago;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Operations Dashboard</h1>
        <p className="text-gray-500 text-sm">Monitor and manage insurance claims</p>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard title="Total Claims" value={summary.total_claims || 0} icon={FileText} color="brand" />
          <KPICard title="Submitted" value={summary.by_status?.submitted || 0} icon={Clock} color="blue" />
          <KPICard title="Under Review" value={summary.by_status?.under_review || 0} icon={Search} color="yellow" />
          <KPICard title="High Risk" value={summary.by_risk?.high || 0} icon={AlertTriangle} color="red" />
          <KPICard title="Approved" value={summary.by_status?.approved || 0} icon={CheckCircle} color="green" />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search claims..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            className="input-field w-auto min-w-[150px]"
          >
            <option value="">All Status</option>
            {["submitted", "extracting", "follow_up", "ready_for_review", "under_review", "approved", "rejected", "escalated"].map(s => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
          <select
            value={filters.risk_level}
            onChange={e => setFilters({ ...filters, risk_level: e.target.value })}
            className="input-field w-auto min-w-[130px]"
          >
            <option value="">All Risk</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Risk</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="inline-flex items-center gap-2 text-gray-400">
                    <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    Loading claims...
                  </div>
                </td>
              </tr>
            ) : claims.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No claims found
                </td>
              </tr>
            ) : (
              claims.map((c, i) => (
                <tr
                  key={c.id}
                  className={order-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors }
                  onClick={() => window.location.href = /dashboard/}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {getInitials(c.customer_name)}
                      </div>
                      <span className="font-medium">{c.customer_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.incident_type || "—"}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {c.estimated_amount ? $ : "—"}
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-6 py-4"><RiskBadge level={c.risk_level} /></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{timeAgo(c.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
