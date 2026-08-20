"use client";

import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  Info,
} from "lucide-react";
import {
  AnalysisResult,
  Finding,
  RiskLevel,
  URLAnalysis,
  Severity,
} from "@/lib/types";
import {
  getRiskColor,
  getRiskBgColor,
  getSeverityColor,
  getSeverityLabel,
  getRiskLabel,
  getRiskScoreGradient,
} from "@/lib/utils";
import {
  KeyRound,
  Lock,
  Hash,
  Landmark,
  CreditCard,
  ShieldAlert as ShieldAlertIcon,
  Banknote,
  Bitcoin,
  Gift,
  Wallet,
  Clock,
  AlertTriangle,
  Ban,
  Trophy,
  Building,
  Package,
  Briefcase,
  TrendingUp,
  UserX,
  ArrowRightLeft,
  Link,
  Brain,
  EyeOff,
  Download,
  Phone,
  ShieldOff,
  Type,
  SpellCheck,
  Sparkles,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "key-round": KeyRound,
  lock: Lock,
  hash: Hash,
  landmark: Landmark,
  "credit-card": CreditCard,
  "shield-alert": ShieldAlertIcon,
  banknote: Banknote,
  bitcoin: Bitcoin,
  gift: Gift,
  wallet: Wallet,
  clock: Clock,
  "alert-triangle": AlertTriangle,
  ban: Ban,
  trophy: Trophy,
  building: Building,
  package: Package,
  briefcase: Briefcase,
  "trending-up": TrendingUp,
  "user-x": UserX,
  "arrow-right-left": ArrowRightLeft,
  link: Link,
  brain: Brain,
  "eye-off": EyeOff,
  download: Download,
  phone: Phone,
  "shield-off": ShieldOff,
  type: Type,
  "spell-check": SpellCheck,
  sparkles: Sparkles,
};

function ScoreCircle({
  score,
  riskLevel,
}: {
  score: number;
  riskLevel: RiskLevel;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const gradientClass = getRiskScoreGradient(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        className="score-ring -rotate-90"
        role="img"
        aria-label={`Risk score: ${score} out of 100`}
      >
        <defs>
          <linearGradient
            id="scoreGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={
                score >= 75
                  ? "#ef4444"
                  : score >= 50
                  ? "#f97316"
                  : score >= 25
                  ? "#facc15"
                  : "#34d399"
              }
            />
            <stop
              offset="100%"
              stopColor={
                score >= 75
                  ? "#dc2626"
                  : score >= 50
                  ? "#ea580c"
                  : score >= 25
                  ? "#eab308"
                  : "#10b981"
              }
            />
          </linearGradient>
        </defs>
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="rgba(59, 130, 246, 0.08)"
          strokeWidth="8"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-3xl font-bold ${getRiskColor(riskLevel)}`}
          aria-hidden="true"
        >
          {animatedScore}
        </span>
        <span className="text-xs text-slate-500 font-medium">
          /100
        </span>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border ${getSeverityColor(
        severity
      )}`}
    >
      {getSeverityLabel(severity)}
    </span>
  );
}

function FindingCard({
  finding,
  index,
}: {
  finding: Finding;
  index: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80 * index);
    return () => clearTimeout(timer);
  }, [index]);

  const IconComponent =
    ICON_MAP[finding.icon] || ShieldAlert;

  return (
    <div
      className={`glass rounded-xl p-4 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(
            finding.severity
          )}`}
        >
          <IconComponent className="w-4 h-4" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="text-sm font-semibold text-slate-100">
              {finding.title}
            </h4>
            <SeverityBadge severity={finding.severity} />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {finding.explanation}
          </p>
          {finding.matchedText && (
            <div className="mt-2 px-2.5 py-1.5 rounded-md bg-navy-950/60 border border-slate-700/30 inline-block max-w-full">
              <code className="text-xs text-blue-300 break-all">
                &ldquo;{finding.matchedText}&rdquo;
              </code>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-2">
            <span className="text-slate-400 font-medium">Recommendation:</span>{" "}
            {finding.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}

function URLResultCard({ urlResult }: { urlResult: URLAnalysis }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(
            urlResult.severity
          )}`}
        >
          <ExternalLink className="w-4 h-4" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <code className="text-sm text-blue-300 break-all block mb-1">
            {urlResult.url}
          </code>
          <ul className="space-y-0.5">
            {urlResult.issues.map((issue, i) => (
              <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                <span className="text-slate-600 mt-0.5">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface ResultsProps {
  result: AnalysisResult;
  onClear: () => void;
}

export default function Results({ result, onClear }: ResultsProps) {
  const [announced, setAnnounced] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!announced) {
      setAnnounced(true);
    }
  }, [announced]);

  useEffect(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const flagFindings = result.findings.filter(
    (f) => f.severity === "critical" || f.severity === "high"
  );
  const otherFindings = result.findings.filter(
    (f) => f.severity !== "critical" && f.severity !== "high"
  );

  return (
    <section
      ref={resultsRef}
      className="max-w-3xl mx-auto px-4 sm:px-6"
      aria-label="Analysis Results"
      tabIndex={-1}
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Analysis complete. Risk score: {result.riskScore} out of 100. Verdict:{" "}
        {result.verdict}. {result.findings.length} findings detected.
      </div>

      <div className="glass-strong rounded-2xl p-5 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Analysis Results</h3>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            aria-label="Analyze another message"
          >
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <ScoreCircle score={result.riskScore} riskLevel={result.riskLevel} />
          <div className={`mt-4 px-4 py-1.5 rounded-full border text-sm font-bold tracking-wide ${getRiskBgColor(result.riskLevel)} ${getRiskColor(result.riskLevel)}`}>
            {getRiskLabel(result.riskLevel)}
          </div>
          <h2 className="text-xl font-semibold text-white mt-3">
            {result.verdict}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-md">
            {result.findings.length > 0
              ? `Found ${result.findings.length} ${
                  result.findings.length === 1 ? "indicator" : "indicators"
                } that may suggest this message is not trustworthy.`
              : "No obvious scam indicators were detected, but always exercise caution."}
          </p>
        </div>

        {flagFindings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Red Flags Detected
            </h3>
            <div className="space-y-3">
              {flagFindings.map((finding, i) => (
                <FindingCard key={finding.id} finding={finding} index={i} />
              ))}
            </div>
          </div>
        )}

        {otherFindings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              Additional Observations
            </h3>
            <div className="space-y-3">
              {otherFindings.map((finding, i) => (
                <FindingCard
                  key={finding.id}
                  finding={finding}
                  index={i + flagFindings.length}
                />
              ))}
            </div>
          </div>
        )}

        {result.detectedURLs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-blue-400" />
              Detected URLs
            </h3>
            <div className="space-y-3">
              {result.detectedURLs.map((urlResult, i) => (
                <URLResultCard key={i} urlResult={urlResult} />
              ))}
            </div>
          </div>
        )}

        {result.recommendations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Recommended Actions
            </h3>
            <div className="glass rounded-xl p-4">
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <span className="text-emerald-400 font-bold mt-0.5 flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="border-t border-slate-700/40 pt-5 mt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onClear}
              className="analyze-btn flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
              aria-label="Analyze another message"
            >
              <ArrowLeft className="w-4 h-4" />
              Analyze Another Message
            </button>
          </div>

          <div className="mt-4 flex items-start gap-2 px-1">
            <Info className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ScamLens is an educational risk-analysis tool and cannot guarantee
              whether a message is legitimate or fraudulent. Always verify
              suspicious communications through official channels.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
