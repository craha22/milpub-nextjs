import { NextResponse } from 'next/server';
import { GoogleSearchClient, SearchResponse } from '@/lib/googleSearch';
import { getPubUrl } from '@/lib/pubs';

const searchClient = new GoogleSearchClient({
    projectId: process.env.GOOGLE_PROJECT_ID!,
    location: process.env.GOOGLE_LOCATION || 'global',
    collectionId: process.env.GOOGLE_COLLECTION_ID || 'default_collection',
    engineId: process.env.GOOGLE_ENGINE_ID!
});

export interface Result {
    document: {
        id: string;
    };
    snippet?: string;
}

export interface searchResults {
    results: Array<{
        document: {
            id: string;
            derivedStructData: {
                snippets: Array<{
                    snippet: string;
                }>;
            };
        };
    }>;
}

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const searchResults: SearchResponse = await searchClient.search(query);

        const searchResultsOut: Result[] = searchResults.results.map((result) => ({
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
            generatedAnswer.answer.references.map(async (ref) => {
                if (!ref.chunkInfo.documentMetadata.uri) {
                    return {
                        content: ref.chunkInfo.content,
                        id: '',
                        pub_url: ''
                    }
                }
                const url_parts: string = ref.chunkInfo.documentMetadata.uri.split('/').pop() || '';
                if (!url_parts) {
                    return {
                        content: ref.chunkInfo.content,
                        id: '',
                        pub_url: ''
                    }
                }
                const id: string = url_parts.split('.').shift() || '';
                if (!id) {
                    return {
                        content: ref.chunkInfo.content,
                        id: '',
                        pub_url: ''
                    }
                }
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