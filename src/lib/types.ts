export type Severity = "low" | "medium" | "high" | "critical";

export type RiskCategory =
  | "credential-request"
  | "payment-request"
  | "urgency-tactic"
  | "threat"
  | "fake-reward"
  | "fake-authority"
  | "fake-delivery"
  | "fake-employment"
  | "fake-investment"
  | "impersonation"
  | "platform-switch"
  | "suspicious-url"
  | "social-engineering"
  | "deception"
  | "financial-promise"
  | "secrecy"
  | "software-install"
  | "unknown-number"
  | "pressure-to-bypass"
  | "excessive-punctuation"
  | "suspicious-grammar";

export type RiskLevel = "low" | "suspicious" | "high" | "very-high";

export interface Finding {
  id: string;
  category: RiskCategory;
  severity: Severity;
  title: string;
  explanation: string;
  matchedText?: string;
  recommendation: string;
  icon: string;
}

export interface URLAnalysis {
  url: string;
  issues: string[];
  severity: Severity;
}

export interface AnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  verdict: string;
  findings: Finding[];
  detectedURLs: URLAnalysis[];
  recommendations: string[];
  analyzedAt: Date;
}

export interface ExampleMessage {
  id: string;
  title: string;
  category: string;
  description: string;
  message: string;
  expectedRisk: RiskLevel;
}
