"use client";

import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

export default function KPICard({ title, value, icon: Icon, trend }: KPICardProps) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-zinc-400 font-medium">{title}</p>
        <Icon size={14} className="text-zinc-300" strokeWidth={1.5} />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {trend && <p className="text-xs text-zinc-400 mt-1">{trend}</p>}
    </div>
  );
}
