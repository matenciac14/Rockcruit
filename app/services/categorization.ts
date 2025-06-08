import { ResearchResult } from './exa-service';

interface CategorizedResults {
  worthExpanding: ResearchResult[];
  notWorthExpanding: ResearchResult[];
}

// Criterios para la categorización
interface CategorizationCriteria {
  minRelevanceScore: number;
  requiresRecent: boolean;
  maxAgeInDays: number;
  contentLengthThreshold: number;
  keyPhrases: string[];
}

// Criterios predeterminados
const DEFAULT_CRITERIA: CategorizationCriteria = {
  minRelevanceScore: 0.7,
  requiresRecent: true,
  maxAgeInDays: 90,
  contentLengthThreshold: 100, 
  keyPhrases: ['research', 'study', 'discovery', 'innovation', 'breakthrough'],
};

export function categorizeResults(
  results: ResearchResult[],
  criteria: Partial<CategorizationCriteria> = {}
): CategorizedResults {
  const mergedCriteria = { ...DEFAULT_CRITERIA, ...criteria };
  
  const worthExpanding: ResearchResult[] = [];
  const notWorthExpanding: ResearchResult[] = [];
  
  results.forEach(result => {
    // Verificar criterios de categorización
    const isRelevant = result.score ? 
      result.score >= mergedCriteria.minRelevanceScore : true;
    
    let isRecent = true;
    if (mergedCriteria.requiresRecent && result.published_date) {
      const publishDate = new Date(result.published_date);
      const daysOld = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
      isRecent = daysOld <= mergedCriteria.maxAgeInDays;
    }
    
    const hasSubstantialContent = result.text.length >= mergedCriteria.contentLengthThreshold;
    
    const containsKeyPhrases = mergedCriteria.keyPhrases.some(phrase => 
      result.title.toLowerCase().includes(phrase.toLowerCase()) || 
      result.text.toLowerCase().includes(phrase.toLowerCase())
    );
    
    // Decidir categoría
    if (isRelevant && isRecent && (hasSubstantialContent || containsKeyPhrases)) {
      worthExpanding.push(result);
    } else {
      notWorthExpanding.push(result);
    }
  });
  
  return {
    worthExpanding,
    notWorthExpanding
  };
}