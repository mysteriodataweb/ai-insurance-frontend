"use client";

interface RiskBadgeProps {
  level: string;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  const map: Record<string, { cls: string; label: string }> = {
    low: { cls: "badge-green", label: "LOW RISK" },
    medium: { cls: "badge-yellow", label: "MEDIUM" },
    high: { cls: "badge-red", label: "HIGH RISK" },
    unrated: { cls: "badge-gray", label: "UNRATED" },
  };
  const { cls, label } = map[level] || { cls: "badge-gray", label: level };
  return <span className={cls}>{label}</span>;
}