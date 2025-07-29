import { useParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useClient, useUpdateClientPosts } from '../hooks/useClients';
import { calculateAnalytics, formatDateTime } from '../lib/utils';
import { createApifyAPI } from '../lib/apify';
import PostsTable from '../components/PostsTable';
import './ClientView.css';

export default function ClientView() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading, error } = useClient(id!);
  const updatePosts = useUpdateClientPosts();

  const handleRefresh = async () => {
    if (!client) return;

    try {
      const apifyAPI = createApifyAPI();
      console.log('Starting LinkedIn data refresh...');
      const posts = await apifyAPI.fetchAllPosts(client.linkedin_url);
      console.log(`Fetched ${posts.length} posts, updating database...`);
      await updatePosts.mutateAsync({ id: client.id, postData: posts });
      console.log('Data refresh completed successfully');
    } catch (error) {
      console.error('Error refreshing posts:', error);
      // You could add a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="client-view">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading client data...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="client-view">
        <div className="error-container">
          <h2>Error Loading Client</h2>
          <p>Unable to load client data. Please try again.</p>
        </div>
      </div>
    );
  }

  const analytics = client.cached_post_data 
    ? calculateAnalytics(client.cached_post_data)
    : { totalPostsLast30Days: 0, averageLikesPerPost: 0, totalCommentsThisMonth: 0 };

  return (
    <div className="client-view">
      {/* Header */}
      <div className="client-header">
        <div className="client-info">
          <h1>{client.founder_name}</h1>
          <p className="company-name">{client.company_name}</p>
          {client.last_refreshed && (
            <p className="last-refreshed">
              Last refreshed: {formatDateTime(client.last_refreshed)}
            </p>
          )}
        </div>
        
        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={updatePosts.isPending}
        >
          <RefreshCw size={16} className={updatePosts.isPending ? 'spinning' : ''} />
          {updatePosts.isPending ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Posts (Last 30 Days)</h3>
          <div className="analytics-value">{analytics.totalPostsLast30Days}</div>
        </div>
        
        <div className="analytics-card">
          <h3>Average Likes per Post</h3>
          <div className="analytics-value">{analytics.averageLikesPerPost}</div>
        </div>
        
        <div className="analytics-card">
          <h3>Total Comments (This Month)</h3>
          <div className="analytics-value">{analytics.totalCommentsThisMonth}</div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="posts-section">
        <div className="section-header">
          <h2>LinkedIn Posts</h2>
          {client.cached_post_data && (
            <span className="post-count">
              {client.cached_post_data.length} posts
            </span>
          )}
        </div>

        {!client.cached_post_data || client.cached_post_data.length === 0 ? (
          <div className="empty-posts">
            <p>No posts data available.</p>
            <p>Click "Refresh Data" to fetch posts from LinkedIn.</p>
          </div>
        ) : (
          <PostsTable posts={client.cached_post_data} />
        )}
      </div>

      {updatePosts.isError && (
        <div className="error-message">
          Error refreshing data. Please check your API key and try again.
        </div>
      )}
    </div>
  );
} 