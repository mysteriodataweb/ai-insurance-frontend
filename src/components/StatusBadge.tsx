"use client";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    submitted: "bg-blue-100 text-blue-800",
    extracting: "bg-purple-100 text-purple-800",
    follow_up: "bg-orange-100 text-orange-800",
    ready_for_review: "bg-cyan-100 text-cyan-800",
    under_review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    escalated: "bg-pink-100 text-pink-800",
  };

  const labels: Record<string, string> = {
    submitted: "Submitted",
    extracting: "AI Extracting",
    follow_up: "Follow-up",
    ready_for_review: "Ready for Review",
    under_review: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
    escalated: "Escalated",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {labels[status] || status}
    </span>
  );
}
