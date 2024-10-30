'use client'

import { useState } from 'react'

interface GeneratedAnswer {
  text: string;
  citations: Array<{
    content: string;
    pub_url: string;
  }>;
}

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
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

      setAnswer(
        {
          text: data.generatedAnswer,
          citations: data.references
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
            className="text-gray-600 flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
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
          <h3 className="text-lg font-semibold mb-2 text-white">Generated Answer:</h3>
          <div className="bg-gray-50 rounded-lg p-4 text-gray-600">
            <div dangerouslySetInnerHTML={{ __html: answer.text.replace(/\n/g, '<br/>') }} />
            {answer.citations.length > 0 && (
              <div className="mt-4 text-sm text-black-600">
                <h4 className="font-semibold">Sources:</h4>
                <ul className="list-disc pl-4">

                  {answer.citations.map((citation, index) => (
                    <li key={index}>
                      <a href={citation.pub_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
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
    </div>
  )
}