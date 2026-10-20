export type ClaimStatus =
  | "submitted"
  | "extracting"
  | "follow_up"
  | "ready_for_review"
  | "under_review"
  | "approved"
  | "rejected"
  | "escalated";

export type RiskLevel = "unrated" | "low" | "medium" | "high";

export type ClaimActionType = "approved" | "rejected" | "escalated" | "info_requested";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ClaimInput {
  customer_name: string;
  customer_email: string;
  raw_description: string;
  policy_number: string | null;
  incident_type: string | null;
  incident_date: string | null;
  incident_location: string | null;
  estimated_amount: number | null;
}

export interface Claim {
  id: string;
  customer_name: string;
  customer_email: string;
  raw_description: string;
  policy_number: string | null;
  incident_type: string | null;
  incident_date: string | null;
  incident_location: string | null;
  // Decimals are serialized as strings by the API.
  estimated_amount: string | null;
  status: ClaimStatus;
  risk_level: RiskLevel;
  created_at: string;
  updated_at: string;
}

export type ClaimListItem = Pick<
  Claim,
  "id" | "customer_name" | "incident_type" | "status" | "risk_level" | "estimated_amount" | "created_at"
>;

export interface ExtractedData {
  incident_type?: string | null;
  incident_date?: string | null;
  incident_location?: string | null;
  estimated_amount?: number | null;
  damage_description?: string | null;
  other_party_info?: string | null;
  policy_number?: string | null;
}

export interface Extraction {
  id: string;
  claim_id: string;
  extracted_data: ExtractedData;
  missing_fields: string[];
  confidence_scores: Record<string, number>;
  created_at: string;
}

export interface RiskAssessment {
  id: string;
  claim_id: string;
  risk_score: number;
  risk_level: Exclude<RiskLevel, "unrated">;
  signals: string[];
  explanation: string;
  recommended_action: string;
  created_at: string;
}

export interface ConversationMessage {
  id: string;
  role: "agent" | "customer";
  message: string;
  message_type: string;
  created_at: string;
}

export interface ClaimActionRecord {
  id: string;
  action: ClaimActionType;
  performed_by: string;
  notes: string | null;
  created_at: string;
}

export interface AuditEvent {
  id: string;
  claim_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  actor: string;
  created_at: string;
}

export interface Attachment {
  id: string;
  claim_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
}

export interface DashboardSummary {
  total_claims: number;
  by_status: Partial<Record<ClaimStatus, number>>;
  by_risk: Partial<Record<RiskLevel, number>>;
}

export interface AnalyticsMetrics {
  total_claims: number;
  approved_claims: number;
  rejected_claims: number;
  high_risk_claims: number;
  under_review: number;
  awaiting_customer: number;
  ai_processed_claims: number;
  ai_processed_rate: number | null;
  assessed_claims: number;
  fast_track_eligible: number;
  human_review_rate: number | null;
  avg_decision_hours: number | null;
  avg_triage_minutes: number | null;
  by_risk: Record<RiskLevel, number>;
  by_type: { name: string; count: number }[];
  claims_per_day: { date: string; count: number }[];
  claims_per_week: { week_start: string; count: number }[];
}
