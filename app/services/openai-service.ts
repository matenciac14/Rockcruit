import { streamText } from 'ai';
import OpenAI from 'openai';
import { openai as openaiModel } from '@ai-sdk/openai';

const MODEL = openaiModel('gpt-4o-mini');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateArticle(context: string, sourceUrl?: string) {
  const prompt = sourceUrl
    ? `Based on the content from ${sourceUrl}, write a comprehensive article about: ${context}`
    : `Create an informative article about: ${context}`;

  return openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a professional journalist and content creator.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
  });
}

export function streamArticleGeneration(context: string, sourceUrl?: string) {
  const prompt = sourceUrl
    ? `Based on the content from ${sourceUrl}, write a comprehensive article about: ${context}`
    : `Create an informative article about: ${context}`;

  return streamText({
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are a professional journalist and content creator.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
     maxTokens: 800,
  });
}

export function streamArticleReinterpretation(content: string, style: string) {
  return streamText({
    model: MODEL,
    messages: [
      { role: 'system', content: `You are a professional editor. Reinterpret the following content in a ${style} style.` },
      { role: 'user', content }
    ],
    temperature: 0.7,
  });
}
