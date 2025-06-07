'use server'

import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TitlesResponseSchema = z.object({
  titles: z.array(z.string()),
});

export async function generateTitles(content: string, count: number = 5) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert headline writer. Generate ${count} compelling, unique titles for an article. Return ONLY a valid JSON array of strings with the format: {"titles": ["Title 1", "Title 2", ...]}`,
        },
        {
          role: "user",
          content: `Create ${count} engaging titles for this article content: ${content.substring(0, 1000)}...`,
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseText = response.choices[0]?.message?.content || '{"titles": []}';
    const parsedResponse = JSON.parse(responseText);
    
    // Validar la respuesta con Zod
    const validatedResponse = TitlesResponseSchema.parse(parsedResponse);
    
    return validatedResponse.titles;
  } catch (error) {
    console.error('Title generation error:', error);
    return [
      "Default Title 1: Exploring the Topic",
      "Default Title 2: A Comprehensive Overview",
      "Default Title 3: Understanding the Subject Matter"
    ];
  }
}