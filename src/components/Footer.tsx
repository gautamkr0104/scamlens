"use client";

import { Shield, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
            <span className="text-lg font-bold gradient-text">ScamLens</span>
            <ShieldCheck className="w-4 h-4 text-blue-300" strokeWidth={2} />
          </div>

          <p className="text-sm text-slate-500 mb-4 max-w-md">
            Built for safer digital communication.
          </p>

          <div className="glass rounded-xl px-4 py-3 max-w-lg mb-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Privacy:</span>{" "}
              Your message is analyzed entirely in your browser. ScamLens does
              not need to upload your message to a server. No data is stored
              or transmitted.
            </p>
          </div>

          <div className="glass rounded-xl px-4 py-3 max-w-lg mb-6">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Disclaimer:</span>{" "}
              ScamLens is an educational risk-analysis tool that uses pattern
              matching. It cannot guarantee whether a message is legitimate or
              fraudulent. Always verify suspicious communications independently.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>MIT License</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
