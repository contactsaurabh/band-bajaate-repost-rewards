
import { supabase } from './client';
import { getCurrentUser } from './auth';

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
