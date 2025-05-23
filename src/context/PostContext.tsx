
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Post } from "@/types";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Mock post data for demo
const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    tweetUrl: "https://twitter.com/user/status/1234567890",
    tweetId: "1234567890",
    userId: "user-2",
    username: "telecom_issues",
    userProfileImage: "https://picsum.photos/id/1025/200",
    content: "Experiencing constant call drops with @MajorTelecom for the third day. Customer service keeps me on hold for hours. #ConsumerRights",
    createdAt: "2023-05-15T10:30:00Z",
    repostCount: 24,
    reposted: false
  },
  {
    id: "post-2",
    tweetUrl: "https://twitter.com/user/status/1234567891",
    tweetId: "1234567891",
    userId: "user-3",
    username: "retail_watchdog",
    userProfileImage: "https://picsum.photos/id/1011/200",
    content: "Ordered a premium smartphone from @TechGiant - received a counterfeit product. Return policy says I can't return opened items. Is this legal? #ConsumerFraud",
    createdAt: "2023-05-14T15:45:00Z",
    repostCount: 42,
    reposted: true
  },
  {
    id: "post-3",
    tweetUrl: "https://twitter.com/user/status/1234567892",
    tweetId: "1234567892",
    userId: "user-4",
    username: "food_safety_now",
    userProfileImage: "https://picsum.photos/id/1005/200",
    content: "Found foreign object in packaged food from @MegaGrocer. Company offered only store credit as compensation. Need proper investigation! #FoodSafety",
    createdAt: "2023-05-14T09:20:00Z",
    repostCount: 31,
    reposted: false
  },
  {
    id: "post-4",
    tweetUrl: "https://twitter.com/user/status/1234567893",
    tweetId: "1234567893",
    userId: "user-5",
    username: "travel_truth",
    userProfileImage: "https://picsum.photos/id/1006/200",
    content: "Airlines charging 'convenience fee' for web booking, 'service fee' at counter, and 'priority fee' for normal boarding. @AirRegulator where are you? #HiddenCharges",
    createdAt: "2023-05-13T12:10:00Z",
    repostCount: 56,
    reposted: false
  },
  {
    id: "post-5",
    tweetUrl: "https://twitter.com/user/status/1234567894",
    tweetId: "1234567894",
    userId: "demo-user-123",
    username: "demouser",
    userProfileImage: "https://picsum.photos/id/1012/200",
    content: "Bank charged unexpected 'account maintenance fee' on my savings account that was never disclosed. @FinanceMinistry this needs to be regulated! #BankingPractices",
    createdAt: "2023-05-13T08:30:00Z",
    repostCount: 18,
    reposted: false
  }
];

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
  
  // Initialize with mock data
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPosts(MOCK_POSTS);
      setIsLoading(false);
    }, 1000);
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
      
      // Create new post with mock data
      const newPost: Post = {
        id: `post-${Date.now()}`,
        tweetUrl: tweetUrl,
        tweetId: tweetId,
        userId: user.id,
        username: user.username,
        userProfileImage: user.profileImage,
        content: "Shared from Band Bajaate Raho", // Ideally fetch real tweet content
        createdAt: new Date().toISOString(),
        repostCount: 0,
        reposted: false
      };
      
      // Add to posts
      setPosts([newPost, ...posts]);
      toast.success("Post shared successfully");
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
      // Find the post
      const post = posts.find(p => p.id === postId);
      if (!post) {
        toast.error("Post not found");
        return;
      }
      
      // Check if already reposted
      if (post.reposted) {
        toast.error("You've already reposted this");
        return;
      }
      
      // Update local state
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            repostCount: p.repostCount + 1,
            reposted: true
          };
        }
        return p;
      }));
      
      toast.success("+1 point earned for reposting!");
    } catch (error: any) {
      toast.error(`Failed to repost: ${error.message}`);
    }
  };
  
  const refreshPosts = async () => {
    setIsLoading(true);
    // Simulate refreshing posts
    setTimeout(() => {
      setPosts([...MOCK_POSTS]);
      setIsLoading(false);
      toast.success("Posts refreshed");
    }, 1000);
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
