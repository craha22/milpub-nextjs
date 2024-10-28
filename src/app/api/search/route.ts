import { NextResponse } from 'next/server';
import { GoogleSearchClient } from '@/lib/googleSearch';

const searchClient = new GoogleSearchClient({
  projectId: process.env.GOOGLE_PROJECT_ID!,
  location: process.env.GOOGLE_LOCATION || 'global',
  collectionId: process.env.GOOGLE_COLLECTION_ID || 'default_collection',
  engineId: process.env.GOOGLE_ENGINE_ID!
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const searchResults = await searchClient.search(query);
    const generatedAnswer = await searchClient.getGeneratedAnswer(
      query,
      searchResults.queryId,
      searchResults.session
    );

    return NextResponse.json({
      searchResults,
      generatedAnswer
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}