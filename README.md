# LinkedIn Performance Dashboard

A modern web application for tracking and analyzing LinkedIn post performance for multiple clients. Built with React, TypeScript, and Supabase.

## Features

- 📊 **Analytics Dashboard** - View comprehensive analytics including engagement rates and post performance
- 🔄 **Auto Refresh** - Fetch latest posts from LinkedIn profiles with one click
- 📈 **Performance Tracking** - Track likes, comments, shares, and total reactions
- 📱 **Post Categorization** - Automatically categorize posts by type (text, image, video, article, etc.)
- 🎨 **Modern UI** - Clean, responsive design with excellent user experience
- 🔐 **No Authentication Required** - Simple setup without user login complexity

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS3 with modern design patterns
- **State Management**: React Query (TanStack Query)
- **Database**: Supabase (PostgreSQL)
- **API Integration**: Apify LinkedIn Posts Scraper (Direct API calls)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Apify account with API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd linkedin-analyzer
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APIFY_API_KEY=your_apify_api_key
```

**Note**: Copy `env.example` to `.env` and fill in your actual values.

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL from `supabase-schema.sql` to create the required table
4. Copy your project URL and anon key from Settings > API

### 4. Apify API Key

1. Sign up at [apify.com](https://apify.com)
2. Get your API key from the Apify Console
3. Add it to your `.env` file for development
4. For production, users will enter it in the settings modal

### 5. Start Development Server

```bash
npm install
npm run dev
```

This will start the frontend development server (port 5173).
The application will be available at `http://localhost:5173`

**Note**: The app makes direct API calls to Apify from the frontend.

## Usage

### Adding Clients

1. Click "Add New Client" in the sidebar
2. Fill in the company name, founder name, and LinkedIn profile URL
3. Submit the form to add the client

### Refreshing Data

1. Select a client from the sidebar
2. Click "Refresh Data" to fetch the latest posts from LinkedIn
3. The system will automatically fetch all posts since January 1, 2025

### Viewing Analytics

- **Total Posts (Last 30 Days)**: Number of posts published in the last 30 days
- **Average Likes per Post**: Average likes across all posts
- **Total Comments (This Month)**: Total comments received this month

### Post Types

The system automatically categorizes posts into:
- **Text**: Plain text posts
- **Image**: Posts with images
- **Video**: Posts with videos
- **Link / Text**: Posts containing links
- **Article**: Posts linking to articles
- **Repost w/Text**: Reshared posts with additional text

## API Integration

The application integrates with the Apify actor `apimaestro/linkedin-posts-scraper` to fetch LinkedIn posts. The integration includes:

- **Pagination**: Automatically fetches multiple pages until reaching posts before 2025-01-01
- **Rate Limiting**: Includes delays between requests to be respectful to the API
- **Error Handling**: Graceful handling of API errors and network issues

## Database Schema

The application uses a single `clients` table with the following structure:

```sql
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  company_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  linkedin_url TEXT NOT NULL UNIQUE,
  last_refreshed TIMESTAMPTZ WITH TIME ZONE,
  cached_post_data JSONB
);
```

## Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Your app will be deployed** as a static frontend!

### Alternative Deployment Options

- **Netlify**: Deploy the frontend with `npm run build`
- **GitHub Pages**: Deploy the static build
- **Any static hosting**: Works with any static file hosting service

### API Keys in Production

**For Production Deployment:**
- **Supabase keys**: Can be set as environment variables in your hosting platform
- **Apify API key**: Users will enter this in the app's settings modal (stored in browser localStorage)

**Environment Variables for Production:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `VITE_APIFY_API_KEY` - (Optional) Default Apify API key for users

## Security

- **No Authentication**: The application is designed for public access without user login
- **RLS Disabled**: Row Level Security is disabled to allow public read/write access
- **API Key Storage**: Apify API key is stored locally in browser localStorage
- **Data Privacy**: All data is stored in your Supabase instance

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── AddClientModal.tsx
│   ├── SettingsModal.tsx
│   └── PostsTable.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   └── ClientView.tsx
├── lib/                # Utility libraries
│   ├── supabase.ts     # Supabase client
│   ├── apify.ts        # Apify API integration
│   └── utils.ts        # Utility functions
├── hooks/              # React Query hooks
│   └── useClients.ts
└── types/              # TypeScript types
    └── index.ts
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify your environment variables are correct
   - Check that RLS is disabled on the clients table

2. **Apify API Errors**
   - Ensure your API key is valid
   - Check that you have sufficient credits in your Apify account

3. **No Posts Loading**
   - Verify the LinkedIn URL is correct and accessible
   - Check browser console for API errors

### Support

For issues and questions, please check the browser console for error messages and ensure all setup steps have been completed correctly.

## License

This project is open source and available under the MIT License. 