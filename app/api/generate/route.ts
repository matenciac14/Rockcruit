import { OpenAIStream } from '@vercel/ai'
import { StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { sourceUrl, context } = await req.json()
    
    const prompt = sourceUrl
      ? `Based on the content from ${sourceUrl}, write a comprehensive article about: ${context}`
      : `Create an informative article about: ${context}`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      stream: true,
      messages: [
        { role: "system", content: "You are a professional journalist and content creator." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    })
    
    // Convert the response to a friendly stream
    const stream = OpenAIStream(response)
    
    // Return a StreamingTextResponse, which will stream the response
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate article' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}