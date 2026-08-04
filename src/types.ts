export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  bio: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likes: number;
  likedByMe?: boolean;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  hashtags: string[];
  likes: number;
  commentsCount: number;
  reposts: number;
  shares: number;
  bookmarks: number;
  timestamp: string;
  likedByMe?: boolean;
  bookmarkedByMe?: boolean;
  repostedByMe?: boolean;
  comments: Comment[];
  channelId?: string;
  channelName?: string;
  isAiGenerated?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  category: string;
  iconName: string;
  bannerUrl: string;
  memberCount: number;
  isJoined?: boolean;
  topPostsCount?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'repost' | 'ai';
  user?: User;
  content: string;
  timestamp: string;
  read: boolean;
  targetPostId?: string;
}

export type TabType = 'home' | 'explore' | 'create' | 'ai-power' | 'chat' | 'notifications' | 'profile';
