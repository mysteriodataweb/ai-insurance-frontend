"use client";

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function MetricsCard({ title, value, subtitle }: MetricsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
