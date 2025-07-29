import { ExternalLink } from 'lucide-react';
import { getPostType, formatDate } from '../lib/utils';
import type { LinkedInPost } from '../types';
import './PostsTable.css';

interface PostsTableProps {
  posts: LinkedInPost[];
}

export default function PostsTable({ posts }: PostsTableProps) {
  return (
    <div className="posts-table-container">
      <table className="posts-table">
        <thead>
          <tr>
            <th>Date Posted</th>
            <th>Post Text</th>
            <th>Post Type</th>
            <th>Likes</th>
            <th>Comments</th>
            <th>Shares</th>
            <th>Total Reactions</th>
            <th>Post Link</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.urn}>
              <td className="date-cell">
                {formatDate(post.posted_at.date)}
              </td>
              <td className="text-cell">
                <div className="post-text">
                  {post.text.length > 100 
                    ? `${post.text.substring(0, 100)}...` 
                    : post.text
                  }
                </div>
              </td>
              <td className="type-cell">
                <span className={`post-type post-type-${getPostType(post).toLowerCase().replace(/\s+/g, '-')}`}>
                  {getPostType(post)}
                </span>
              </td>
              <td className="number-cell">
                {post.stats.like.toLocaleString()}
              </td>
              <td className="number-cell">
                {post.stats.comments.toLocaleString()}
              </td>
              <td className="number-cell">
                {post.stats.reposts.toLocaleString()}
              </td>
              <td className="number-cell">
                {post.stats.total_reactions.toLocaleString()}
              </td>
              <td className="link-cell">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post-link"
                  title="View post on LinkedIn"
                >
                  <ExternalLink size={16} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 