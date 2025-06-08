import { categorizeResults } from '@/app/services/categorization';
import { searchWithExa } from '@/app/services/exa-service';
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topic, criteria } = body
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }
    
    const results = await searchWithExa(topic)
    const categorized = categorizeResults(results, criteria)
    
    return NextResponse.json({ success: true, results: categorized })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to perform research' },
      { status: 500 }
    )
  }
}