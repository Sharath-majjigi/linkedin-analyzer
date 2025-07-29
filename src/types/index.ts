// Database types
export interface Client {
  id: string;
  created_at: string;
  company_name: string;
  founder_name: string;
  linkedin_url: string;
  last_refreshed: string | null;
  cached_post_data: LinkedInPost[] | null;
}

// LinkedIn API types
export interface LinkedInPost {
  urn: string;
  posted_at: {
    date: string;
    timestamp: number;
  };
  text: string;
  url: string;
  stats: {
    total_reactions: number;
    like: number;
    comments: number;
    reposts: number;
  };
  media: {
    type: string;
    url: string;
  } | null;
  article: any | null;
  reshared_post: any | null;
}

// Post type categorization
export enum PostType {
  REPOST_WITH_TEXT = 'Repost w/Text',
  IMAGE = 'Image',
  VIDEO = 'Video',
  LINK_TEXT = 'Link / Text',
  TEXT = 'Text',
  ARTICLE = 'Article',
  UNKNOWN = 'Unknown'
}

// Analytics types
export interface Analytics {
  totalPostsLast30Days: number;
  averageLikesPerPost: number;
  totalCommentsThisMonth: number;
}

// Apify API response types
export interface ApifyRunResponse {
  data: {
    id: string;
    status: string;
  };
}

export interface ApifyRunStatusResponse {
  data: {
    status: 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'ABORTED';
  };
}

// Form types
export interface AddClientForm {
  company_name: string;
  founder_name: string;
  linkedin_url: string;
} 