"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getClaim, extractClaim, assessRisk, triggerFollowUp, getConversation, getExtraction, getRisk,
  getActions, getAttachments, getAuditTrail, claimAction, customerRespond, downloadAttachment, ApiError,
} from "@/lib/api";
import type {
  Attachment, AuditEvent, Claim, ClaimActionRecord, ClaimActionType, ClaimStatus, ConversationMessage,
  Extraction, RiskAssessment,
} from "@/lib/types";
import { RequireAuth } from "@/components/AuthProvider";
import StatusBadge from "@/components/StatusBadge";
import RiskBadge from "@/components/RiskBadge";
import {
  ArrowLeft, Brain, ShieldAlert, MessageSquare, AlertTriangle, FileText, MapPin, DollarSign,
  Calendar, Hash, ChevronDown, ChevronRight, Paperclip, Download, History, Gavel, Mail, X,
} from "lucide-react";
import clsx from "clsx";

// Mirrors the backend workflow rules (app/services/claim_service.py).
const ACTION_ALLOWED_FROM: Record<ClaimActionType, ClaimStatus[]> = {
  approved: ["ready_for_review", "under_review", "escalated"],
  rejected: ["follow_up", "ready_for_review", "under_review", "escalated"],
  escalated: ["follow_up", "ready_for_review", "under_review"],
  info_requested: ["ready_for_review", "under_review", "escalated"],
};

const ACTION_LABELS: Record<ClaimActionType, string> = {
  approved: "Approve",
  rejected: "Reject",
  escalated: "Escalate",
  info_requested: "Request info",
};

const HISTORY_LABELS: Record<ClaimActionType, string> = {
  approved: "Approved",
  rejected: "Rejected",
  escalated: "Escalated",
  info_requested: "Information requested",
};

const EVENT_LABELS: Record<string, string> = {
  claim_submitted: "Claim submitted",
  ai_extraction_completed: "AI extraction completed",
  risk_assessed: "Risk assessed",
  follow_up_generated: "Follow-up questions generated",
  customer_responded: "Customer reply recorded",
  attachments_uploaded: "Documents uploaded",
  ai_pipeline_failed: "Automatic AI processing failed",
  claim_approved: "Approved",
  claim_rejected: "Rejected",
  claim_escalated: "Escalated",
  claim_info_requested: "Information requested",
};

function errorText(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong";
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function formatEventValue(value: unknown): string {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "none";
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function CollapsibleCard({ icon: Icon, title, subtitle, defaultOpen = true, dark = true, children }: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  defaultOpen?: boolean;
  dark?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card animate-slide-up">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center", dark ? "bg-zinc-900" : "bg-zinc-100")}>
            <Icon className={dark ? "text-white" : "text-zinc-500"} size={16} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-xs text-zinc-400">{subtitle}</p>
          </div>
        </div>
        {open ? <ChevronDown size={16} className="text-zinc-400" /> : <ChevronRight size={16} className="text-zinc-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-zinc-100 pt-5">{children}</div>}
    </div>
  );
}

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

