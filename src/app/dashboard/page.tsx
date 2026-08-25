"use client";

import { useEffect, useState } from "react";
import { listClaims, getDashboardSummary } from "@/lib/api";
import RiskBadge from "@/components/RiskBadge";
import StatusBadge from "@/components/StatusBadge";
import KPICard from "@/components/KPICard";
import { FileText, AlertTriangle, CheckCircle, Clock, Search, Filter, ArrowUpRight } from "lucide-react";

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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filters]);

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Operations Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor and manage insurance claims in real-time</p>
        </div>
        <a href="/submit" className="btn-primary inline-flex items-center gap-2 self-start">
          <FileText size={16} /> New Claim
        </a>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
          <KPICard title="Total Claims" value={summary.total_claims || 0} icon={FileText} color="brand" />
          <KPICard title="Submitted" value={summary.by_status?.submitted || 0} icon={Clock} color="blue" />
          <KPICard title="Under Review" value={summary.by_status?.under_review || 0} icon={Search} color="yellow" />
          <KPICard title="High Risk" value={summary.by_risk?.high || 0} icon={AlertTriangle} color="red" />
          <KPICard title="Approved" value={summary.by_status?.approved || 0} icon={CheckCircle} color="green" />
        </div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search claims by name..." className="input-field pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="input-field w-auto min-w-[150px]">
              <option value="">All Status</option>
              {["submitted", "extracting", "follow_up", "ready_for_review", "under_review", "approved", "rejected", "escalated"].map(s => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>
            <select value={filters.risk_level} onChange={e => setFilters({ ...filters, risk_level: e.target.value })} className="input-field w-auto min-w-[130px]">
              <option value="">All Risk</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-400 font-medium">Loading claims...</span>
                    </div>
                  </td>
                </tr>
              ) : claims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center gap-2">
                      <FileText size={32} className="text-gray-300" />
                      <span className="text-sm text-gray-400">No claims found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                claims.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-50 hover:bg-blue-50/30 cursor-pointer transition-colors group"
                    onClick={() => window.location.href = `/dashboard/${c.id}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                          {getInitials(c.customer_name)}
                        </div>
                        <span className="font-semibold text-[13px]">{c.customer_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-gray-500">{c.incident_type || "—"}</td>
                    <td className="px-6 py-4 text-[13px] font-semibold">
                      {c.estimated_amount ? `$${Number(c.estimated_amount).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                    <td className="px-6 py-4"><RiskBadge level={c.risk_level} /></td>
                    <td className="px-6 py-4 text-[13px] text-gray-400">{timeAgo(c.created_at)}</td>
                    <td className="px-6 py-4">
                      <ArrowUpRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}