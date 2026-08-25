"use client";

import { useEffect, useState } from "react";
import { listClaims, getDashboardSummary } from "@/lib/api";
import { DataTable } from "@/components/DataTable";
import RiskBadge from "@/components/RiskBadge";
import StatusBadge from "@/components/StatusBadge";
import KPICard from "@/components/KPICard";
import CommandPalette from "@/components/CommandPalette";
import { FileText, AlertTriangle, CheckCircle, Clock, Search, ArrowUpRight, Command } from "lucide-react";

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
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shadow-md shadow-blue-500/20">
          {getInitials(info.getValue())}
        </div>
        <span className="font-semibold text-[13px]">{info.getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: "incident_type",
    header: "Type",
    cell: (info: any) => <span className="text-[13px] text-gray-500">{info.getValue() || "—"}</span>,
  },
  {
    accessorKey: "estimated_amount",
    header: "Amount",
    cell: (info: any) => (
      <span className="text-[13px] font-semibold">
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
    cell: (info: any) => <span className="text-[13px] text-gray-400">{timeAgo(info.getValue())}</span>,
  },
  {
    id: "action",
    cell: () => <ArrowUpRight size={14} className="text-gray-300" />,
  },
];

export default function Dashboard() {
  const [claims, setClaims] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [claimsData, summaryData] = await Promise.all([
        listClaims({ limit: 50 }),
        getDashboardSummary(),
      ]);
      setClaims(claimsData);
      setSummary(summaryData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="space-y-6">
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Operations Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor and manage insurance claims in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <Command size={14} />
            <span className="hidden sm:inline">⌘K</span>
          </button>
          <a href="/submit" className="btn-primary inline-flex items-center gap-2">
            <FileText size={16} /> New Claim
          </a>
        </div>
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

      {/* Data Table */}
      {loading ? (
        <div className="card p-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400 font-medium">Loading claims...</span>
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