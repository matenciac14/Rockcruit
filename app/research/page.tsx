"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CategorizedList } from "../components/categorized-list";
import { ResearchResult } from "../services/exa-service";

interface CategorizedResults {
  worthExpanding: ResearchResult[];
  notWorthExpanding: ResearchResult[];
}

export default function ResearchPage() {
  const [results, setResults] = useState<CategorizedResults>({
    worthExpanding: [],
    notWorthExpanding: [],
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("latestResearchResults");
      if (!raw) return;

      const parsed = JSON.parse(raw);

      if (
        typeof parsed === "object" &&
        Array.isArray(parsed.worthExpanding) &&
        Array.isArray(parsed.notWorthExpanding)
      ) {
        setResults({
          worthExpanding: parsed.worthExpanding,
          notWorthExpanding: parsed.notWorthExpanding,
        });
      } else {
        console.warn("Formato inesperado en localStorage:", parsed);
      }
    } catch (e) {
      console.error("Error parsing localStorage data:", e);
    }
  }, []);

  return (
    <main className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/">← Volver al inicio</Link>
        </Button>
      </div>

      <div className="space-y-6">
        <CategorizedList
          worthExpanding={results.worthExpanding}
          notWorthExpanding={results.notWorthExpanding}
        />
      </div>
    </main>
  );
}
