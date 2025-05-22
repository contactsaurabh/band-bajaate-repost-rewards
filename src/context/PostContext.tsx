
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Post } from "@/types";
import { toast } from "sonner";
import { supabase, postUtils } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  sharePost: (tweetUrl: string) => Promise<void>;
  repostTweet: (postId: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

const PostContext = createContext<PostContextType>({
  posts: [],
  isLoading: false,
  sharePost: async () => {},
  repostTweet: async () => {},
  refreshPosts: async () => {}
});

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
  const fetchPosts = async (sortBy = 'recent') => {
    setIsLoading(true);
    try {
      const { data, error } = await postUtils.getPosts(sortBy);
      
      if (error) throw error;
      
      if (data) {
        // Transform data to match our Post type
        const transformedPosts: Post[] = await Promise.all(data.map(async (post) => {
          // Check if the current user has reposted this post
          const { reposted } = await postUtils.checkIfReposted(post.id);
          
          return {
            id: post.id,
            tweetUrl: post.tweet_url,
            tweetId: post.tweet_id,
            userId: post.user_id,
            username: post.profiles?.username || 'unknown',
            userProfileImage: post.profiles?.profile_image,
            content: post.content || undefined,
            createdAt: post.created_at,
            repostCount: post.repost_count?.[0]?.count || 0,
            reposted: isAuthenticated ? reposted : false
          };
        }));
        
        setPosts(transformedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchPosts();
    
    // Listen for changes in the posts table
    const postsSubscription = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();
      
    // Also listen for reposts
    const repostsSubscription = supabase
      .channel('public:reposts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reposts' }, () => {
        fetchPosts();
      })
      .subscribe();
      
    // Cleanup
    return () => {
      supabase.removeChannel(postsSubscription);
      supabase.removeChannel(repostsSubscription);
    };
  }, []);
  
  const sharePost = async (tweetUrl: string) => {
    if (!user) {
      toast.error("You must be logged in to share posts");
      return;
    }
    
    setIsLoading(true);
    try {
      // Extract tweet ID from URL
      const urlParts = tweetUrl.split("/");
      const tweetId = urlParts[urlParts.length - 1].split("?")[0];
      
      // Create post in database
      const { data, error } = await postUtils.createPost({
        tweet_url: tweetUrl,
        tweet_id: tweetId,
        content: "Shared from Band Bajaate Raho" // Ideally fetch real tweet content
      });
      
      if (error) throw error;
      
      toast.success("Post shared successfully");
      await fetchPosts(); // Refresh posts
    } catch (error: any) {
      toast.error(`Failed to share post: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const repostTweet = async (postId: string) => {
    if (!user) {
      toast.error("You must be logged in to repost");
      return;
    }
    
    try {
      const { error } = await postUtils.createRepost(postId);
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error("You've already reposted this");
          return;
        }
        throw error;
      }
      
      // Update local state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            repostCount: post.repostCount + 1,
            reposted: true
          };
        }
        return post;
      }));
      
      toast.success("+1 point earned for reposting!");
    } catch (error: any) {
      toast.error(`Failed to repost: ${error.message}`);
    }
  };
  
  const refreshPosts = async () => {
    await fetchPosts();
  };
  
  return (
    <PostContext.Provider
      value={{
        posts,
        isLoading,
        sharePost,
        repostTweet,
        refreshPosts
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
