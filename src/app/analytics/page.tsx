"use client";

import { useEffect, useState } from "react";
import { getAnalyticsMetrics } from "@/lib/api";
import MetricsCard from "@/components/MetricsCard";

export default function Analytics() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsMetrics()
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics & Business Impact</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricsCard title="Total Claims" value={metrics?.total_claims || 0} />
        <MetricsCard title="Approved" value={metrics?.approved_claims || 0} subtitle="Successfully processed" />
        <MetricsCard title="High Risk" value={metrics?.high_risk_claims || 0} subtitle="Require investigation" />
        <MetricsCard title="Under Review" value={metrics?.under_review || 0} subtitle="Awaiting decision" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold mb-4">Automation Impact</h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">Avg Processing Time</p>
            <p className="text-lg"><span className="text-red-500 line-through">{metrics?.avg_processing_time_before}</span> → <span className="text-green-600 font-bold">{metrics?.avg_processing_time_after}</span></p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Time Saved</p>
            <p className="text-3xl font-bold text-green-600">{metrics?.estimated_time_saved}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Automation Rate</p>
            <p className="text-3xl font-bold text-brand-600">{metrics?.automation_rate}%</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        Note: Processing time metrics are simulated for demonstration purposes. In production, these would be calculated from real audit log timestamps.
      </div>
    </div>
  );
}
