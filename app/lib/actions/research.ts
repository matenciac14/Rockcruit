'use server'


import { categorizeResults } from '@/app/services/categorization';
import { searchWithExa } from '@/app/services/exa-service';
import { revalidatePath } from 'next/cache';

export async function performResearch(formData: FormData) {
  const topic = formData.get('topic') as string;
  
  if (!topic) {
    throw new Error('Research topic is required');
  }
  
  try {
    // Buscar con Exa API
    const results = await searchWithExa(topic);
    
    // Categorizar resultados
    const categorized = categorizeResults(results);
    
    // Almacenar en la sesión o en un estado persistente
    // Aquí usaríamos un enfoque adecuado para persistir los resultados
    // (podría ser Redis, DB o incluso localStorage dependiendo del caso)
    
    // Revalidar la página para mostrar resultados frescos
    revalidatePath('/research');
    
    return { success: true, results: categorized };
  } catch (error) {
    console.error('Research error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to perform research' 
    };
  }
}