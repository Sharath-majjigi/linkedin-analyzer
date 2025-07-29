import type { LinkedInPost } from '../types';
import { storage } from './utils';

// Call Apify API directly
const APIFY_BASE_URL = 'https://api.apify.com/v2/acts/apimaestro~linkedin-profile-posts/run-sync-get-dataset-items';

export class ApifyAPI {
  private apiKey: string;

  constructor() {
    // Try to get API key from environment variable first (for development)
    const envKey = import.meta.env.VITE_APIFY_API_KEY;
    if (envKey) {
      this.apiKey = envKey;
      return;
    }
    
    // Fall back to storage (for production)
    const key = storage.getApiKey();
    if (!key) {
      throw new Error('Apify API key not found. Please set it in settings or environment variables.');
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
    console.log('Making request to Apify API directly...');
    
    // Extract username from LinkedIn URL
    const usernameMatch = linkedinUrl.match(/linkedin\.com\/in\/([^\/\?]+)/);
    const username = usernameMatch ? usernameMatch[1] : linkedinUrl;
    
    console.log('Extracted username:', username);
    
    const response = await fetch(`${APIFY_BASE_URL}?token=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        max_posts: 100
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const posts = await response.json();
    console.log(`Successfully fetched ${posts.length} posts`);
    
    // Filter posts since 2025-01-01
    const cutoffDate = new Date('2025-01-01');
    const filteredPosts = posts.filter((post: any) => {
      // Check if post has the required date structure
      if (!post.posted_at || !post.posted_at.date) {
        console.log('Skipping post without valid date:', post.urn || 'unknown');
        return false;
      }
      
      try {
        const postDate = new Date(post.posted_at.date);
        return postDate >= cutoffDate;
      } catch (error) {
        console.log('Error parsing post date:', post.posted_at.date, 'for post:', post.urn || 'unknown');
        return false;
      }
    });

    console.log(`Filtered to ${filteredPosts.length} posts since 2025-01-01`);
    return filteredPosts;
  }



  // Check if API key is valid
  async validateApiKey(): Promise<boolean> {
    try {
      // Test the API key by trying to start a run with a dummy URL
      const response = await fetch(`${APIFY_BASE_URL}?token=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'test',
          max_posts: 1
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