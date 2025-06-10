/** @format */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ResearchResult } from "@/app/services/exa-service";
import { ContentEditor } from "@/app/components/content-editor";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const [resultData, setResultData] = useState<ResearchResult | null>(null);

  useEffect(() => {
    // In a real application, we would retrieve this from an API endpoint
    // For this demo, we get it from localStorage

    try {
      const savedResult = localStorage.getItem("detailResearchResults");
      if (savedResult) {
        const parsedResult = JSON.parse(savedResult) as ResearchResult;
        if (parsedResult.id === params.id) {
          setResultData(parsedResult);
          return;
        }
      }

      router.push("/research");
    } catch (error) {
      console.error("Error retrieving result data:", error);
      router.push("/research");
    }
  }, [params.id, router]);

  if (!resultData) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/research">← Volver a resultados</Link>
        </Button>
      </div>

      <ContentEditor initialData={resultData} />
    </main>
  );
}
