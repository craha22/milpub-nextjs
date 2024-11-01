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
        content: string;  // Type this based on your content structure
        derivedStructData: {
            snippets: Array<{
              snippet: string;
            }>;
          };
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
      answerText: string;
      citations: Array<{
        content: string;
        uri: string;
      }>;
      references: Array<{
        chunkInfo: {
          content: string;
          documentMetadata: {
            uri: string;
          };
        };
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
            promptSpec: {
              preamble: "Given the inquiry from a user and some search results, synthesize a final answer for the assistant to address the search inquiry from the user. The answer should use all relevant information from the search results, not introduce any additional information, and use exactly the same words as the search results when possible. The assistant's answer should be brief, no more than a paragraph or several sentences. Bullet points are also acceptable."
            },
            answerLanguageCode: "en",
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