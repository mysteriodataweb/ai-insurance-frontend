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
  const colorMap: Record<string, string> = {
    brand: "from-brand-500 to-brand-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    blue: "from-blue-500 to-blue-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
        </div>
        <div className={clsx("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", colorMap[color])}>
          <Icon className="text-white" size={18} />
        </div>
      </div>
    </div>
  );
}
