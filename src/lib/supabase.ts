
// This is a mock implementation for demo purposes
// No actual Supabase calls are made in this demo

import { User } from "@/types";

// Mock current user (matches the one in AuthContext)
const MOCK_USER = {
  id: "demo-user-123",
  email: "demo@example.com",
  username: "demouser",
  profile_image: "https://picsum.photos/id/1012/200",
  points: 75,
  posts_shared: 5,
  reposts_received: 12,
  reposts_made: 8
};

// Dummy client for demo purposes
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: MOCK_USER } } }),
    getUser: async () => ({ data: { user: MOCK_USER } }),
    signInWithPassword: async () => ({ data: { user: MOCK_USER }, error: null }),
    signUp: async () => ({ data: { user: MOCK_USER }, error: null }),
    signOut: async () => ({ error: null }),
    signInWithOAuth: async () => ({ error: null }),
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
        single: async () => ({ data: MOCK_USER, error: null }),
        maybeSingle: async () => ({ data: MOCK_USER, error: null })
      }),
      order: () => ({
        limit: async () => ({ data: [], error: null })
      })
    }),
    insert: () => ({
      select: async () => ({ data: [{ id: 'new-id' }], error: null })
    }),
    update: () => ({
      eq: async () => ({ error: null })
    })
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({})
    }),
    subscribe: () => ({})
  }),
  removeChannel: () => {}
};

// Auth helper functions
export const getCurrentUser = async () => {
  return MOCK_USER;
};

export const getCurrentUserProfile = async () => {
  return MOCK_USER;
};

// Export auth functions
export const authUtils = {
  login: async () => ({ data: { user: MOCK_USER }, error: null }),
  register: async () => ({ data: { user: MOCK_USER }, error: null }),
  logout: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null })
};

// Post related functions
export const postUtils = {
  getPosts: async () => ({ data: [], error: null }),
  getUserPosts: async () => ({ data: [], error: null }),
  getUserReposts: async () => ({ data: [], error: null }),
  createPost: async () => ({ data: [{ id: 'new-post-id' }], error: null }),
  createRepost: async () => ({ error: null }),
  checkIfReposted: async () => ({ reposted: false })
};

// Redemption related functions
export const redemptionUtils = {
  createRedemption: async () => ({ id: 'new-redemption-id' }),
  getUserRedemptions: async () => ({ data: [], error: null })
};
