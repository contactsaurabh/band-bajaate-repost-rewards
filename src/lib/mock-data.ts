
import { User, Post } from "../types";

// Mock user data
export const mockCurrentUser: User = {
  id: "user-1",
  username: "consumer_advocate",
  profileImage: "https://picsum.photos/id/1012/200",
  points: 75,
  postsShared: 5,
  repostsReceived: 12,
  repostsMade: 8
};

// Mock posts data
export const mockPosts: Post[] = [
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
    userId: "user-1",
    username: "consumer_advocate",
    userProfileImage: "https://picsum.photos/id/1012/200",
    content: "Bank charged unexpected 'account maintenance fee' on my savings account that was never disclosed. @FinanceMinistry this needs to be regulated! #BankingPractices",
    createdAt: "2023-05-13T08:30:00Z",
    repostCount: 18,
    reposted: false
  }
];
