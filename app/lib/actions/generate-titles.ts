// app/lib/actions/generate-titles.ts

'use server';

import { generateObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';

const TitlesResponseSchema = z.object({
  titles: z.array(z.string()),
});

export async function generateTitles(content: string, count: number = 5): Promise<string[]> {
  try {
    const { object: validated } = await generateObject({
      model: openai('gpt-4o'),
      schema: TitlesResponseSchema,
      temperature: 0.7,
      prompt: `You are an expert headline writer. Generate ${count} compelling, unique titles for this article:\n\n${content.substring(0, 1000)}\n\nReturn only a valid JSON like: { "titles": ["...", "..."] }`,
    });

    return validated.titles;
  } catch (error) {
    console.error('❌ Error generating titles:', error);
    return [
      "Default Title 1: Exploring the Topic",
      "Default Title 2: A Comprehensive Overview",
      "Default Title 3: Understanding the Subject Matter"
    ];
  }
}
