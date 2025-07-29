import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Apify proxy endpoint - using sync endpoint for immediate results
app.post('/api/apify/run', async (req, res) => {
  try {
    const { linkedinUrl, apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    console.log('Starting Apify actor run for:', linkedinUrl);
    console.log('Using API key:', apiKey ? 'Present' : 'Missing');
    console.log('Making request to sync endpoint for immediate results');

    // Extract username from LinkedIn URL
    const usernameMatch = linkedinUrl.match(/linkedin\.com\/in\/([^\/\?]+)/);
    const username = usernameMatch ? usernameMatch[1] : linkedinUrl;
    
    console.log('Extracted username:', username);
    
    // Use the sync endpoint for immediate results
    const response = await fetch(`https://api.apify.com/v2/acts/apimaestro~linkedin-profile-posts/run-sync-get-dataset-items?token=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        max_posts: 100
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Apify API error:', errorText);
      return res.status(response.status).json({ 
        error: `Failed to fetch posts: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const posts = await response.json();
    console.log(`Successfully fetched ${posts.length} posts`);
    
    // Filter posts since 2025-01-01
    const cutoffDate = new Date('2025-01-01');
    const filteredPosts = posts.filter((post) => {
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
    res.json({ posts: filteredPosts });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get run status
app.get('/api/apify/status/:runId', async (req, res) => {
  try {
    const { runId } = req.params;
    const { apiKey } = req.query;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const response = await fetch(`https://api.apify.com/v2/acts/runs/${runId}?token=${apiKey}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to get run status: ${response.status}` 
      });
    }

    const data = await response.json();
    res.json({ status: data.data.status });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get run results
app.get('/api/apify/results/:runId', async (req, res) => {
  try {
    const { runId } = req.params;
    const { apiKey } = req.query;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const response = await fetch(`https://api.apify.com/v2/acts/runs/${runId}/dataset/items?token=${apiKey}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch run results: ${response.status}` 
      });
    }

    const data = await response.json();
    
    // Filter posts since 2025-01-01
    const cutoffDate = new Date('2025-01-01');
    const filteredPosts = data.filter((post) => {
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

    res.json({ posts: filteredPosts });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Only start server in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📡 API endpoints available:`);
    console.log(`   POST http://localhost:${PORT}/api/apify/run`);
    console.log(`   GET  http://localhost:${PORT}/api/apify/status/:runId`);
    console.log(`   GET  http://localhost:${PORT}/api/apify/results/:runId`);
  });
}

// Export for Vercel
module.exports = app; 