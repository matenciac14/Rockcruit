"use client"

import { useState, useEffect } from "react"
import { generateArticleFromResearch } from "../lib/actions/generate-article"
import { generateTitles } from "@/lib/actions/generate-titles"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResearchResult } from "@/services/exa-service"
import { Skeleton } from "@/components/ui/skeleton"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ContentEditorProps {
  initialData: ResearchResult
}

export function ContentEditor({ initialData }: ContentEditorProps) {
  const [content, setContent] = useState<string>("")
  const [titles, setTitles] = useState<string[]>([])
  const [selectedTitle, setSelectedTitle] = useState<string>("")
  const [titlesCount, setTitlesCount] = useState<number>(3)
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false)
  const [reinterpretationStyle, setReinterpretationStyle] = useState<string>("journalistic")
  
  // Generar artículo inicial usando AI SDK
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/generate",
    body: { 
      sourceUrl: initialData.url,
      context: initialData.title + ". " + initialData.content
    },
    onFinish(message) {
      setContent(message.content)
    }
  })
  
  // Generar títulos cuando cambia el contenido
  async function handleGenerateTitles() {
    if (!content) return
    
    setIsGeneratingTitles(true)
    try {
      const generatedTitles = await generateTitles(content, titlesCount)
      setTitles(generatedTitles)
      if (generatedTitles.length > 0) {
        setSelectedTitle(generatedTitles[0])
      }
    } catch (error) {
      console.error("Error generating titles:", error)
    } finally {
      setIsGeneratingTitles(false)
    }
  }
  
  // Manejar la reinterpretación del texto
  const { messages: reinterpMessages, handleSubmit: handleReinterpretSubmit } = useChat({
    api: "/api/reinterpret",
    body: { content, style: reinterpretationStyle },
  })
  
  useEffect(() => {
    // Iniciar la generación automáticamente cuando se carga el componente
  }, [])
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expandir contenido: {initialData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Fuente original</h3>
              <div className="bg-muted p-4 rounded-md text-sm">
                <p className="mb-2"><strong>Título:</strong> {initialData.title}</p>
                <p className="mb-2"><strong>Fuente:</strong> {initialData.source}</p>
                <p><strong>Contenido:</strong> {initialData.content}</p>
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
                  <div className="space-y-4 py-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : messages.length > 0 ? (
                  <div className="prose dark:prose-invert mt-4">
                    {messages[messages.length - 1].content.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center py-8">
                    <Button onClick={() => handleSubmit()}>
                      Generar artículo inicial
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="titles" className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select 
                    value={titlesCount.toString()} 
                    onValueChange={(v) => setTitlesCount(Number(v))}
                  >
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
                
                {isGeneratingTitles ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : titles.length > 0 ? (
                  <RadioGroup value={selectedTitle} onValueChange={setSelectedTitle}>
                    {titles.map((title, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={title} id={`title-${i}`} />
                        <Label htmlFor={`title-${i}`} className="text-base">{title}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    Genera contenido primero, luego podrás crear títulos alternativos
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="reinterpret" className="space-y-4">
                <div className="space-y-4">
                  <Select 
                    value={reinterpretationStyle} 
                    onValueChange={setReinterpretationStyle}
                  >
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
                    onClick={() => handleReinterpretSubmit(content)} 
                    disabled={!content}
                    className="w-full"
                  >
                    Reinterpretar contenido
                  </Button>
                  
                  {reinterpMessages.length > 0 && (
                    <div className="prose dark:prose-invert mt-4">
                      {reinterpMessages[reinterpMessages.length - 1].content.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}