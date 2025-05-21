
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentUserProfile = async () => {
  const user = await getCurrentUser();
  
  if (!user) return null;
  
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return data;
};

// Export auth functions
export const authUtils = {
  login: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  register: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  
  logout: async () => {
    return await supabase.auth.signOut();
  },
  
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
  }
};

// Post related functions
export const postUtils = {
  getPosts: async (sortBy = 'recent', limit = 20) => {
    const query = supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (username, profile_image),
        reposts:reposts (user_id),
        repost_count:reposts (count)
      `);
    
    if (sortBy === 'recent') {
      query.order('created_at', { ascending: false });
    } else if (sortBy === 'popular') {
      query.order('repost_count', { ascending: false });
    }
    
    return await query.limit(limit);
  },
  
  getUserPosts: async (userId: string) => {
    return await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (username, profile_image),
        reposts:reposts (user_id),
        repost_count:reposts (count)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },
  
  getUserReposts: async (userId: string) => {
    return await supabase
      .from('reposts')
      .select(`
        posts:post_id (
          *,
          profiles:user_id (username, profile_image),
          repost_count:reposts (count)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },
  
  createPost: async (postData: { tweet_url: string, tweet_id: string, content?: string }) => {
    const user = await getCurrentUser();
    
    if (!user) throw new Error('User not authenticated');
    
    return await supabase
      .from('posts')
      .insert({
        ...postData,
        user_id: user.id
      })
      .select();
  },
  
  createRepost: async (postId: string) => {
    const user = await getCurrentUser();
    
    if (!user) throw new Error('User not authenticated');
    
    return await supabase
      .from('reposts')
      .insert({
        post_id: postId,
        user_id: user.id
      })
      .select();
  },
  
  checkIfReposted: async (postId: string) => {
    const user = await getCurrentUser();
    
    if (!user) return { reposted: false };
    
    const { data } = await supabase
      .from('reposts')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    return { reposted: !!data };
  }
};

// Redemption related functions
export const redemptionUtils = {
  createRedemption: async (data: { 
    points_amount: number, 
    money_amount: number,
    payment_method: string,
    payment_email: string 
  }) => {
    const user = await getCurrentUser();
    
    if (!user) throw new Error('User not authenticated');
    
    // First check if user has enough points
    const profile = await getCurrentUserProfile();
    
    if (!profile || profile.points < data.points_amount) {
      throw new Error('Insufficient points');
    }
    
    // Begin transaction to create redemption and reduce points
    const { data: redemption, error } = await supabase
      .from('redemptions')
      .insert({
        user_id: user.id,
        points_amount: data.points_amount,
        money_amount: data.money_amount,
        payment_method: data.payment_method,
        payment_email: data.payment_email
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Reduce points from user's profile
    await supabase
      .from('profiles')
      .update({
        points: profile.points - data.points_amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    // Record transaction
    await supabase
      .from('point_transactions')
      .insert({
        user_id: user.id,
        amount: -data.points_amount,
        description: `Points redeemed for ${data.payment_method}`,
        reference_id: redemption.id,
        transaction_type: 'REDEMPTION'
      });
      
    return redemption;
  },
  
  getUserRedemptions: async () => {
    const user = await getCurrentUser();
    
    if (!user) throw new Error('User not authenticated');
    
    return await supabase
      .from('redemptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
  }
};
