"use client";

import { useEffect, useState } from "react";
import { listClaims, getDashboardSummary } from "@/lib/api";
import RiskBadge from "@/components/RiskBadge";
import StatusBadge from "@/components/StatusBadge";

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Operations Dashboard</h1>

      {summary && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total", value: summary.total_claims, color: "" },
            { label: "Submitted", value: summary.by_status?.submitted || 0, color: "text-blue-600" },
            { label: "Under Review", value: summary.by_status?.under_review || 0, color: "text-yellow-600" },
            { label: "High Risk", value: summary.by_risk?.high || 0, color: "text-red-600" },
            { label: "Approved", value: summary.by_status?.approved || 0, color: "text-green-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
            <option value="">All Status</option>
            {["submitted", "extracting", "follow_up", "ready_for_review", "under_review", "approved", "rejected", "escalated"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={filters.risk_level} onChange={e => setFilters({ ...filters, risk_level: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
            <option value="">All Risk</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : claims.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No claims found</td></tr>
            ) : (
              claims.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/dashboard/${c.id}`}>
                  <td className="px-4 py-3 font-medium">{c.customer_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.incident_type || "—"}</td>
                  <td className="px-4 py-3 text-sm">{c.estimated_amount ? `$${Number(c.estimated_amount).toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3"><RiskBadge level={c.risk_level} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
