"use client";

import { useEffect, useState } from "react";
import { listClaims, getDashboardSummary } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import RiskBadge from "@/components/RiskBadge";
import StatusBadge from "@/components/StatusBadge";
import { FileText, AlertTriangle, CheckCircle, Clock, ArrowUpRight } from "lucide-react";

function getInitials(name: string) {
  return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const columns = [
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: (info: any) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-600 text-[11px] font-medium">
          {getInitials(info.getValue())}
        </div>
        <span className="text-sm font-medium">{info.getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: "incident_type",
    header: "Type",
    cell: (info: any) => <span className="text-sm text-zinc-500">{info.getValue() || "—"}</span>,
  },
  {
    accessorKey: "estimated_amount",
    header: "Amount",
    cell: (info: any) => (
      <span className="text-sm font-medium">
        {info.getValue() ? `$${Number(info.getValue()).toLocaleString()}` : "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info: any) => <StatusBadge status={info.getValue()} />,
  },
  {
    accessorKey: "risk_level",
    header: "Risk",
    cell: (info: any) => <RiskBadge level={info.getValue()} />,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: (info: any) => <span className="text-sm text-zinc-400">{timeAgo(info.getValue())}</span>,
  },
  {
    id: "action",
    cell: () => <ArrowUpRight size={14} className="text-zinc-300" />,
  },
];

export default function Dashboard() {
  const [claims, setClaims] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [claimsData, summaryData] = await Promise.all([
          listClaims({ limit: 50 }),
          getDashboardSummary(),
        ]);
        setClaims(claimsData);
        setSummary(summaryData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

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

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 stagger-children">
          {[
            { label: "Total Claims", value: summary.total_claims || 0, icon: FileText },
            { label: "Submitted", value: summary.by_status?.submitted || 0, icon: Clock },
            { label: "Under Review", value: summary.by_status?.under_review || 0, icon: AlertTriangle },
            { label: "High Risk", value: summary.by_risk?.high || 0, icon: AlertTriangle },
            { label: "Approved", value: summary.by_status?.approved || 0, icon: CheckCircle },
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
