import { CategorizedList } from "@/components/categorized-list"
import { searchWithExa } from "@/services/exa-service"
import { categorizeResults } from "@/services/categorization"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getResearchResults() {
  // Aquí normalmente obtendríamos resultados de algún estado
  // persistente (base de datos, Redis, etc.).
  // Para demostración, generaremos datos simulados:
  
  // Nota: en producción, recuperaríamos de la base de datos o estado
  try {
    // Intenta recuperar de caché/estado o ejecuta una búsqueda con un tema predeterminado
    const demoTopic = "Avances en Inteligencia Artificial";
    const results = await searchWithExa(demoTopic);
    return categorizeResults(results);
  } catch (error) {
    console.error("Error getting research results:", error);
    return {
      worthExpanding: [],
      notWorthExpanding: []
    };
  }
}

export default async function ResearchPage() {
  const { worthExpanding, notWorthExpanding } = await getResearchResults();
  
  return (
    <main className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/">← Volver al inicio</Link>
        </Button>
      </div>
      
      <div className="space-y-6">
        <CategorizedList 
          worthExpanding={worthExpanding} 
          notWorthExpanding={notWorthExpanding} 
        />
      </div>
    </main>
  )
}