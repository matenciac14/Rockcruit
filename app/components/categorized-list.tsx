"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ResearchResult } from "../services/exa-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategorizedListProps {
  worthExpanding: ResearchResult[]
  notWorthExpanding: ResearchResult[]
}

export function CategorizedList({ worthExpanding, notWorthExpanding }: CategorizedListProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("worthExpanding")

  function navigateToEditor(result: ResearchResult) {
    // Codificar resultado como parámetros de URL o usar estado global/localStorage
    localStorage.setItem('selectedResult', JSON.stringify(result));
    router.push(`/editor/${result.id}`);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Resultados de la investigación</h2>
      
      <Tabs defaultValue="worthExpanding" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="worthExpanding">
            Vale la pena expandir <Badge variant="outline" className="ml-2">{worthExpanding.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="notWorthExpanding">
            No vale la pena expandir <Badge variant="outline" className="ml-2">{notWorthExpanding.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="worthExpanding" className="mt-4 space-y-4">
          {worthExpanding.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No se encontraron resultados en esta categoría
            </p>
          ) : (
            worthExpanding.map((result) => (
              <Card key={result.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{result.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground mb-2">{result.content}</p>
                  <div className="flex gap-2 flex-wrap text-xs">
                    <Badge variant="outline">{result.source}</Badge>
                    {result.published_date && (
                      <Badge variant="outline">
                        {new Date(result.published_date).toLocaleDateString()}
                      </Badge>
                    )}
                    {result.relevance_score !== undefined && (
                      <Badge variant="outline">
                        Relevancia: {Math.round(result.relevance_score * 100)}%
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => navigateToEditor(result)}>
                      Expandir contenido
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        Ver fuente
                      </a>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="notWorthExpanding" className="mt-4 space-y-4">
          {notWorthExpanding.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No se encontraron resultados en esta categoría
            </p>
          ) : (
            notWorthExpanding.map((result) => (
              <Card key={result.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{result.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground mb-2">{result.content}</p>
                  <div className="flex gap-2 flex-wrap text-xs">
                    <Badge variant="outline">{result.source}</Badge>
                    {result.published_date && (
                      <Badge variant="outline">
                        {new Date(result.published_date).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" asChild>
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                      Ver fuente
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}