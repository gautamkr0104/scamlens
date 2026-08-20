import { RiskLevel, Severity } from "./types";

export function getRiskColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "very-high":
      return "text-red-500";
    case "high":
      return "text-orange-500";
    case "suspicious":
      return "text-yellow-400";
    case "low":
      return "text-emerald-400";
  }
}

export function getRiskBgColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "very-high":
      return "bg-red-500/10 border-red-500/30";
    case "high":
      return "bg-orange-500/10 border-orange-500/30";
    case "suspicious":
      return "bg-yellow-400/10 border-yellow-400/30";
    case "low":
      return "bg-emerald-400/10 border-emerald-400/30";
  }
}

export function getRiskGradient(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "very-high":
      return "from-red-600 to-red-500";
    case "high":
      return "from-orange-600 to-orange-500";
    case "suspicious":
      return "from-yellow-500 to-yellow-400";
    case "low":
      return "from-emerald-600 to-emerald-400";
  }
}

export function getRiskScoreGradient(score: number): string {
  if (score >= 75) return "from-red-500 to-red-600";
  if (score >= 50) return "from-orange-500 to-orange-600";
  if (score >= 25) return "from-yellow-400 to-yellow-500";
  return "from-emerald-400 to-emerald-500";
}

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case "critical":
      return "text-red-400 bg-red-500/15 border-red-500/30";
    case "high":
      return "text-orange-400 bg-orange-500/15 border-orange-500/30";
    case "medium":
      return "text-yellow-400 bg-yellow-500/15 border-yellow-500/30";
    case "low":
      return "text-blue-300 bg-blue-500/15 border-blue-500/30";
  }
}

export function getSeverityLabel(severity: Severity): string {
  switch (severity) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
  }
}

export function getRiskLabel(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "very-high":
      return "VERY HIGH RISK";
    case "high":
      return "HIGH RISK";
    case "suspicious":
      return "SUSPICIOUS";
    case "low":
      return "LOW RISK";
  }
}

export function formatCharacterCount(count: number): string {
  return count.toLocaleString();
}
