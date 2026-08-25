const API_BASE = "/api";

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API error");
  }
  return res.json();
}

export async function submitClaim(data: any) {
  return apiFetch("/claims", { method: "POST", body: JSON.stringify(data) });
}

export async function listClaims(params?: { status?: string; risk_level?: string; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.risk_level) qs.set("risk_level", params.risk_level);
  if (params?.limit) qs.set("limit", String(params.limit));
  return apiFetch(`/claims?${qs.toString()}`);
}

export async function getClaim(id: string) {
  return apiFetch(`/claims/${id}`);
}

export async function claimAction(id: string, data: any) {
  return apiFetch(`/claims/${id}/action`, { method: "PUT", body: JSON.stringify(data) });
}

export async function extractClaim(id: string) {
  return apiFetch(`/agent/extract/${id}`, { method: "POST" });
}

export async function getConversation(id: string) {
  return apiFetch(`/agent/conversation/${id}`);
}

export async function triggerFollowUp(id: string) {
  return apiFetch(`/agent/follow-up/${id}`, { method: "POST" });
}

export async function customerRespond(id: string, message: string) {
  return apiFetch(`/agent/respond/${id}`, { method: "POST", body: JSON.stringify({ message }) });
}

export async function assessRisk(id: string) {
  return apiFetch(`/risk/assess/${id}`, { method: "POST" });
}

export async function getRisk(id: string) {
  return apiFetch(`/risk/${id}`);
}

export async function getDashboardSummary() {
  return apiFetch("/dashboard/summary");
}

export async function getAnalyticsMetrics() {
  return apiFetch("/analytics/metrics");
}
