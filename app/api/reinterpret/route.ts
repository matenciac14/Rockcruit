import { OpenAIStream } from '@vercel/ai'
import { StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { content, style } = await req.json()
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const stylePrompt = getStylePrompt(style)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      stream: true,
      messages: [
        { 
          role: "system", 
          content: `You are a professional editor. ${stylePrompt}` 
        },
        { role: "user", content }
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
      JSON.stringify({ error: 'Failed to reinterpret content' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

function getStylePrompt(style: string): string {
  switch (style) {
    case 'journalistic':
      return 'Rewrite the content in a professional journalistic style, suitable for a news publication.';
    case 'academic':
      return 'Rewrite the content in a formal academic style with appropriate terminology and structure.';
    case 'conversational':
      return 'Rewrite the content in a friendly, conversational style that engages the reader directly.';
    case 'technical':
      return 'Rewrite the content in a technical style with precise terminology and clear explanations.';
    default:
      return 'Rewrite and improve the following content while maintaining its core information.';
  }
}