"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useChat } from "@ai-sdk/react";
import { generateTitles } from "../lib/actions/generate-titles";
import { ResearchResult } from "../services/exa-service";
import { ReloadIcon } from "@radix-ui/react-icons";

interface ContentEditorProps {
  initialData: ResearchResult;
}

export function ContentEditor({ initialData }: ContentEditorProps) {
  const [content, setContent] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [titlesCount, setTitlesCount] = useState(3);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [reinterpretationStyle, setReinterpretationStyle] = useState("journalistic");
  const [shouldGenerate, setShouldGenerate] = useState(false);
  const [shouldReinterpret, setShouldReinterpret] = useState(false);

  const fullContent = selectedTitle ? `${selectedTitle}\n\n${content}` : content;

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading
  } = useChat({
    api: "/api/generate",
    onResponse: () => console.log("🟡 [useChat] Streaming iniciado..."),
    onFinish: (message) => {
      console.log("✅ [useChat] Finalizado");
      setContent(message.content);
    },
    onError: (err) => console.error("❌ [useChat] Error:", err),
  });

  const {
    messages: reinterpMessages,
    input: reinterpInput,
    setInput: setReinterpInput,
    handleSubmit: handleReinterpretSubmit,
    isLoading: isReinterpreting
  } = useChat({
    api: "/api/reinterpret",
    onResponse: () => console.log("🟡 Reinterpretación en curso..."),
    onFinish: (message) => {
      console.log("✅ Reinterpretación completada");
      setContent(message.content);
    },
    onError: (err) => console.error("❌ Error reinterpretando:", err),
  });

  // Generar artículo al hacer clic
  useEffect(() => {
    if (shouldGenerate && input) {
      handleSubmit(undefined, {
        body: {
          sourceUrl: initialData.url,
          context: input,
        },
      });
      setShouldGenerate(false);
    }
  }, [shouldGenerate, input]);

  // Reinterpretar artículo
  useEffect(() => {
    if (shouldReinterpret && reinterpInput) {
      handleReinterpretSubmit(undefined, {
        body: {
          content: reinterpInput,
          style: reinterpretationStyle,
        },
      });
      setShouldReinterpret(false);
    }
  }, [shouldReinterpret, reinterpInput, reinterpretationStyle]);

  async function handleGenerateTitles() {
    if (!content) return;
    setIsGeneratingTitles(true);
    try {
      const generatedTitles = await generateTitles(content, titlesCount);
      setTitles(generatedTitles);
      setSelectedTitle(generatedTitles[0] || "");
    } catch (error) {
      console.error("Error generating titles:", error);
    } finally {
      setIsGeneratingTitles(false);
    }
  }

  if (!initialData?.title || !initialData?.url) {
    return <div className="text-red-500">Error: Datos de investigación incompletos.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expandir contenido: {initialData.title}</CardTitle>
        </CardHeader>
        <CardContent>
                      <div>
              <h3 className="text-lg font-medium mb-2">Fuente original</h3>
              <div className="bg-muted p-4 rounded-md text-sm">
                <p className="mb-2">
                  <strong>Título:</strong> {initialData.title}
                </p>
                <p className="mb-2">
                  <strong>Fuente:</strong> {initialData.url}
                </p>
                <p>
                  <strong>Contenido:</strong> {initialData.text}
                </p>
              </div>
            </div>
          
          <Tabs defaultValue="generate">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Generar</TabsTrigger>
              <TabsTrigger value="titles">Títulos</TabsTrigger>
              <TabsTrigger value="reinterpret">Reinterpretar</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              {isLoading ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : messages.length > 0 ? (
                <div className="prose dark:prose-invert mt-4">
                  {messages[messages.length - 1].content.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <Button onClick={() => {
                    setInput(`${initialData.title}. ${initialData.text}`);
                    setShouldGenerate(true);
                  }}>
                    Generar artículo inicial
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="titles" className="space-y-4">
              <div className="flex items-center gap-4">
                <Select value={titlesCount.toString()} onValueChange={(v) => setTitlesCount(Number(v))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Cantidad de títulos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 títulos</SelectItem>
                    <SelectItem value="5">5 títulos</SelectItem>
                    <SelectItem value="10">10 títulos</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleGenerateTitles} disabled={!content || isGeneratingTitles}>
                  {isGeneratingTitles ? "Generando..." : "Generar títulos"}
                </Button>
              </div>

              {titles.length > 0 && (
                <RadioGroup value={selectedTitle} onValueChange={setSelectedTitle}>
                  {titles.map((title, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <RadioGroupItem value={title} id={`title-${i}`} />
                      <Label htmlFor={`title-${i}`} className="text-base">{title}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </TabsContent>

            <TabsContent value="reinterpret" className="space-y-4">
              <Select value={reinterpretationStyle} onValueChange={setReinterpretationStyle}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estilo de reinterpretación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="journalistic">Periodístico</SelectItem>
                  <SelectItem value="academic">Académico</SelectItem>
                  <SelectItem value="conversational">Conversacional</SelectItem>
                  <SelectItem value="technical">Técnico</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setReinterpInput(fullContent);
                  setShouldReinterpret(true);
                }}
                disabled={!content || isReinterpreting}
                className="w-full"
              >
                {isReinterpreting ? "Reinterpretando..." : "Reinterpretar contenido"}
              </Button>

              {reinterpMessages.length > 0 && (
                <div className="prose dark:prose-invert mt-4">
                  {reinterpMessages[reinterpMessages.length - 1].content.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
