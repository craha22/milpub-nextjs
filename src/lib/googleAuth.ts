import { GoogleAuth } from 'google-auth-library';

// Singleton pattern for auth client
let authClient: GoogleAuth | null = null;

export async function getGoogleAuthToken(): Promise<string> {
  try {
    if (!authClient) {
      authClient = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        // If using JSON key file (development)
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        // If using individual credentials (production)
        credentials: process.env.GOOGLE_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CREDENTIALS) : undefined
      });
    }

    const client = await authClient.getClient();
    const accessToken = await client.getAccessToken();

    if (!accessToken.token) {
      throw new Error('Failed to get access token');
    }

    return accessToken.token;
  } catch (error) {
    console.error('Error getting Google auth token:', error);
    throw new Error('Authentication failed');
  }
}