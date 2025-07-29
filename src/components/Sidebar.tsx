import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import { useClients } from '../hooks/useClients';
import AddClientModal from './AddClientModal';
import SettingsModal from './SettingsModal';
import './Sidebar.css';

export default function Sidebar() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: clients, isLoading, error } = useClients();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">LinkedIn Analyzer</h1>
        <button
          className="settings-button"
          onClick={() => setIsSettingsOpen(true)}
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="sidebar-content">
        <button
          className="add-client-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          Add New Client
        </button>

        <nav className="client-nav">
          {isLoading && <div className="loading">Loading clients...</div>}
          
          {error && (
            <div className="error">
              Error loading clients. Please try again.
            </div>
          )}

          {clients && clients.length === 0 && (
            <div className="empty-state">
              <p>No clients yet.</p>
              <p>Add your first client to get started!</p>
            </div>
          )}

          {clients && clients.length > 0 && (
            <ul className="client-list">
              {clients.map((client) => (
                <li key={client.id}>
                  <NavLink
                    to={`/client/${client.id}`}
                    className={({ isActive }) =>
                      `client-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <div className="client-info">
                      <div className="client-name">{client.founder_name}</div>
                      <div className="client-company">{client.company_name}</div>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </aside>
  );
} 