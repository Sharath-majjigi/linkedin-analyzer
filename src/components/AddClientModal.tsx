import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateClient } from '../hooks/useClients';
import type { AddClientForm } from '../types';
import './Modal.css';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddClientModal({ isOpen, onClose }: AddClientModalProps) {
  const [formData, setFormData] = useState<AddClientForm>({
    company_name: '',
    founder_name: '',
    linkedin_url: ''
  });

  const createClient = useCreateClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createClient.mutateAsync(formData);
      setFormData({ company_name: '', founder_name: '', linkedin_url: '' });
      onClose();
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Client</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="company_name">Company Name</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="founder_name">Founder Name</label>
            <input
              type="text"
              id="founder_name"
              name="founder_name"
              value={formData.founder_name}
              onChange={handleChange}
              required
              placeholder="Enter founder name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin_url">LinkedIn Profile URL</label>
            <input
              type="url"
              id="linkedin_url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              required
              placeholder="https://www.linkedin.com/in/username"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={createClient.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={createClient.isPending}
            >
              {createClient.isPending ? 'Adding...' : 'Add Client'}
            </button>
          </div>

          {createClient.isError && (
            <div className="error-message">
              Error creating client. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 