"use client";

interface RiskBadgeProps {
  level: string;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  const colors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    unrated: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level] || colors.unrated}`}>
      {level?.toUpperCase()}
    </span>
  );
}
