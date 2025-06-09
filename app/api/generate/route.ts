// app/api/generate/route.ts

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { sourceUrl, context } = await req.json();

  const prompt = sourceUrl
    ? `Based on the content from ${sourceUrl}, write a comprehensive article about: ${context}`
    : `Create an informative article about: ${context}`;

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: [
      { role: 'system', content: 'You are a professional journalist and content creator.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  });

  return result.toDataStreamResponse({
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
