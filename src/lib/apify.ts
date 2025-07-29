import type { LinkedInPost } from '../types';
import { storage } from './utils';

// Use backend server to avoid CORS issues
const API_BASE_URL = 'http://localhost:3001/api/apify';

export class ApifyAPI {
  private apiKey: string;

  constructor() {
    const key = storage.getApiKey();
    if (!key) {
      throw new Error('Apify API key not found. Please set it in settings.');
    }
    this.apiKey = key;
  }

  // Fetch all posts since January 1, 2025
  async fetchAllPosts(linkedinUrl: string): Promise<LinkedInPost[]> {
    try {
      console.log('Starting Apify actor run...');
      
      // Use sync endpoint for immediate results
      const posts = await this.startActorRun(linkedinUrl);
      
      console.log(`Total posts fetched: ${posts.length}`);
      return posts;
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  // Start an actor run and get results immediately
  private async startActorRun(linkedinUrl: string): Promise<LinkedInPost[]> {
    console.log('Making request to backend server...');
    
    const response = await fetch(`${API_BASE_URL}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        linkedinUrl,
        apiKey: this.apiKey
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error response:', errorData);
      throw new Error(`Failed to start actor run: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log('Success response:', data);
    return data.posts;
  }



  // Check if API key is valid
  async validateApiKey(): Promise<boolean> {
    try {
      // Test the API key by trying to start a run with a dummy URL
      const response = await fetch(`${API_BASE_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          linkedinUrl: 'https://www.linkedin.com/in/test',
          apiKey: this.apiKey
        })
      });
      
      // If we get a 400 or 401, the API key is invalid
      // If we get a 200, the API key is valid (even if the run fails)
      return response.status === 200 || response.status === 400;
    } catch {
      return false;
    }
  }
}

// Factory function to create API instance
export function createApifyAPI(): ApifyAPI {
  return new ApifyAPI();
} 