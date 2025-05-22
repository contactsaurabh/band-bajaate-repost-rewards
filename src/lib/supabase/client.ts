
import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

// Supabase configuration - use direct URLs and keys for reliability
const supabaseUrl = "https://qoobtaqybiumriieaorc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvb2J0YXF5Yml1bXJpaWVhb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODg4MzEsImV4cCI6MjA2MzQ2NDgzMX0.H7M-lBtvKHxFCKRT7EP0CLs6KKE5IeTpctqgrTDHsL0";

// Get the current base URL (works in development and production)
export const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    // Use the deployment URL or preview URL directly
    const deployUrl = window.location.origin;
    console.log("Using redirect URL from client:", deployUrl);
    return deployUrl;
  }
  return '';
};

// Create Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'pkce', // More secure authentication flow
      detectSessionInUrl: true,
      site: getRedirectUrl()
    }
  }
);
