import { clearSession, getToken } from "@/lib/session";
import type {
  AnalyticsMetrics, Attachment, AuditEvent, Claim, ClaimActionRecord, ClaimActionType, ClaimInput,
  ClaimListItem, ClaimStatus, ConversationMessage, DashboardSummary, Extraction, RiskAssessment,
  RiskLevel, TokenResponse, User,
} from "@/lib/types";

const API_BASE = "/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function errorMessage(body: unknown, fallback: string): string {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  // FastAPI validation errors: [{loc: [...], msg: "..."}]
  if (Array.isArray(detail) && detail.length) {
    return detail
      .map((d: { loc?: unknown[]; msg?: string }) => {
        const field = d.loc?.filter((p) => p !== "body").join(".");
        return field ? `${field}: ${d.msg}` : d.msg;
      })
      .join("; ");
  }
  return fallback;
}

async function request(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401 && token) {
    // Expired or revoked session: back to the login page. A full navigation also drops stale page state.
    clearSession();
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- outside React, no router
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, errorMessage(body, res.statusText || "Request failed"));
  }
  return res;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await request(path, options);
  return res.json() as Promise<T>;
}

/** Resolves to null on 404 instead of throwing. */
async function apiFetchOptional<T>(path: string): Promise<T | null> {
  try {
    return await apiFetch<T>(path);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

// Auth
export function login(email: string, password: string) {
  return apiFetch<TokenResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function register(data: { email: string; full_name: string; password: string; role: string }) {
  return apiFetch<TokenResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) });
}

export function getMe() {
  return apiFetch<User>("/auth/me");
}

// Claims
export function submitClaim(data: ClaimInput) {
  return apiFetch<Claim>("/claims", { method: "POST", body: JSON.stringify(data) });
}

export function uploadAttachments(claimId: string, files: File[]) {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  return apiFetch<Attachment[]>(`/claims/${claimId}/attachments`, { method: "POST", body: form });
}

export function listClaims(params?: { status?: ClaimStatus | ""; risk_level?: RiskLevel | ""; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.risk_level) qs.set("risk_level", params.risk_level);
  if (params?.limit) qs.set("limit", String(params.limit));
  return apiFetch<ClaimListItem[]>(`/claims?${qs.toString()}`);
}

export function getClaim(id: string) {
  return apiFetch<Claim>(`/claims/${id}`);
}

export function claimAction(id: string, action: ClaimActionType, notes?: string) {
  return apiFetch<{ status: string; new_status: ClaimStatus }>(`/claims/${id}/action`, {
    method: "PUT",
    body: JSON.stringify({ action, notes: notes || null }),
  });
}

export function getActions(id: string) {
  return apiFetch<ClaimActionRecord[]>(`/claims/${id}/actions`);
}

export function getAuditTrail(id: string) {
  return apiFetch<AuditEvent[]>(`/claims/${id}/audit`);
}

export function getAttachments(id: string) {
  return apiFetch<Attachment[]>(`/claims/${id}/attachments`);
}

export async function downloadAttachment(claimId: string, attachment: Attachment) {
  const res = await request(`/claims/${claimId}/attachments/${attachment.id}`);
  const url = URL.createObjectURL(await res.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = attachment.filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// AI agent
export function extractClaim(id: string) {
  return apiFetch<Extraction>(`/agent/extract/${id}`, { method: "POST" });
}

export function getExtraction(id: string) {
  return apiFetchOptional<Extraction>(`/agent/extraction/${id}`);
}

export function getConversation(id: string) {
  return apiFetch<ConversationMessage[]>(`/agent/conversation/${id}`);
}

export function triggerFollowUp(id: string) {
  return apiFetch<{ questions: string[] }>(`/agent/follow-up/${id}`, { method: "POST" });
}

export function customerRespond(id: string, message: string) {
  return apiFetch<{ status: ClaimStatus; still_missing: string[] }>(`/agent/respond/${id}`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

// Risk
export function assessRisk(id: string) {
  return apiFetch<RiskAssessment>(`/risk/assess/${id}`, { method: "POST" });
}

export function getRisk(id: string) {
  return apiFetchOptional<RiskAssessment>(`/risk/${id}`);
}

// Dashboard
export function getDashboardSummary() {
  return apiFetch<DashboardSummary>("/dashboard/summary");
}

export function getAnalyticsMetrics() {
  return apiFetch<AnalyticsMetrics>("/analytics/metrics");
}
