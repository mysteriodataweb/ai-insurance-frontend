"use client";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<string, { cls: string; label: string }> = {
    submitted: { cls: "badge-zinc", label: "Submitted" },
    extracting: { cls: "badge-zinc", label: "Extracting" },
    follow_up: { cls: "badge-yellow", label: "Follow-up" },
    ready_for_review: { cls: "badge-zinc", label: "Ready" },
    under_review: { cls: "badge-yellow", label: "Reviewing" },
    approved: { cls: "badge-green", label: "Approved" },
    rejected: { cls: "badge-red", label: "Rejected" },
    escalated: { cls: "badge-red", label: "Escalated" },
  };
  const { cls, label } = map[status] || { cls: "badge-zinc", label: status };
  return <span className={cls}>{label}</span>;
}
