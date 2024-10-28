'use client'

import { useState } from 'react'

interface SearchResult {
  document: {
    id: string;
    content: any;
  };
  snippet?: {
    snippet: string;
  };
}

interface GeneratedAnswer {
  text: string;
  citations: Array<{
    content: string;
    uri: string;
  }>;
}

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [answer, setAnswer] = useState<GeneratedAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.searchResults.results);

      const references = data.generatedAnswer.answer.references.map((ref: any) => ({
          content: ref.chunkInfo.content,
          uri: ref.chunkInfo.documentMetadata.uri
      }));

      setAnswer(
        {
          text: data.generatedAnswer.answer.answerText, 
          citations: references
        }
      );
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ask anything..."
            className="text-gray-600 flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {answer && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Generated Answer:</h3>
          <div className="bg-gray-50 rounded-lg p-4 text-gray-600">
            <div dangerouslySetInnerHTML={{ __html: answer.text.replace(/\n/g, '<br/>') }} />
            {answer.citations.length > 0 && (
              <div className="mt-4 text-sm text-black-600">
                <h4 className="font-semibold">Sources:</h4>
                <ul className="list-disc pl-4">
                  {answer.citations.map((citation, index) => (
                    <li key={index}>
                      <a href={citation.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        {citation.content}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.document.id} className="border rounded-lg p-4">
                {result.snippet && <p>{result.snippet.snippet}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}