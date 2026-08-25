"use client";

interface RiskBadgeProps {
  level: string;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  const map: Record<string, { cls: string; label: string }> = {
    low: { cls: "badge-green", label: "Low" },
    medium: { cls: "badge-yellow", label: "Medium" },
    high: { cls: "badge-red", label: "High" },
    unrated: { cls: "badge-zinc", label: "Unrated" },
  };
  const { cls, label } = map[level] || { cls: "badge-zinc", label: level };
  return <span className={cls}>{label}</span>;
}