function ExtractionCard({ data }: { data: Extraction }) {
  const d = data.extracted_data;
  const fields = [
    { label: "Incident Type", value: d.incident_type, icon: FileText },
    { label: "Date", value: d.incident_date, icon: Calendar },
    { label: "Location", value: d.incident_location, icon: MapPin },
    { label: "Estimated Amount", value: d.estimated_amount ? `$${Number(d.estimated_amount).toLocaleString()}` : null, icon: DollarSign },
    { label: "Damage Description", value: d.damage_description },
    { label: "Other Party", value: d.other_party_info },
    { label: "Policy Number", value: d.policy_number, icon: Hash },
  ];
  const scores = data.confidence_scores || {};

  return (
    <CollapsibleCard icon={Brain} title="AI Extraction" subtitle={`Structured data extracted from the description · ${formatDateTime(data.created_at)}`}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.label} className="flex items-start gap-2 p-3 bg-zinc-50 rounded-lg">
              {f.icon && <f.icon size={14} className="text-zinc-400 mt-0.5 shrink-0" />}
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-400 font-medium">{f.label}</p>
                <p className="text-sm font-medium text-zinc-700 break-words">{f.value || "—"}</p>
              </div>
            </div>
          ))}
        </div>

        {data.missing_fields.length > 0 ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-semibold text-amber-700 mb-1.5">Missing Fields</p>
            <div className="flex flex-wrap gap-1.5">
              {data.missing_fields.map((m) => <span key={m} className="badge-yellow">{m.replace(/_/g, " ")}</span>)}
            </div>
          </div>
        ) : (
          <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">All required information is available.</p>
        )}

        {Object.keys(scores).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-zinc-500 mb-3">AI Confidence</p>
            <div className="space-y-2">
              {Object.entries(scores).map(([k, v]) => (
                <ConfidenceBar key={k} label={k.replace(/_/g, " ")} value={Number(v) || 0} />
              ))}
            </div>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
}

