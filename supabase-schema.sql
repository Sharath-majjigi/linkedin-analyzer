-- LinkedIn Performance Dashboard Database Schema
-- Run this SQL in your Supabase SQL editor

-- Create the clients table
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  company_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  linkedin_url TEXT NOT NULL UNIQUE,
  last_refreshed TIMESTAMPTZ,
  cached_post_data JSONB
);

-- Disable Row Level Security (RLS) for public access
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_clients_created_at ON public.clients(created_at DESC);
CREATE INDEX idx_clients_linkedin_url ON public.clients(linkedin_url);
CREATE INDEX idx_clients_last_refreshed ON public.clients(last_refreshed);

-- Grant necessary permissions
GRANT ALL ON public.clients TO anon;
GRANT ALL ON public.clients TO authenticated;

-- Optional: Insert some sample data for testing
-- INSERT INTO public.clients (company_name, founder_name, linkedin_url) VALUES
--   ('Sample Company', 'John Doe', 'https://www.linkedin.com/in/johndoe'),
--   ('Test Corp', 'Jane Smith', 'https://www.linkedin.com/in/janesmith'); 