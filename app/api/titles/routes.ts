import { NextResponse } from 'next/server'
import { generateTitles } from '@/lib/actions/generate-titles'

export async function POST(req: Request) {
  try {
    const { content, count = 5 } = await req.json()
    
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }
    
    const titles = await generateTitles(content, count)
    
    return NextResponse.json({ success: true, titles })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to generate titles' }, { status: 500 })
  }
}