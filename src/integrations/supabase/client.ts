
// This is a mock implementation for demo purposes

const SUPABASE_URL = "https://mock-supabase-url.co";
const SUPABASE_PUBLISHABLE_KEY = "mock-key";

// Mock Supabase client for demo
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    getUser: async () => ({ data: { user: null } }),
    signInWithPassword: async () => ({}),
    signUp: async () => ({}),
    signOut: async () => ({}),
    onAuthStateChange: () => ({ 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({})
      })
    }),
    insert: () => ({
      select: async () => ({})
    }),
    update: () => ({
      eq: async () => ({})
    })
  })
};
