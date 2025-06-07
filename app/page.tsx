import { ResearchForm } from "./components/research-form";


export default function HomePage() {
  return (
    <main className="container max-w-4xl mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Investigación asistida por IA</h1>
          <p className="text-muted-foreground">
            Inicia una investigación sobre cualquier tema y obtén resultados categorizados
          </p>
        </div>
        
        <ResearchForm />
      </div>
    </main>
  )
}