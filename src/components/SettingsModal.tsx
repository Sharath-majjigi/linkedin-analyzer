import { useState } from 'react';
import { X } from 'lucide-react';
import { storage } from '../lib/utils';
import './Modal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(storage.getApiKey() || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (apiKey.trim()) {
        storage.setApiKey(apiKey.trim());
      } else {
        storage.removeApiKey();
      }
      onClose();
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = () => {
    storage.removeApiKey();
    setApiKey('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="api_key">Apify API Key</label>
            <input
              type="password"
              id="api_key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Enter your Apify API key"
            />
            <p className="form-help">
              Your API key is stored locally and never shared. Get your key from{' '}
              <a
                href="https://console.apify.com/account/integrations"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Apify Console
              </a>
            </p>
          </div>

          <div className="modal-actions">
            {apiKey && (
              <button
                type="button"
                onClick={handleRemove}
                className="btn-danger"
                disabled={isSaving}
              >
                Remove Key
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 