function RiskCard({ data }: { data: RiskAssessment }) {
  const levelColors: Record<string, string> = {
    low: "text-emerald-600 bg-emerald-50",
    medium: "text-amber-600 bg-amber-50",
    high: "text-red-600 bg-red-50",
  };
  return (
    <CollapsibleCard icon={ShieldAlert} title="Risk Assessment" subtitle={`Rule-based score with explainable signals · ${formatDateTime(data.created_at)}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2.5 rounded-xl ${levelColors[data.risk_level] || "text-zinc-600 bg-zinc-50"}`}>
            <p className="text-2xl font-bold">{data.risk_score}</p>
            <p className="text-xs font-medium opacity-75">/100</p>
          </div>
          <div className="flex-1">
            <RiskBadge level={data.risk_level} />
            <p className="text-sm text-zinc-500 mt-1">{data.recommended_action}</p>
          </div>
        </div>
        {data.signals.length > 0 ? (
          <div>
            <p className="text-xs font-semibold text-zinc-500 mb-2">Risk Signals</p>
            <div className="space-y-1.5">
              {data.signals.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <AlertTriangle size={12} className="text-amber-500 mt-1 shrink-0" />
                  <span className="text-zinc-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No risk signals detected.</p>
        )}
      </div>
    </CollapsibleCard>
  );
}

function DecisionPanel({ claim, risk, actions, busy, onAction }: {
  claim: Claim;
  risk: RiskAssessment | null;
  actions: ClaimActionRecord[];
  busy: string | null;
  onAction: (action: ClaimActionType, notes: string) => Promise<boolean>;
}) {
  const [notes, setNotes] = useState("");
  const available = (Object.keys(ACTION_ALLOWED_FROM) as ClaimActionType[]).filter((a) => ACTION_ALLOWED_FROM[a].includes(claim.status));
  const highRisk = claim.risk_level === "high";

  const approveBlocker =
    !risk ? "Run a risk assessment before approving." :
    highRisk && claim.status !== "escalated" ? "High-risk claim: escalate it first. Approval then needs a second reviewer and a written justification." :
    highRisk ? "High-risk claim: approval needs a written justification and must come from someone other than the person who escalated it." :
    "";

  const submit = async (action: ClaimActionType) => {
    if (await onAction(action, notes.trim())) setNotes("");
  };

  return (
    <CollapsibleCard icon={Gavel} title="Decision" subtitle="Every decision is made by a person and recorded in the audit trail">
      <div className="space-y-4">
        {available.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {claim.status === "approved" || claim.status === "rejected"
              ? `This claim is ${claim.status} and closed.`
              : "Run the AI extraction before taking a decision."}
          </p>
        ) : (
          <>
            {approveBlocker && available.includes("approved") && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">{approveBlocker}</p>
            )}
            <div>
              <label htmlFor="decision-notes" className="block text-xs font-medium text-zinc-500 mb-1.5">
                Notes {highRisk ? "(required to approve or reject)" : "(required to reject)"}
              </label>
              <textarea id="decision-notes" rows={2} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field resize-none" placeholder="Justification, verification performed, information requested..." />
            </div>
            <div className="flex flex-wrap gap-2">
              {available.map((a) => (
                <button
                  key={a}
                  onClick={() => submit(a)}
                  disabled={busy !== null || (a === "approved" && (!risk || (highRisk && claim.status !== "escalated")))}
                  className={clsx(a === "approved" ? "btn-primary" : "btn-secondary", "text-xs disabled:opacity-40")}
                >
                  {busy === a ? "Saving..." : ACTION_LABELS[a]}
                </button>
              ))}
            </div>
          </>
        )}

        {actions.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-semibold text-zinc-500 mb-2">History</p>
            <div className="space-y-2">
              {actions.map((a) => (
                <div key={a.id} className="text-sm p-3 bg-zinc-50 rounded-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{HISTORY_LABELS[a.action]} · <span className="text-zinc-500 font-normal">{a.performed_by}</span></span>
                    <span className="text-xs text-zinc-400">{formatDateTime(a.created_at)}</span>
                  </div>
                  {a.notes && <p className="text-zinc-600 mt-1">{a.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
}

function ConversationCard({ messages, followUp, canReply, busy, onReply }: {
  messages: ConversationMessage[];
  followUp: string[] | null;
  canReply: boolean;
  busy: string | null;
  onReply: (message: string) => Promise<boolean>;
}) {
  const [reply, setReply] = useState("");
  return (
    <CollapsibleCard icon={MessageSquare} dark={false} title="Customer Conversation" subtitle={`${messages.length} message(s)`} defaultOpen={messages.length > 0 || canReply}>
      <div className="space-y-4">
        {followUp !== null && followUp.length === 0 && (
          <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">No missing information: no follow-up question needed.</p>
        )}
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-400">No messages yet.</p>
        ) : (
          <div className="space-y-2">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "customer" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm ${
                  m.role === "customer" ? "bg-zinc-900 text-white rounded-br-sm" : "bg-zinc-100 text-zinc-700 rounded-bl-sm"
                }`}>
                  <p className="whitespace-pre-wrap">{m.message}</p>
                  <p className="text-[10px] mt-1 text-zinc-400">
                    {m.role === "agent" ? "AI agent" : "Customer"} · {formatDateTime(m.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {canReply && (
          <form
            onSubmit={async (e) => { e.preventDefault(); if (await onReply(reply.trim())) setReply(""); }}
            className="space-y-2 pt-2 border-t border-zinc-100"
          >
            <label htmlFor="customer-reply" className="block text-xs font-medium text-zinc-500 pt-2">
              Record the customer&apos;s reply (email, phone...). The AI updates the claim with the new information.
            </label>
            <textarea id="customer-reply" rows={2} maxLength={5000} value={reply} onChange={(e) => setReply(e.target.value)} className="input-field resize-none" placeholder="e.g. My policy number is POL-2024-118" />
            <button type="submit" disabled={busy !== null || !reply.trim()} className="btn-secondary text-xs disabled:opacity-40">
              {busy === "reply" ? "Updating claim..." : "Record reply"}
            </button>
          </form>
        )}
      </div>
    </CollapsibleCard>
  );
}

function AttachmentsCard({ claimId, attachments }: { claimId: string; attachments: Attachment[] }) {
  const [error, setError] = useState("");
  return (
    <CollapsibleCard icon={Paperclip} dark={false} title="Documents" subtitle={`${attachments.length} file(s) provided by the customer`} defaultOpen={attachments.length > 0}>
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
      {attachments.length === 0 ? (
        <p className="text-sm text-zinc-400">No documents.</p>
      ) : (
        <div className="space-y-1.5">
          {attachments.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-100">
              <FileText size={16} className="text-zinc-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{a.filename}</p>
                <p className="text-xs text-zinc-400">{(a.size_bytes / 1024).toFixed(0)} KB · {formatDateTime(a.created_at)}</p>
              </div>
              <button
                onClick={() => downloadAttachment(claimId, a).catch((err) => setError(errorText(err)))}
                aria-label={`Download ${a.filename}`}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
              >
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </CollapsibleCard>
  );
}

function AuditCard({ events }: { events: AuditEvent[] }) {
  return (
    <CollapsibleCard icon={History} dark={false} title="Audit Trail" subtitle={`${events.length} event(s)`} defaultOpen={false}>
      <ol className="space-y-3">
        {events.map((e) => (
          <li key={e.id} className="text-sm border-l-2 border-zinc-200 pl-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={clsx("font-medium", e.event_type === "ai_pipeline_failed" && "text-red-600")}>
                {EVENT_LABELS[e.event_type] || e.event_type}
              </span>
              <span className="text-xs text-zinc-400">{formatDateTime(e.created_at)}</span>
            </div>
            <p className="text-xs text-zinc-400">by {e.actor}</p>
            {Object.entries(e.event_data || {}).length > 0 && (
              <dl className="mt-1 text-xs text-zinc-500 space-y-0.5">
                {Object.entries(e.event_data).map(([k, v]) => (
                  <div key={k}><dt className="inline font-medium">{k.replace(/_/g, " ")}:</dt> <dd className="inline">{formatEventValue(v)}</dd></div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ol>
    </CollapsibleCard>
  );
}

interface ClaimBundle {
  claim: Claim;
  extraction: Extraction | null;
  risk: RiskAssessment | null;
  conversation: ConversationMessage[];
  actions: ClaimActionRecord[];
  attachments: Attachment[];
  audit: AuditEvent[];
}

async function fetchClaimBundle(claimId: string): Promise<ClaimBundle> {
  const [claim, extraction, risk, conversation, actions, attachments, audit] = await Promise.all([
    getClaim(claimId), getExtraction(claimId), getRisk(claimId), getConversation(claimId),
    getActions(claimId), getAttachments(claimId), getAuditTrail(claimId),
  ]);
  return { claim, extraction, risk, conversation, actions, attachments, audit };
}

function ClaimDetailContent({ claimId }: { claimId: string }) {
  const [data, setData] = useState<ClaimBundle | null>(null);
  const [followUp, setFollowUp] = useState<string[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchClaimBundle(claimId)
      .then((bundle) => { if (!cancelled) setData(bundle); })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiError && err.status === 404 ? "This claim does not exist." : errorText(err));
      });
    return () => { cancelled = true; };
  }, [claimId]);

  /** Runs an operation, then reloads everything so the page reflects the server state. */
  const run = async (key: string, operation: () => Promise<unknown>): Promise<boolean> => {
    setBusy(key);
    setError("");
    try {
      await operation();
      setData(await fetchClaimBundle(claimId));
      return true;
    } catch (err) {
      setError(errorText(err));
      return false;
    } finally {
      setBusy(null);
    }
  };

  if (loadError) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">{loadError}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
          <span className="text-sm text-zinc-400">Loading claim...</span>
        </div>
      </div>
    );
  }

  const { claim, extraction, risk, conversation, actions, attachments, audit } = data;
  const closed = claim.status === "approved" || claim.status === "rejected";
  const pipelineFailed = !extraction && audit.some((e) => e.event_type === "ai_pipeline_failed");
  const spinner = (light: boolean) => (
    <div className={clsx("w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin", light ? "border-white" : "border-zinc-400")} />
  );

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      {error && (
        <div className="flex items-start justify-between gap-3 bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Dismiss" className="shrink-0"><X size={14} /></button>
        </div>
      )}

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center text-zinc-600 text-sm font-medium shrink-0">
                {claim.customer_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold">{claim.customer_name}</h1>
                <p className="text-xs text-zinc-400 font-mono break-all">{claim.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <StatusBadge status={claim.status} />
              <RiskBadge level={claim.risk_level} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => run("extract", () => extractClaim(claimId))} disabled={closed || busy !== null} className="btn-primary flex items-center gap-2 text-xs disabled:opacity-40">
              {busy === "extract" ? spinner(true) : <Brain size={14} />}
              {busy === "extract" ? "Analyzing..." : extraction ? "Re-run AI analysis" : "Analyze with AI"}
            </button>
            <button
              onClick={() => run("risk", () => assessRisk(claimId))}
              disabled={closed || busy !== null || !extraction}
              title={!extraction ? "Run the AI analysis first" : undefined}
              className="btn-secondary flex items-center gap-2 text-xs disabled:opacity-40"
            >
              {busy === "risk" ? spinner(false) : <ShieldAlert size={14} />}
              {busy === "risk" ? "Scoring..." : risk ? "Re-assess Risk" : "Assess Risk"}
            </button>
            <button
              onClick={() => run("followup", async () => setFollowUp((await triggerFollowUp(claimId)).questions))}
              disabled={closed || busy !== null || !extraction}
              title={!extraction ? "Run the AI analysis first" : undefined}
              className="btn-secondary flex items-center gap-2 text-xs disabled:opacity-40"
            >
              {busy === "followup" ? spinner(false) : <MessageSquare size={14} />}
              {busy === "followup" ? "Generating..." : "Follow-up"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-zinc-100">
          {[
            { label: "Type", value: claim.incident_type },
            { label: "Amount", value: claim.estimated_amount ? `$${Number(claim.estimated_amount).toLocaleString()}` : null },
            { label: "Incident Date", value: claim.incident_date },
            { label: "Location", value: claim.incident_location },
            { label: "Policy", value: claim.policy_number },
            { label: "Submitted", value: formatDateTime(claim.created_at) },
          ].map((f) => (
            <div key={f.label} className="min-w-0">
              <p className="text-[11px] text-zinc-400 font-medium mb-0.5">{f.label}</p>
              <p className="text-sm font-medium break-words">{f.value || "—"}</p>
            </div>
          ))}
          <div className="min-w-0 col-span-2">
            <p className="text-[11px] text-zinc-400 font-medium mb-0.5">Contact</p>
            <a href={`mailto:${claim.customer_email}`} className="text-sm font-medium inline-flex items-center gap-1.5 hover:underline break-all">
              <Mail size={12} className="text-zinc-400 shrink-0" />{claim.customer_email}
            </a>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400 font-medium mb-2">Description</p>
          <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-lg whitespace-pre-wrap">{claim.raw_description}</p>
        </div>
      </div>

      {pipelineFailed && (
        <div className="flex items-start gap-2 bg-amber-50 text-amber-800 p-3 rounded-lg text-sm border border-amber-200">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>Automatic AI processing failed for this claim (see the audit trail). Run the analysis manually.</span>
        </div>
      )}

      <div className="space-y-4">
        <DecisionPanel
          claim={claim}
          risk={risk}
          actions={actions}
          busy={busy}
          onAction={(action, notes) => run(action, () => claimAction(claimId, action, notes))}
        />
        {extraction && <ExtractionCard data={extraction} />}
        {risk && <RiskCard data={risk} />}
        <ConversationCard
          messages={conversation}
          followUp={followUp}
          canReply={!closed && extraction !== null}
          busy={busy}
          onReply={(message) => run("reply", () => customerRespond(claimId, message))}
        />
        <AttachmentsCard claimId={claimId} attachments={attachments} />
        <AuditCard events={audit} />

        {!extraction && !pipelineFailed && (
          <div className="card p-12 text-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="text-zinc-400" size={24} />
            </div>
            <h3 className="text-sm font-semibold mb-1">AI Analysis</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              New claims are analyzed automatically within seconds. You can also run the analysis manually with the
              &quot;Analyze with AI&quot; button.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClaimDetail() {
  const params = useParams<{ id: string }>();
  return (
    <RequireAuth>
      <ClaimDetailContent claimId={params.id} />
    </RequireAuth>
  );
}
