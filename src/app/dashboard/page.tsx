"use client";

import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { listClaims, getDashboardSummary } from "@/lib/api";
import type { ClaimListItem, ClaimStatus, DashboardSummary, RiskLevel } from "@/lib/types";
import { DataTable } from "@/components/DataTable";
import { RequireAuth } from "@/components/AuthProvider";
import RiskBadge from "@/components/RiskBadge";
import StatusBadge from "@/components/StatusBadge";
import { FileText, AlertTriangle, CheckCircle, Clock, ArrowUpRight, MessageSquare } from "lucide-react";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const STATUS_OPTIONS: { value: ClaimStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "submitted", label: "Submitted" },
  { value: "follow_up", label: "Follow-up" },
  { value: "ready_for_review", label: "Ready" },
  { value: "under_review", label: "Reviewing" },
  { value: "escalated", label: "Escalated" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const RISK_OPTIONS: { value: RiskLevel | ""; label: string }[] = [
  { value: "", label: "All risk levels" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "unrated", label: "Unrated" },
];

const columns: ColumnDef<ClaimListItem>[] = [
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: (info) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-600 text-[11px] font-medium">
          {getInitials(info.getValue<string>())}
        </div>
        <span className="text-sm font-medium">{info.getValue<string>()}</span>
      </div>
    ),
  },
  {
    accessorKey: "incident_type",
    header: "Type",
    cell: (info) => <span className="text-sm text-zinc-500">{info.getValue<string | null>() || "—"}</span>,
  },
  {
    accessorKey: "estimated_amount",
    header: "Amount",
    sortingFn: (a, b) => Number(a.original.estimated_amount ?? 0) - Number(b.original.estimated_amount ?? 0),
    cell: (info) => {
      const value = info.getValue<string | null>();
      return <span className="text-sm font-medium">{value ? `$${Number(value).toLocaleString()}` : "—"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue<string>()} />,
  },
  {
    accessorKey: "risk_level",
    header: "Risk",
    cell: (info) => <RiskBadge level={info.getValue<string>()} />,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: (info) => <span className="text-sm text-zinc-400">{timeAgo(info.getValue<string>())}</span>,
  },
  {
    id: "action",
    cell: (info) => (
      <a href={`/dashboard/${info.row.original.id}`} aria-label="Open claim" className="text-zinc-300 hover:text-zinc-600 transition-colors">
        <ArrowUpRight size={14} />
      </a>
    ),
  },
];

function DashboardContent() {
  const [claims, setClaims] = useState<ClaimListItem[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [status, setStatus] = useState<ClaimStatus | "">("");
  const [risk, setRisk] = useState<RiskLevel | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [claimsData, summaryData] = await Promise.all([
          listClaims({ status, risk_level: risk, limit: 100 }),
          getDashboardSummary(),
        ]);
        if (cancelled) return;
        setClaims(claimsData);
        setSummary(summaryData);
        setError("");
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load claims");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [status, risk]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-0.5">Monitor and manage insurance claims</p>
        </div>
        <a href="/submit" className="btn-primary inline-flex items-center gap-2 w-fit">
          <FileText size={16} /> New Claim
        </a>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">{error}</div>
      )}

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 stagger-children">
          {[
            { label: "Total Claims", value: summary.total_claims || 0, icon: FileText },
            { label: "Awaiting Customer", value: summary.by_status.follow_up || 0, icon: MessageSquare },
            { label: "To Review", value: (summary.by_status.ready_for_review || 0) + (summary.by_status.under_review || 0) + (summary.by_status.escalated || 0), icon: Clock },
            { label: "High Risk", value: summary.by_risk.high || 0, icon: AlertTriangle },
            { label: "Approved", value: summary.by_status.approved || 0, icon: CheckCircle },
          ].map((kpi) => (
            <div key={kpi.label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-zinc-400 font-medium">{kpi.label}</p>
                <kpi.icon size={14} className="text-zinc-300" strokeWidth={1.5} />
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value as ClaimStatus | "")} className="input-field w-auto">
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select aria-label="Filter by risk" value={risk} onChange={(e) => setRisk(e.target.value as RiskLevel | "")} className="input-field w-auto">
          {RISK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="card p-16 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
            <span className="text-sm text-zinc-400">Loading claims...</span>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={claims}
          searchKey="customer_name"
          searchPlaceholder="Search by customer name..."
          pageSize={10}
        />
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
