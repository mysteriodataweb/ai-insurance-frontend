"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getClaim, extractClaim, getConversation, triggerFollowUp, customerRespond, assessRisk, claimAction, getRisk } from "@/lib/api";
import RiskBadge from "@/components/RiskBadge";
import StatusBadge from "@/components/StatusBadge";
import ChatMessage from "@/components/ChatMessage";
import { ArrowLeft, Brain, MessageSquare, Shield, AlertTriangle, CheckCircle, XCircle, Send, Clock, FileText } from "lucide-react";
import clsx from "clsx";

type Tab = "overview" | "ai" | "conversation" | "risk";

export default function ClaimDetail() {
  const params = useParams();
  const claimId = params.claimId as string;
  const [tab, setTab] = useState<Tab>("overview");
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
        const ext = await fetch("/api/agent/extract/" + claimId).then(r => r.json()).catch(() => null);
        setExtraction(ext);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (claimId) fetchAll(); }, [claimId]);

  const handleAction = async (action: string) => {
    setActionLoading(true);
    try {
      await claimAction(claimId, { action, performed_by: "ops_agent", notes: actionNotes });
      setActionNotes("");
      fetchAll();
    } finally { setActionLoading(false); }
  };

  const handleExtract = async () => {
    setActionLoading(true);
    try { await extractClaim(claimId); fetchAll(); }
    finally { setActionLoading(false); }
  };

  const handleFollowUp = async () => {
    setActionLoading(true);
    try { await triggerFollowUp(claimId); fetchAll(); }
    finally { setActionLoading(false); }
  };

  const handleRespond = async () => {
    if (!responseText.trim()) return;
    setActionLoading(true);
    try { await customerRespond(claimId, responseText); setResponseText(""); fetchAll(); }
    finally { setActionLoading(false); }
  };

  const handleAssessRisk = async () => {
    setActionLoading(true);
    try { await assessRisk(claimId); fetchAll(); }
    finally { setActionLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!claim) return <div className="text-center py-20 text-gray-400">Claim not found</div>;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "ai", label: "AI Data", icon: Brain },
    { id: "conversation", label: "Conversation", icon: MessageSquare },
    { id: "risk", label: "Risk", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </a>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{claim.customer_name}</h1>
            <p className="text-sm text-gray-500">{claim.customer_email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={claim.status} />
          <RiskBadge level={claim.risk_level} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-1 flex gap-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={clsx("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center", tab === t.id ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-500 hover:bg-gray-50")}>
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {tab === "overview" && (
            <div className="space-y-4 animate-fade-in">
              <div className="card p-6">
                <h2 className="font-semibold mb-4">Claim Description</h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl p-4">{claim.raw_description}</p>
              </div>
              <div className="card p-6">
                <h2 className="font-semibold mb-4">Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[{ label: "Type", value: claim.incident_type }, { label: "Date", value: claim.incident_date }, { label: "Location", value: claim.incident_location }, { label: "Amount", value: claim.estimated_amount ? "$" + Number(claim.estimated_amount).toLocaleString() : null }, { label: "Policy", value: claim.policy_number }].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">{item.label[0]}</div>
                      <div><p className="text-xs text-gray-400">{item.label}</p><p className="text-sm font-medium">{item.value || "—"}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <h2 className="font-semibold mb-4">Timeline</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><Clock size={14} className="text-blue-600" /></div>
                    <div><p className="text-sm font-medium">Claim Submitted</p><p className="text-xs text-gray-400">{new Date(claim.created_at).toLocaleString()}</p></div>
                  </div>
                  {claim.status !== "submitted" && <div className="flex items-center gap-3"><div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"><Brain size={14} className="text-purple-600" /></div><div><p className="text-sm font-medium">AI Analysis Completed</p><p className="text-xs text-gray-400">Information extracted</p></div></div>}
                  {risk && <div className="flex items-center gap-3"><div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><Shield size={14} className="text-red-600" /></div><div><p className="text-sm font-medium">Risk Assessed: {risk.risk_score}/100</p><p className="text-xs text-gray-400">{risk.risk_level} risk</p></div></div>}
                </div>
              </div>
            </div>
          )}

          {tab === "ai" && extraction && (
            <div className="space-y-4 animate-fade-in">
              <div className="card p-6">
                <h2 className="font-semibold mb-4">Extracted Information</h2>
                <div className="space-y-3">
                  {Object.entries(extraction.extracted_data || {}).map(([key, value]) => {
                    const confidence = extraction.confidence_scores?.[key] || 0;
                    return (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-500 capitalize">{key.replace(/_/g, " ")}</span>
                        <div className="flex items-center gap-3">
                          <span className={clsx("text-sm font-medium", value ? "" : "text-red-500")}>{value ? String(value) : "Missing"}</span>
                          {confidence > 0 && <div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={clsx("h-full rounded-full", confidence > 0.7 ? "bg-green-500" : confidence > 0.4 ? "bg-yellow-500" : "bg-red-500")} style={{ width: (confidence * 100) + "%" }} /></div><span className="text-xs text-gray-400 w-8">{Math.round(confidence * 100)}%</span></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {extraction.missing_fields?.length > 0 && <div className="mt-4 bg-orange-50 text-orange-700 p-4 rounded-xl text-sm flex items-start gap-2"><AlertTriangle size={16} className="mt-0.5 flex-shrink-0" /><div><strong>Missing:</strong> {extraction.missing_fields.join(", ")}</div></div>}
              </div>
            </div>
          )}

          {tab === "conversation" && (
            <div className="space-y-4 animate-fade-in">
              <div className="card p-6">
                <h2 className="font-semibold mb-6">Conversation History</h2>
                {conversation.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No conversation yet.</p>
                ) : (
                  <div className="space-y-4">
                    {conversation.map((msg, i) => (
                      <ChatMessage
                        key={msg.id || i}
                        role={msg.role === "customer" ? "customer" : "agent"}
                        message={msg.message}
                        timestamp={msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : undefined}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "risk" && risk && (
            <div className="space-y-4 animate-fade-in">
              <div className="card p-6">
                <h2 className="font-semibold mb-6">Risk Assessment</h2>
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke={risk.risk_level === "high" ? "#ef4444" : risk.risk_level === "medium" ? "#eab308" : "#22c55e"} strokeWidth="8" strokeDasharray={(risk.risk_score * 2.51) + " 251"} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{risk.risk_score}</span>
                      <span className="text-xs text-gray-400">/100</span>
                    </div>
                  </div>
                  <div><RiskBadge level={risk.risk_level} /><p className="text-sm text-gray-600 mt-2">{risk.recommended_action}</p></div>
                </div>
                <p className="text-sm text-gray-700 mb-4">{risk.explanation}</p>
                {risk.signals?.length > 0 && <div><p className="text-sm font-medium mb-2">Risk Signals</p><div className="space-y-2">{risk.signals.map((s: string, i: number) => <div key={i} className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-2"><AlertTriangle size={14} />{s}</div>)}</div></div>}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-sm mb-3">AI Actions</h3>
            <button onClick={handleExtract} disabled={actionLoading} className="w-full bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"><Brain size={16} /> Run Extraction</button>
            <button onClick={handleFollowUp} disabled={actionLoading} className="w-full bg-orange-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"><MessageSquare size={16} /> Follow-up Questions</button>
            <button onClick={handleAssessRisk} disabled={actionLoading} className="w-full bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"><Shield size={16} /> Assess Risk</button>
          </div>
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-sm mb-3">Customer Response</h3>
            <textarea rows={3} value={responseText} onChange={e => setResponseText(e.target.value)} placeholder="Simulate customer response..." className="input-field" />
            <button onClick={handleRespond} disabled={actionLoading || !responseText.trim()} className="w-full bg-cyan-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-cyan-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"><Send size={16} /> Send Response</button>
          </div>
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-sm mb-3">Human Decision</h3>
            <textarea rows={2} value={actionNotes} onChange={e => setActionNotes(e.target.value)} placeholder="Notes (optional)..." className="input-field" />
            <div className="space-y-2">
              <button onClick={() => handleAction("approved")} disabled={actionLoading} className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"><CheckCircle size={16} /> Approve</button>
              <button onClick={() => handleAction("rejected")} disabled={actionLoading} className="w-full bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2"><XCircle size={16} /> Reject</button>
              <button onClick={() => handleAction("escalated")} disabled={actionLoading} className="w-full bg-pink-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-pink-700 transition-all flex items-center justify-center gap-2"><AlertTriangle size={16} /> Escalate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}