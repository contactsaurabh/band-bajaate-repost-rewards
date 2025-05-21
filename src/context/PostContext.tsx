
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Post } from "@/types";
import { mockPosts } from "@/lib/mock-data";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  sharePost: (tweetUrl: string) => Promise<void>;
  repostTweet: (postId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType>({
  posts: [],
  isLoading: false,
  sharePost: async () => {},
  repostTweet: async () => {}
});

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    // Simulate loading posts from API
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPosts(mockPosts);
      } catch (error) {
        toast.error("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  const sharePost = async (tweetUrl: string) => {
    if (!user) {
      toast.error("You must be logged in to share posts");
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call to share a post
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Extract tweet ID from URL
      const urlParts = tweetUrl.split("/");
      const tweetId = urlParts[urlParts.length - 1];
      
      const newPost: Post = {
        id: `post-${Date.now()}`,
        tweetUrl,
        tweetId,
        userId: user.id,
        username: user.username,
        userProfileImage: user.profileImage,
        content: "This is a newly shared post from our platform!", // Would be fetched from Twitter API
        createdAt: new Date().toISOString(),
        repostCount: 0,
        reposted: false
      };
      
      setPosts([newPost, ...posts]);
      toast.success("Post shared successfully");
    } catch (error) {
      toast.error("Failed to share post");
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
      // Simulate API call to repost a tweet
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
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
    } catch (error) {
      toast.error("Failed to repost");
    }
  };
  
  return (
    <PostContext.Provider
      value={{
        posts,
        isLoading,
        sharePost,
        repostTweet
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
