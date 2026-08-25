"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getClaim, extractClaim, getConversation, triggerFollowUp, customerRespond, assessRisk, claimAction, getRisk } from "@/lib/api";
import RiskBadge from "@/components/RiskBadge";
import StatusBadge from "@/components/StatusBadge";

export default function ClaimDetail() {
  const params = useParams();
  const claimId = params.claimId as string;
  const [claim, setClaim] = useState<any>(null);
  const [extraction, setExtraction] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [responseText, setResponseText] = useState("");
  const [actionNotes, setActionNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAll = async () => {
    try {
      const [c, conv, r] = await Promise.all([
        getClaim(claimId),
        getConversation(claimId).catch(() => []),
        getRisk(claimId).catch(() => null),
      ]);
      setClaim(c);
      setConversation(conv);
      setRisk(r);
      if (c.status !== "submitted") {
        const ext = await fetch(`/api/agent/extract/${claimId}`).then(r => r.json()).catch(() => null);
        setExtraction(ext);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (claimId) fetchAll(); }, [claimId]);

  const handleExtract = async () => {
    setActionLoading(true);
    try {
      const ext = await extractClaim(claimId);
      setExtraction(ext);
      fetchAll();
    } finally { setActionLoading(false); }
  };

  const handleFollowUp = async () => {
    setActionLoading(true);
    try {
      await triggerFollowUp(claimId);
      const conv = await getConversation(claimId);
      setConversation(conv);
    } finally { setActionLoading(false); }
  };

  const handleRespond = async () => {
    if (!responseText.trim()) return;
    setActionLoading(true);
    try {
      await customerRespond(claimId, responseText);
      setResponseText("");
      fetchAll();
    } finally { setActionLoading(false); }
  };

  const handleAssessRisk = async () => {
    setActionLoading(true);
    try {
      const r = await assessRisk(claimId);
      setRisk(r);
      fetchAll();
    } finally { setActionLoading(false); }
  };

  const handleAction = async (action: string) => {
    setActionLoading(true);
    try {
      await claimAction(claimId, { action, performed_by: "ops_agent", notes: actionNotes });
      setActionNotes("");
      fetchAll();
    } finally { setActionLoading(false); }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!claim) return <div className="text-center py-20 text-gray-400">Claim not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{claim.customer_name}</h1>
          <p className="text-sm text-gray-500">{claim.customer_email}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={claim.status} />
          <RiskBadge level={claim.risk_level} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold mb-3">Original Claim</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{claim.raw_description}</p>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-gray-500">Type:</span> {claim.incident_type || "—"}</div>
              <div><span className="text-gray-500">Date:</span> {claim.incident_date || "—"}</div>
              <div><span className="text-gray-500">Location:</span> {claim.incident_location || "—"}</div>
              <div><span className="text-gray-500">Amount:</span> {claim.estimated_amount ? `$${Number(claim.estimated_amount).toLocaleString()}` : "—"}</div>
              <div><span className="text-gray-500">Policy:</span> {claim.policy_number || "—"}</div>
            </div>
          </div>

          {extraction && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold mb-3">AI Extraction</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(extraction.extracted_data || {}).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-gray-500">{k}:</span>{" "}
                    <span className={v ? "" : "text-red-500"}>{v ? String(v) : "Missing"}</span>
                    {extraction.confidence_scores?.[k] !== undefined && (
                      <span className="ml-2 text-xs text-gray-400">
                        ({Math.round(extraction.confidence_scores[k] * 100)}%)
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {extraction.missing_fields?.length > 0 && (
                <div className="mt-3 bg-orange-50 text-orange-700 p-3 rounded-lg text-sm">
                  <strong>Missing:</strong> {extraction.missing_fields.join(", ")}
                </div>
              )}
            </div>
          )}

          {conversation.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold mb-3">Conversation</h2>
              <div className="space-y-3">
                {conversation.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-lg text-sm ${msg.role === "agent" ? "bg-blue-50 border-l-4 border-blue-400" : "bg-gray-50 border-l-4 border-gray-300 ml-4"}`}>
                    <p className="text-xs text-gray-400 mb-1">{msg.role === "agent" ? "AI Agent" : "Customer"} — {new Date(msg.created_at).toLocaleString()}</p>
                    <p>{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {risk && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold mb-3">Risk Assessment</h2>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl font-bold">{risk.risk_score}/100</span>
                <RiskBadge level={risk.risk_level} />
              </div>
              <p className="text-sm text-gray-700 mb-2">{risk.explanation}</p>
              {risk.signals?.length > 0 && (
                <ul className="text-sm text-red-600 list-disc list-inside">
                  {risk.signals.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-sm">Actions</h3>
            <button onClick={handleExtract} disabled={actionLoading} className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50">
              {actionLoading ? "Processing..." : "Run AI Extraction"}
            </button>
            <button onClick={handleFollowUp} disabled={actionLoading} className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm hover:bg-orange-700 disabled:opacity-50">
              Generate Follow-up Questions
            </button>
            <button onClick={handleAssessRisk} disabled={actionLoading} className="w-full bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">
              Assess Risk
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-sm">Customer Response</h3>
            <textarea rows={3} value={responseText} onChange={e => setResponseText(e.target.value)} placeholder="Simulate customer response..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <button onClick={handleRespond} disabled={actionLoading || !responseText.trim()} className="w-full bg-cyan-600 text-white py-2 rounded-lg text-sm hover:bg-cyan-700 disabled:opacity-50">
              Send Response
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-sm">Human Decision</h3>
            <textarea rows={2} value={actionNotes} onChange={e => setActionNotes(e.target.value)} placeholder="Notes (optional)..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => handleAction("approved")} disabled={actionLoading} className="bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700">Approve</button>
              <button onClick={() => handleAction("rejected")} disabled={actionLoading} className="bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700">Reject</button>
              <button onClick={() => handleAction("escalated")} disabled={actionLoading} className="bg-pink-600 text-white py-2 rounded-lg text-sm hover:bg-pink-700">Escalate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
