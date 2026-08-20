"use client";

import { Shield, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12 text-center">
        <div
          className={`flex items-center justify-center gap-3 mb-6 transition-all duration-700 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" strokeWidth={1.5} />
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300 absolute -bottom-1 -right-1" strokeWidth={2} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="gradient-text">ScamLens</span>
          </h1>
        </div>

        <h2
          className={`text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-4 transition-all duration-700 delay-100 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          Spot the red flags before you click.
        </h2>

        <p
          className={`text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-2 transition-all duration-700 delay-200 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          Paste any suspicious message and ScamLens will analyze it for scam
          indicators — all privately in your browser.
        </p>

        <div
          className={`inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium transition-all duration-700 delay-300 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          100% Private — Your messages never leave your browser
        </div>
      </div>
    </header>
  );
}
