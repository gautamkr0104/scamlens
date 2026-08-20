"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Search,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { exampleMessages } from "@/lib/examples";
import { formatCharacterCount } from "@/lib/utils";
import { AnalysisResult, ExampleMessage, RiskLevel } from "@/lib/types";

interface AnalyzerProps {
  onResults: (result: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
}

export default function Analyzer({
  onResults,
  isAnalyzing,
  setIsAnalyzing,
}: AnalyzerProps) {
  const [message, setMessage] = useState("");
  const [showExamples, setShowExamples] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);

  const maxChars = 10000;

  const handleAnalyze = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Please enter a message to analyze.");
      textareaRef.current?.focus();
      return;
    }

    if (trimmed.length < 10) {
      setError("Message is too short for meaningful analysis. Please enter more text.");
      return;
    }

    setError("");
    setIsAnalyzing(true);

    setTimeout(() => {
      import("@/lib/analysis-engine").then(({ analyzeMessage }) => {
        const result = analyzeMessage(trimmed);
        onResults(result);
        setIsAnalyzing(false);
      });
    }, 600);
  }, [message, onResults, setIsAnalyzing]);

  const handleClear = useCallback(() => {
    setMessage("");
    setError("");
    onResults(null);
    textareaRef.current?.focus();
  }, [onResults]);

  const handleExampleClick = useCallback(
    (example: ExampleMessage) => {
      setMessage(example.message);
      setError("");
      setShowExamples(false);
      onResults(null);
      textareaRef.current?.focus();
    },
    [onResults]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleAnalyze();
      }
    },
    [handleAnalyze]
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = Math.min(
        textareaRef.current.scrollHeight,
        300
      );
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  const getRiskTagColor = (risk: RiskLevel): string => {
    switch (risk) {
      case "very-high":
        return "bg-red-500/15 text-red-400 border-red-500/25";
      case "high":
        return "bg-orange-500/15 text-orange-400 border-orange-500/25";
      case "suspicious":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";
      case "low":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    }
  };

  const getRiskTagLabel = (risk: RiskLevel): string => {
    switch (risk) {
      case "very-high":
        return "Very High Risk";
      case "high":
        return "High Risk";
      case "suspicious":
        return "Suspicious";
      case "low":
        return "Low Risk";
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6" aria-label="Message Analyzer">
      <div className="glass rounded-2xl p-5 sm:p-8 animate-pulse-glow">
        <div className="relative">
          <label htmlFor="message-input" className="sr-only">
            Enter suspicious message to analyze
          </label>
          <textarea
            ref={textareaRef}
            id="message-input"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value.slice(0, maxChars));
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Paste a suspicious message here..."
            className="w-full min-h-[120px] max-h-[300px] bg-navy-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 resize-none text-base leading-relaxed focus:border-blue-500/50 transition-colors scrollbar-thin"
            disabled={isAnalyzing}
            aria-describedby="char-count"
            aria-invalid={!!error}
          />

          <div className="flex items-center justify-between mt-2 px-1">
            <span
              id="char-count"
              className="text-xs text-slate-500"
              aria-live="polite"
            >
              {formatCharacterCount(message.length)} / {formatCharacterCount(maxChars)}
            </span>
            {message.length > 0 && (
              <span className="text-xs text-slate-500">
                Ctrl+Enter to analyze
              </span>
            )}
          </div>
        </div>

        {error && (
          <div
            className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="analyze-btn flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Analyze message"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Analyze Message
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            disabled={isAnalyzing || !message}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Clear message"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-700/40">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
            aria-expanded={showExamples}
          >
            <Sparkles className="w-4 h-4" />
            Try an example
            {showExamples ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showExamples && (
            <div
              ref={examplesRef}
              className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {exampleMessages.map((example) => (
                <button
                  key={example.id}
                  onClick={() => handleExampleClick(example)}
                  className="text-left p-3 rounded-lg bg-navy-900/40 border border-slate-700/30 hover:border-blue-500/30 hover:bg-navy-800/40 transition-all group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors truncate">
                      {example.title}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap ${getRiskTagColor(
                        example.expectedRisk
                      )}`}
                    >
                      {getRiskTagLabel(example.expectedRisk)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {example.category}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
