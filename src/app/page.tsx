"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Analyzer from "@/components/Analyzer";
import Results from "@/components/Results";
import Footer from "@/components/Footer";
import { AnalysisResult } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleResults = useCallback((newResult: AnalysisResult | null) => {
    setResult(newResult);
  }, []);

  const handleClear = useCallback(() => {
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Header />

        <main className="pb-12 sm:pb-16">
          <Analyzer
            onResults={handleResults}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
          />

          {result && (
            <div className="mt-8 sm:mt-12">
              <Results result={result} onClear={handleClear} />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
