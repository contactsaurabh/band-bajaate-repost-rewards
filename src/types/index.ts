
export interface User {
  id: string;
  username: string;
  profileImage?: string;
  points: number;
  postsShared: number;
  repostsReceived: number;
  repostsMade: number;
}

export interface Post {
  id: string;
  tweetUrl: string;
  tweetId: string;
  userId: string;
  username: string;
  userProfileImage?: string;
  content?: string;
  createdAt: string;
  repostCount: number;
  reposted: boolean; // Whether the current user has reposted this
}

export interface Redemption {
  id: string;
  userId: string;
  pointsAmount: number;
  moneyAmount: number;
  paymentEmail: string;
  status: 'pending' | 'processed' | 'failed';
  paymentMethod: string;
  createdAt: string;
  processedAt?: string;
}

export interface RedemptionOption {
  value: string;
  label: string;
  points: number;
  amount: number;
}
