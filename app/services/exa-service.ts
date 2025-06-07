import axios from 'axios';
import { z } from 'zod';

const exaApiKey = process.env.EXA_API_KEY;
const exaApiUrl = 'https://api.exa.ai/research';

// Definimos un esquema para los resultados de la investigación
const ResearchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  content: z.string(),
  source: z.string(),
  published_date: z.string().optional(),
  relevance_score: z.number().optional(),
});

export type ResearchResult = z.infer<typeof ResearchResultSchema>;

export async function searchWithExa(query: string, limit: number = 10) {
  try {
    const response = await axios.post(
      exaApiUrl,
      {
        query,
        limit,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${exaApiKey}`,
        },
      }
    );

    // Validar y procesar la respuesta
    const results = response.data.results || [];
    console.log('====>Exa search results:', results);
    return results.map((result: any) => 
      ResearchResultSchema.parse({
        id: result.id || `id-${Date.now()}-${Math.random()}`,
        title: result.title || 'Untitled',
        url: result.url || '',
        content: result.snippet || result.content || '',
        source: result.source || 'Unknown source',
        published_date: result.published_date,
        relevance_score: result.relevance_score || 0,
      })
    );
  } catch (error) {
    console.error('Error searching with Exa:', error);
    throw new Error('Failed to retrieve research results');
  }
}