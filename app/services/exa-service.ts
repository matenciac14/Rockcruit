import Exa from 'exa-js';
import { z } from 'zod';

const exaApiKey = process.env.EXA_API_KEY!;
const exa = new Exa(exaApiKey);

// Esquema de validación con zod
const ResearchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  published_date: z.string().optional(),
  author: z.string().optional(),
  content: z.string().optional(),
  text: z.string(),
  score: z.number().optional(),
  Highlights: z.array(z.string()).optional(),
  highlightScores: z.array(z.number()).optional(),
  image: z.string().optional(),
  favicon: z.string().optional(),
});

export type ResearchResult = z.infer<typeof ResearchResultSchema>;

type ExaSearchResult = {
  documentId?: string | null;
  title?: string | null;
  url?: string | null;
  publishedDate?: string | null;
  author?: string | null;
  content?: string | null;
  text?: string | null;
  snippet?: string | null;
  score?: number | null;
  highlights?: string[] | null;
  highlightScores?: number[] | null;
  image?: string | null;
  favicon?: string | null;
};


export async function searchWithExa(
  query: string,
  limit: number = 10
): Promise<ResearchResult[]> {
  try {
    const data = await exa.searchAndContents(query, {
      text: true,
      highlights: true,
      numResults: limit,
    });

    const results = data.results || [];

    return results.map((result: ExaSearchResult) =>
      ResearchResultSchema.parse({
        id: result.documentId || `id-${Date.now()}-${Math.random()}`,
        title: result.title || 'Untitled',
        url: result.url || '',
        published_date: result.publishedDate,
        author: result.author || 'Unknown author',
        content: result.content || '',
        text: result.text || result.snippet || '',
        score: result.score || 0,
        Highlights: result.highlights || [],
        highlightScores: result.highlightScores || [],
        image: result.image || '',
        favicon: result.favicon || '',
      })
    );
  } catch (error) {
    console.error('Error searching with Exa:', error);
    throw new Error('Failed to retrieve research results');
  }
}
