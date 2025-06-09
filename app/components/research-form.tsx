/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import { performResearch } from "../lib/actions/research";

const predefinedTopics = [
  "Avances en Inteligencia Artificial",
  "Cambio Climático",
  "Tecnología 5G",
  "Medicina Regenerativa",
  "Criptomonedas y Blockchain",
];

export function ResearchForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await performResearch(formData);
      if (result.success) {
      if (typeof window !== "undefined") {
        localStorage.setItem("latestResearchResults", JSON.stringify(result.results));
      }
        router.push("/research");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Iniciar investigación</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit(formData);
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Input
              name="topic"
              placeholder="Tema de investigación..."
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {predefinedTopics.map((topic) => (
              <Button
                key={topic}
                type="button"
                variant="outline"
                className="text-sm h-auto py-1 px-2 justify-start"
                onClick={() => setSelectedTopic(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !selectedTopic}
          >
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Investigando...
              </>
            ) : (
              "Iniciar Investigación"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        La investigación puede tardar unos segundos mientras consultamos fuentes
        relevantes.
      </CardFooter>
    </Card>
  );
}
