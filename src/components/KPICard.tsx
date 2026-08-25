"use client";

import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

export default function KPICard({ title, value, icon: Icon, color = "brand", trend }: KPICardProps) {
  const gradients: Record<string, string> = {
    brand: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-green-600",
    yellow: "from-amber-400 to-orange-500",
    red: "from-red-500 to-rose-600",
    purple: "from-violet-500 to-purple-600",
    blue: "from-blue-400 to-cyan-500",
  };

  const shadows: Record<string, string> = {
    brand: "shadow-blue-500/25",
    green: "shadow-emerald-500/25",
    yellow: "shadow-amber-400/25",
    red: "shadow-red-500/25",
    purple: "shadow-violet-500/25",
    blue: "shadow-blue-400/25",
  };

  return (
    <div className="card card-hover p-5 group">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[13px] text-gray-500 font-medium">{title}</p>
        <div className={clsx("w-10 h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300", gradients[color], shadows[color])}>
          <Icon className="text-white" size={18} />
        </div>
      </div>
      <p className="text-3xl font-black tracking-tight">{value}</p>
      {trend && <p className="text-xs text-emerald-600 mt-1.5 font-semibold">{trend}</p>}
    </div>
  );
}