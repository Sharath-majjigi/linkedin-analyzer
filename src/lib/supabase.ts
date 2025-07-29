import { createClient } from '@supabase/supabase-js';
import type { Client } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<{
  public: {
    Tables: {
      clients: {
        Row: Client;
        Insert: Omit<Client, 'id' | 'created_at'>;
        Update: Partial<Omit<Client, 'id' | 'created_at'>>;
      };
    };
  };
}>(supabaseUrl, supabaseAnonKey);

// Database operations
export const clientsApi = {
  // Get all clients
  getAll: async (): Promise<Client[]> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get single client by ID
  getById: async (id: string): Promise<Client | null> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new client
  create: async (client: Omit<Client, 'id' | 'created_at'>): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update client data
  update: async (id: string, updates: Partial<Omit<Client, 'id' | 'created_at'>>): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update cached post data and last refreshed timestamp
  updatePostData: async (id: string, postData: any[]): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .update({
        cached_post_data: postData,
        last_refreshed: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}; 