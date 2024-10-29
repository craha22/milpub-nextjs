import { NextResponse } from 'next/server';
import { GoogleSearchClient } from '@/lib/googleSearch';
import { getPub, getPubUrl } from '@/lib/pubs';

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
    
    const searchResultsOut = searchResults.results.map((result: any) => ({
        document: {
          id: result.document.id,
        },
        snippet: result.document && result.document.derivedStructData && result.document.derivedStructData.snippets ? result.document.derivedStructData.snippets[0].snippet : "No Snippppet Available"
      }));

    const generatedAnswer = await searchClient.getGeneratedAnswer(
      query,
      searchResults.queryId,
      searchResults.session
    );
   
    const references = await Promise.all(
     generatedAnswer.answer.references.map(async (ref: any) => {
        const id: string = ref.chunkInfo.documentMetadata.uri.split('/').pop().split('.').shift();
        const pub_url: string = await getPubUrl(id);
        return {
        content: ref.chunkInfo.content,
        id: id,
        pub_url: pub_url
      }
    }));
    


    return NextResponse.json({
      searchResults: searchResultsOut,
      generatedAnswer: generatedAnswer.answer.answerText,
      references
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}