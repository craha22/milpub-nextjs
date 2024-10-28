import { getGoogleAuthToken } from "./googleAuth";

export interface SearchConfig {
    projectId: string;
    location: string;
    collectionId: string;
    engineId: string;
  }
  
  export interface SearchResponse {
    results: Array<{
      document: {
        id: string;
        content: any;  // Type this based on your content structure
      };
      snippet?: {
        snippet: string;
      };
    }>;
    queryId: string;
    session: string;
  }
  
  export interface GeneratedAnswer {
    answer: {
      text: string;
      citations: Array<{
        content: string;
        uri: string;
      }>;
    };
    relatedQuestions?: Array<{
      question: string;
    }>;
  }
  
  export class GoogleSearchClient {
    private baseUrl: string;
    private config: SearchConfig;
  
    constructor(config: SearchConfig) {
      this.config = config;
      this.baseUrl = `https://discoveryengine.googleapis.com/v1alpha/projects/${config.projectId}/locations/${config.location}/collections/${config.collectionId}/engines/${config.engineId}`;
    }
  
    private async getAccessToken(): Promise<string> {
        if (typeof window === 'undefined') {
          // Server-side: use direct auth
          return getGoogleAuthToken();
        } else {
          // Client-side: use API endpoint
          const response = await fetch('/api/auth/google-token');
          if (!response.ok) {
            throw new Error('Failed to get authentication token');
          }
          const data = await response.json();
          return data.token;
        }
      }

    async search(query: string): Promise<SearchResponse> {
      const token = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/servingConfigs/default_search:search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          pageSize: 10,
          queryExpansionSpec: { condition: 'AUTO' },
          spellCorrectionSpec: { mode: 'AUTO' },
          contentSearchSpec: {
            snippetSpec: { returnSnippet: true }
          },
          session: `projects/${this.config.projectId}/locations/${this.config.location}/collections/${this.config.collectionId}/engines/${this.config.engineId}/sessions/-`
        })
      });
  
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
  
      return response.json();
    }
  
    async getGeneratedAnswer(query: string, queryId: string, sessionId: string): Promise<GeneratedAnswer> {
      const token = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/servingConfigs/default_search:answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            text: query,
            queryId: queryId
          },
          session: sessionId,
          relatedQuestionsSpec: { enable: true },
          answerGenerationSpec: {
            ignoreAdversarialQuery: true,
            ignoreNonAnswerSeekingQuery: true,
            ignoreLowRelevantContent: true,
            includeCitations: true,
            // promptSpec: {
            //   preamble: "Given the conversation between a user and a helpful assistant and some search results, create a final answer for the assistant. The answer should use all relevant information from the search results, not introduce any additional information, and use exactly the same words as the search results when possible. The assistant's answer should be no more than 10 sentences. The assistant's answer should be formatted as a bulleted list. Each list item should start with the \"-\" symbol."
            // },
            // answerLanguageCode: "en",
            modelSpec: {
              modelVersion: "gemini-1.5-flash-001/answer_gen/v2"
            }
          }
        })
      });
  
      if (!response.ok) {
        throw new Error(`Answer generation failed: ${response.statusText}`);
      }
  
      return response.json();
    }
  }