import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Feed } from './components/Feed';
import { ExploreChannels } from './components/ExploreChannels';
import { AIStudio } from './components/AIStudio';
import { AIChatView } from './components/AIChatView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { RightSidebar } from './components/RightSidebar';
import { CreatePostModal } from './components/CreatePostModal';

import { currentUser as initialUser, initialPosts, initialChannels, initialNotifications, sampleUsers } from './data/mockData';
import { Post, Channel, NotificationItem, User, TabType } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeChannelFilter, setActiveChannelFilter] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Handlers for Post Interactions
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.likedByMe;
          return {
            ...p,
            likedByMe: isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isBookmarked = !p.bookmarkedByMe;
          return {
            ...p,
            bookmarkedByMe: isBookmarked,
            bookmarks: isBookmarked ? p.bookmarks + 1 : p.bookmarks - 1,
          };
        }
        return p;
      })
    );
  };

  const handleRepostPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isReposted = !p.repostedByMe;
          return {
            ...p,
            repostedByMe: isReposted,
            reposts: isReposted ? p.reposts + 1 : p.reposts - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, commentText: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      author: currentUser,
      content: commentText,
      timestamp: 'Just now',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (newPostData: {
    content: string;
    imageUrl?: string;
    hashtags: string[];
    channelId?: string;
    channelName?: string;
    isAiGenerated?: boolean;
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      content: newPostData.content,
      imageUrl: newPostData.imageUrl,
      hashtags: newPostData.hashtags,
      likes: 1,
      commentsCount: 0,
      reposts: 0,
      shares: 0,
      bookmarks: 0,
      timestamp: 'Just now',
      likedByMe: true,
      comments: [],
      channelId: newPostData.channelId,
      channelName: newPostData.channelName,
      isAiGenerated: newPostData.isAiGenerated,
    };

    setPosts([newPost, ...posts]);
    setCurrentUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
    setActiveTab('home');
  };

  const handleToggleJoinChannel = (channelId: string) => {
    setChannels((prev) =>
      prev.map((c) => {
        if (c.id === channelId) {
          const isJoined = !c.isJoined;
          return {
            ...c,
            isJoined,
            memberCount: isJoined ? c.memberCount + 1 : c.memberCount - 1,
          };
        }
        return c;
      })
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectChannel = (channelName: string) => {
    setActiveChannelFilter(channelName);
    setActiveTab('home');
  };

  const handleHashtagClick = (hashtag: string) => {
    setSearchQuery(`#${hashtag}`);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100 font-sans selection:bg-purple-500 selection:text-white antialiased">
      {/* Top Fixed Header */}
      <Header
        currentUser={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenAIChat={() => setActiveTab('chat')}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenNotifications={() => setActiveTab('notifications')}
      />

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex gap-8">
        {/* Navigation Sidebar (Desktop) + Mobile Bottom Bar */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          notifications={notifications}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        {/* Main Content View Switcher */}
        <main className="flex-1 py-6 min-w-0">
          {activeTab === 'home' && (
            <Feed
              posts={posts}
              currentUser={currentUser}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              activeChannelFilter={activeChannelFilter}
              clearChannelFilter={() => setActiveChannelFilter(null)}
              onLikePost={handleLikePost}
              onBookmarkPost={handleBookmarkPost}
              onRepostPost={handleRepostPost}
              onAddComment={handleAddComment}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenAIChat={() => setActiveTab('chat')}
              onHashtagClick={handleHashtagClick}
              onChannelClick={handleSelectChannel}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreChannels
              channels={channels}
              onToggleJoinChannel={handleToggleJoinChannel}
              onSelectChannel={handleSelectChannel}
            />
          )}

          {activeTab === 'ai-power' && (
            <AIStudio
              currentUser={currentUser}
              channels={channels}
              onCreatePost={handleCreatePost}
            />
          )}

          {activeTab === 'chat' && (
            <AIChatView
              onOpenCreatePostWithIdea={(ideaText) => {
                handleCreatePost({
                  content: ideaText,
                  hashtags: ['WaveAI', 'FutureTech'],
                });
              }}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              posts={posts}
              sampleUsers={sampleUsers}
              onUpdateProfile={handleUpdateProfile}
              onLikePost={handleLikePost}
              onBookmarkPost={handleBookmarkPost}
              onRepostPost={handleRepostPost}
              onAddComment={handleAddComment}
              onHashtagClick={handleHashtagClick}
              onChannelClick={handleSelectChannel}
            />
          )}
        </main>

        {/* Right Sidebar (Desktop) */}
        <RightSidebar
          channels={channels}
          onOpenAIGenerator={() => setActiveTab('ai-power')}
          onOpenAIChat={() => setActiveTab('chat')}
          onOpenChannel={handleSelectChannel}
          onHashtagClick={handleHashtagClick}
        />
      </div>

      {/* Global Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        channels={channels}
        onCreatePost={handleCreatePost}
      />
    </div>
  );
}
