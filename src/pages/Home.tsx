import { Link } from 'react-router-dom';
import { useClients } from '../hooks/useClients';
import { Plus } from 'lucide-react';
import './Home.css';

export default function Home() {
  const { data: clients, isLoading } = useClients();

  return (
    <div className="home">
      <div className="home-content">
        <div className="welcome-section">
          <h1>Welcome to LinkedIn Performance Dashboard</h1>
          <p className="subtitle">
            Track and analyze LinkedIn post performance for your clients
          </p>
        </div>

        {isLoading ? (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Loading your clients...</p>
          </div>
        ) : clients && clients.length > 0 ? (
          <div className="clients-section">
            <h2>Your Clients</h2>
            <div className="clients-grid">
              {clients.slice(0, 6).map((client) => (
                <Link
                  key={client.id}
                  to={`/client/${client.id}`}
                  className="client-card"
                >
                  <div className="client-card-content">
                    <h3>{client.founder_name}</h3>
                    <p>{client.company_name}</p>
                    {client.last_refreshed && (
                      <span className="last-refreshed">
                        Last updated: {new Date(client.last_refreshed).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            
            {clients.length > 6 && (
              <div className="view-all-section">
                <p>And {clients.length - 6} more clients...</p>
                <p>Use the sidebar to view all your clients</p>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Plus size={48} />
            </div>
            <h2>No clients yet</h2>
            <p>Get started by adding your first client to track their LinkedIn performance.</p>
            <p>Click the "Add New Client" button in the sidebar to begin.</p>
          </div>
        )}

        <div className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📊 Analytics Dashboard</h3>
              <p>View comprehensive analytics including engagement rates, post performance, and trends.</p>
            </div>
            <div className="feature-card">
              <h3>🔄 Auto Refresh</h3>
              <p>Automatically fetch the latest posts from LinkedIn profiles with one click.</p>
            </div>
            <div className="feature-card">
              <h3>📈 Performance Tracking</h3>
              <p>Track likes, comments, shares, and total reactions across all posts.</p>
            </div>
            <div className="feature-card">
              <h3>📱 Post Categorization</h3>
              <p>Automatically categorize posts by type (text, image, video, article, etc.).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 