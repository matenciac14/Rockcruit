'use server'

import { streamArticleGeneration, streamArticleReinterpretation } from '@/services/openai-service';
import { revalidatePath } from 'next/cache';

export async function generateArticleFromResearch(context: string, sourceUrl?: string) {
  try {
    return await streamArticleGeneration(context, sourceUrl);
  } catch (error) {
    console.error('Article generation error:', error);
    throw new Error('Failed to generate article');
  }
}

export async function reinterpretArticle(content: string, style: string) {
  try {
    return await streamArticleReinterpretation(content, style);
  } catch (error) {
    console.error('Article reinterpretation error:', error);
    throw new Error('Failed to reinterpret article');
  }
}