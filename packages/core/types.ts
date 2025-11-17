// Core shared types
// Mirrors Toon schemas (MessageIn, InsightsOut, Detection, Nudge)

export type Relationship =
  | "peer"
  | "manager"
  | "customer"
  | "friend"
  | "family"
  | "other";

export type Channel =
  | "email"
  | "chat"
  | "slack"
  | "whatsapp"
  | "messenger"
  | "telegram"
  | "imessage";

export type ThreadState = "draft" | "in_progress" | "sent";

export interface MessageContext {
  participants: string[];
  relationship: Relationship;
  channel: Channel;
  locale?: string;
}

export interface MessageIn {
  text: string;
  context: MessageContext;
  thread_state?: ThreadState;
  flags?: string[];
}

export type Severity = "info" | "notice" | "warn" | "block";

export interface Detection {
  type: string; // e.g. "ambiguity", "missing_owner"
  span: [number, number]; // [start, end] indices in text
  severity: Severity;
  evidence?: string;
  confidence?: number;
}

export interface NudgeExample {
  before: string;
  after: string;
}

export interface Nudge {
  id: string;
  title: string;
  goal: "Clarity" | "Respect" | "Empathy" | "Actionability" | "Specificity";
  trigger: string; // matches Detection.type
  micro_copy: string;
  fix_strategy?: string;
  example_before_after?: NudgeExample;
}

export interface SubScores {
  clarity: number;
  respect: number;
  empathy: number;
  specificity: number;
  actionability: number;
}

export interface InsightsOut {
  mqs: number; // 0–100
  sub_scores: SubScores;
  detections: Detection[];
  nudges: Nudge[];
  suggested_rewrite?: string;
  rationale?: string[];
}
