import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import type { LinkedInPost, Analytics } from '../types';
import { PostType } from '../types';

// Post type mapping function
export function getPostType(post: LinkedInPost): PostType {
  // Check for reshared post with text
  if (post.reshared_post && post.text && post.text.trim().length > 0) {
    return PostType.REPOST_WITH_TEXT;
  }

  // Check for media type
  if (post.media) {
    if (post.media.type === 'image') {
      return PostType.IMAGE;
    }
    if (post.media.type === 'video') {
      return PostType.VIDEO;
    }
  }

  // Check for article
  if (post.article) {
    return PostType.ARTICLE;
  }

  // Check for link in text (simple heuristic)
  if (post.text && (post.text.includes('http://') || post.text.includes('https://'))) {
    return PostType.LINK_TEXT;
  }

  // Default to text
  if (post.text && post.text.trim().length > 0) {
    return PostType.TEXT;
  }

  return PostType.UNKNOWN;
}

// Analytics calculation functions
export function calculateAnalytics(posts: LinkedInPost[]): Analytics {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);

  // Filter posts for last 30 days
  const postsLast30Days = posts.filter(post => {
    const postDate = parseISO(post.posted_at.date);
    return postDate >= thirtyDaysAgo;
  });

  // Filter posts for current month
  const postsThisMonth = posts.filter(post => {
    const postDate = parseISO(post.posted_at.date);
    return postDate >= startOfCurrentMonth && postDate <= endOfCurrentMonth;
  });

  // Calculate metrics
  const totalPostsLast30Days = postsLast30Days.length;
  
  const totalLikes = posts.reduce((sum, post) => sum + post.stats.like, 0);
  const averageLikesPerPost = posts.length > 0 ? Math.round(totalLikes / posts.length) : 0;
  
  const totalCommentsThisMonth = postsThisMonth.reduce((sum, post) => sum + post.stats.comments, 0);

  return {
    totalPostsLast30Days,
    averageLikesPerPost,
    totalCommentsThisMonth
  };
}

// Date formatting utilities
export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM dd, yyyy');
}

export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), 'MMM dd, yyyy, h:mm a');
}

export function formatRelativeTime(dateString: string): string {
  const date = parseISO(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return formatDate(dateString);
}

// Local storage utilities for API key
export const storage = {
  getApiKey: (): string | null => {
    return localStorage.getItem('apify_api_key');
  },
  
  setApiKey: (key: string): void => {
    localStorage.setItem('apify_api_key', key);
  },
  
  removeApiKey: (): void => {
    localStorage.removeItem('apify_api_key');
  }
}; 