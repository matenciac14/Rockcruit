// app/api/reinterpret/route.ts

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { content, style } = await req.json();

    if (!content || !style) {
      return new Response(
        JSON.stringify({ error: 'Missing content or style' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const stylePrompt = getStylePrompt(style);

    const result = await streamText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: `You are a professional editor. ${stylePrompt}`,
        },
        { role: 'user', content },
      ],
      temperature: 0.7,
    });

    return result.toDataStreamResponse({
      headers: { 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Reinterpretation API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to reinterpret content' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function getStylePrompt(style: string): string {
  switch (style) {
    case 'journalistic':
      return 'Rewrite the content in a professional journalistic style.';
    case 'academic':
      return 'Rewrite the content in an academic tone using formal language.';
    case 'conversational':
      return 'Rewrite the content in a friendly and conversational tone.';
    case 'technical':
      return 'Rewrite the content in a precise technical format for a specialized audience.';
    default:
      return 'Rewrite and improve the content while maintaining its core ideas.';
  }
}
