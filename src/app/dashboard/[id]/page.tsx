"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getClaim, extractClaim, assessRisk, triggerFollowUp, getConversation,
  getRisk, getDashboardSummary,
} from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import RiskBadge from "@/components/RiskBadge";
import {
  ArrowLeft, Brain, ShieldAlert, MessageSquare, RefreshCw,
  CheckCircle, AlertTriangle, Clock, FileText, User, MapPin,
  DollarSign, Calendar, Hash, ChevronDown, ChevronRight,
} from "lucide-react";

function ConfidenceBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-500 w-32 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-zinc-400 w-8 text-right">{pct}%</span>
    </div>
  );
}

function ExtractionCard({ data }: { data: any }) {
  const [open, setOpen] = useState(true);
  const fields = [
    { label: "Incident Type", value: data.extracted_data?.incident_type, icon: FileText },
    { label: "Date", value: data.extracted_data?.incident_date, icon: Calendar },
    { label: "Location", value: data.extracted_data?.incident_location, icon: MapPin },
    { label: "Estimated Amount", value: data.extracted_data?.estimated_amount ? `$${Number(data.extracted_data.estimated_amount).toLocaleString()}` : null, icon: DollarSign },
    { label: "Damage Description", value: data.extracted_data?.damage_description },
    { label: "Other Party", value: data.extracted_data?.other_party_info },
    { label: "Policy Number", value: data.extracted_data?.policy_number, icon: Hash },
  ];
  const missing = data.missing_fields || [];
  const scores = data.confidence_scores || {};

  return (
    <div className="card animate-slide-up">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <Brain className="text-white" size={16} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold">AI Extraction</h3>
            <p className="text-xs text-zinc-400">Structured data extracted from claim description</p>
          </div>
        </div>
        {open ? <ChevronDown size={16} className="text-zinc-400" /> : <ChevronRight size={16} className="text-zinc-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-zinc-100 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.label} className="flex items-start gap-2 p-3 bg-zinc-50 rounded-lg">
                {f.icon && <f.icon size={14} className="text-zinc-400 mt-0.5 shrink-0" />}
                <div className="min-w-0">
                  <p className="text-[11px] text-zinc-400 font-medium">{f.label}</p>
                  <p className="text-sm font-medium text-zinc-700 truncate">{f.value || "—"}</p>
                </div>
              </div>
            ))}
          </div>

          {missing.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 mb-1.5">Missing Fields</p>
              <div className="flex flex-wrap gap-1.5">
                {missing.map((m: string) => (
                  <span key={m} className="badge-yellow">{m}</span>
                ))}
              </div>
            </div>
          )}

          {Object.keys(scores).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 mb-3">Confidence Scores</p>
              <div className="space-y-2">
                {Object.entries(scores).map(([k, v]) => (
                  <ConfidenceBar key={k} label={k.replace(/_/g, " ")} value={v as number} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RiskCard({ data }: { data: any }) {
  const [open, setOpen] = useState(true);
  const levelColors: Record<string, string> = {
    low: "text-emerald-600 bg-emerald-50",
    medium: "text-amber-600 bg-amber-50",
    high: "text-red-600 bg-red-50",
  };
  const color = levelColors[data.risk_level] || "text-zinc-600 bg-zinc-50";
  const signals = data.signals || [];

  return (
    <div className="card animate-slide-up">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <ShieldAlert className="text-white" size={16} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold">Risk Assessment</h3>
            <p className="text-xs text-zinc-400">AI-powered risk scoring and signal analysis</p>
          </div>
        </div>
        {open ? <ChevronDown size={16} className="text-zinc-400" /> : <ChevronRight size={16} className="text-zinc-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-zinc-100 pt-5">
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2.5 rounded-xl ${color}`}>
              <p className="text-2xl font-bold">{data.risk_score}</p>
              <p className="text-xs font-medium opacity-75">/100</p>
            </div>
            <div className="flex-1">
              <RiskBadge level={data.risk_level} />
              <p className="text-sm text-zinc-500 mt-1">{data.recommended_action}</p>
            </div>
          </div>

          {signals.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 mb-2">Risk Signals</p>
              <div className="space-y-1.5">
                {signals.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle size={12} className="text-amber-500 mt-1 shrink-0" />
                    <span className="text-zinc-600">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FollowUpCard({ data }: { data: any }) {
  const questions = data.questions || [];
  return (
    <div className="card animate-slide-up">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-white" size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Follow-up Questions</h3>
            <p className="text-xs text-zinc-400">AI-generated questions for missing information</p>
          </div>
        </div>
        <div className="space-y-2">
          {questions.map((q: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg">
              <div className="w-5 h-5 bg-zinc-200 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-600 shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-zinc-700">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConversationCard({ messages }: { messages: any[] }) {
  const [open, setOpen] = useState(false);
  if (!messages.length) return null;

  return (
    <div className="card animate-slide-up">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="text-zinc-500" size={16} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold">Conversation History</h3>
            <p className="text-xs text-zinc-400">{messages.length} messages</p>
          </div>
        </div>
        {open ? <ChevronDown size={16} className="text-zinc-400" /> : <ChevronRight size={16} className="text-zinc-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-2 border-t border-zinc-100 pt-4">
          {messages.map((m: any, i: number) => (
            <div key={i} className={`flex ${m.role === "customer" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm ${
                m.role === "customer"
                  ? "bg-zinc-900 text-white rounded-br-sm"
                  : "bg-zinc-100 text-zinc-700 rounded-bl-sm"
              }`}>
                <p>{m.message}</p>
                <p className={`text-[10px] mt-1 ${m.role === "customer" ? "text-zinc-400" : "text-zinc-400"}`}>
                  {m.message_type} · {new Date(m.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClaimDetail() {
  const params = useParams();
  const claimId = params.id as string;

  const [claim, setClaim] = useState<any>(null);
  const [extraction, setExtraction] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [followUp, setFollowUp] = useState<any>(null);
  const [conversation, setConversation] = useState<any[]>([]);

  const [extracting, setExtracting] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const c = await getClaim(claimId);
        setClaim(c);
      } catch (err) { console.error(err); }
    })();
  }, [claimId]);

  const handleExtract = async () => {
    setExtracting(true);
    try {
      const ext = await extractClaim(claimId);
      setExtraction(ext);
      const c = await getClaim(claimId);
      setClaim(c);
    } catch (err: any) { console.error(err); }
    finally { setExtracting(false); }
  };

  const handleAssessRisk = async () => {
    setAssessing(true);
    try {
      const r = await assessRisk(claimId);
      setRisk(r);
      const c = await getClaim(claimId);
      setClaim(c);
    } catch (err: any) { console.error(err); }
    finally { setAssessing(false); }
  };

  const handleFollowUp = async () => {
    setGenerating(true);
    try {
      const fu = await triggerFollowUp(claimId);
      setFollowUp(fu);
      const conv = await getConversation(claimId);
      setConversation(conv);
    } catch (err: any) { console.error(err); }
    finally { setGenerating(false); }
  };

  const handleLoadConversation = async () => {
    try {
      const conv = await getConversation(claimId);
      setConversation(conv);
    } catch (err) { console.error(err); }
  };

  if (!claim) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
          <span className="text-sm text-zinc-400">Loading claim...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <a href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </a>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center text-zinc-600 text-sm font-medium">
                {claim.customer_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h1 className="text-lg font-bold">{claim.customer_name}</h1>
                <p className="text-xs text-zinc-400 font-mono">{claim.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <StatusBadge status={claim.status} />
              <RiskBadge level={claim.risk_level || "unrated"} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExtract} disabled={extracting} className="btn-primary flex items-center gap-2 text-xs">
              {extracting ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Brain size={14} />}
              {extracting ? "Analyzing..." : "Analyze with AI"}
            </button>
            <button onClick={handleAssessRisk} disabled={assessing} className="btn-secondary flex items-center gap-2 text-xs">
              {assessing ? <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" /> : <ShieldAlert size={14} />}
              {assessing ? "Scoring..." : "Assess Risk"}
            </button>
            <button onClick={handleFollowUp} disabled={generating} className="btn-secondary flex items-center gap-2 text-xs">
              {generating ? <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" /> : <MessageSquare size={14} />}
              {generating ? "Generating..." : "Follow-up"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-zinc-100">
          <div>
            <p className="text-[11px] text-zinc-400 font-medium mb-0.5">Type</p>
            <p className="text-sm font-medium">{claim.incident_type || "—"}</p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-medium mb-0.5">Amount</p>
            <p className="text-sm font-medium">{claim.estimated_amount ? `$${Number(claim.estimated_amount).toLocaleString()}` : "—"}</p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-medium mb-0.5">Date</p>
            <p className="text-sm font-medium">{claim.incident_date || "—"}</p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-medium mb-0.5">Created</p>
            <p className="text-sm font-medium">{new Date(claim.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {claim.raw_description && (
          <div className="mt-5 pt-5 border-t border-zinc-100">
            <p className="text-[11px] text-zinc-400 font-medium mb-2">Description</p>
            <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-lg">{claim.raw_description}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {extraction && <ExtractionCard data={extraction} />}
        {risk && <RiskCard data={risk} />}
        {followUp && <FollowUpCard data={followUp} />}
        {conversation.length > 0 && <ConversationCard messages={conversation} />}

        {!extraction && !risk && !followUp && (
          <div className="card p-12 text-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="text-zinc-400" size={24} />
            </div>
            <h3 className="text-sm font-semibold mb-1">AI Analysis</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Click the AI buttons above to analyze this claim. The AI will extract structured data,
              assess risk, and generate follow-up questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
