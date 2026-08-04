import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Flame, Clock, Filter, Wand2, X } from 'lucide-react';
import { Post, User, Channel } from '../types';
import { StoriesBar } from './StoriesBar';
import { PostCard } from './PostCard';

interface FeedProps {
  posts: Post[];
  currentUser: User;
  searchQuery: string;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  activeChannelFilter: string | null;
  clearChannelFilter: () => void;
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onRepostPost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenCreateModal: () => void;
  onOpenAIChat: () => void;
  onHashtagClick: (hashtag: string) => void;
  onChannelClick: (channelName: string) => void;
}

export const Feed: React.FC<FeedProps> = ({
  posts,
  currentUser,
  searchQuery,
  selectedCategory,
  setSelectedCategory,
  activeChannelFilter,
  clearChannelFilter,
  onLikePost,
  onBookmarkPost,
  onRepostPost,
  onAddComment,
  onOpenCreateModal,
  onOpenAIChat,
  onHashtagClick,
  onChannelClick,
}) => {
  const [feedFilter, setFeedFilter] = useState<'top' | 'recent' | 'ai'>('recent');

  // Filter logic
  let filteredPosts = posts.filter((post) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().replace(/^#/, '');
      const matchText = post.content.toLowerCase().includes(q);
      const matchAuthor = post.author.name.toLowerCase().includes(q) || post.author.handle.toLowerCase().includes(q);
      const matchTag = post.hashtags.some((tag) => tag.toLowerCase().includes(q));
      const matchChannel = post.channelName?.toLowerCase().includes(q);
      if (!matchText && !matchAuthor && !matchTag && !matchChannel) return false;
    }

    // Active Channel filter
    if (activeChannelFilter) {
      if (post.channelName?.toLowerCase() !== activeChannelFilter.toLowerCase()) return false;
    }

    // Category filter
    if (selectedCategory !== 'All') {
      if (post.channelName?.toLowerCase() !== selectedCategory.toLowerCase() &&
          !post.hashtags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase())) {
        return false;
      }
    }

    // Feed sub-filter
    if (feedFilter === 'ai' && !post.isAiGenerated) return false;

    return true;
  });

  // Sorting
  if (feedFilter === 'top') {
    filteredPosts = [...filteredPosts].sort((a, b) => b.likes - a.likes);
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto space-y-5 pb-16">
      {/* Stories / Topic Bubbles */}
      <StoriesBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenCreateModal={onOpenCreateModal}
      />

      {/* Quick Composer Card */}
      <div
        onClick={onOpenCreateModal}
        className="bg-[#121222]/90 border border-[#23233d] hover:border-purple-500/40 rounded-3xl p-4 shadow-lg cursor-pointer transition-all group"
      >
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/40 shrink-0"
          />
          <div className="flex-1 bg-[#18182b] border border-[#272740] group-hover:border-purple-500/30 rounded-2xl px-4 py-2.5 text-xs text-gray-400">
            What are you building or thinking with AI today?
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#202035] mt-3 pt-2.5 px-1 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCreateModal();
              }}
              className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Post</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCreateModal();
              }}
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Media</span>
            </button>
          </div>

          <span className="text-[10px] font-bold text-purple-300/80 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            ✨ Gemini 3.6 Ready
          </span>
        </div>
      </div>

      {/* Active Filter Badges */}
      {(activeChannelFilter || searchQuery || selectedCategory !== 'All') && (
        <div className="flex items-center flex-wrap gap-2 bg-[#141428] p-3 rounded-2xl border border-purple-500/30">
          <span className="text-xs font-semibold text-gray-300">Filtering by:</span>
          {activeChannelFilter && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-purple-600 text-white px-3 py-1 rounded-full shadow-sm">
              <span>Channel: {activeChannelFilter}</span>
              <button onClick={clearChannelFilter} className="hover:text-rose-200">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded-full shadow-sm">
              <span>Topic: {selectedCategory}</span>
              <button onClick={() => setSelectedCategory('All')} className="hover:text-rose-200">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#282845] text-purple-300 px-3 py-1 rounded-full">
              <span>Query: "{searchQuery}"</span>
            </span>
          )}
        </div>
      )}

      {/* Feed Filter Pills */}
      <div className="flex items-center justify-between border-b border-[#212138] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFeedFilter('recent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              feedFilter === 'recent'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-gray-400 hover:text-white bg-[#161628]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recent</span>
          </button>

          <button
            onClick={() => setFeedFilter('top')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              feedFilter === 'top'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-gray-400 hover:text-white bg-[#161628]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>

          <button
            onClick={() => setFeedFilter('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              feedFilter === 'ai'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-gray-400 hover:text-white bg-[#161628]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI Generated</span>
          </button>
        </div>

        <span className="text-xs text-gray-500 font-mono">
          {filteredPosts.length} posts
        </span>
      </div>

      {/* Posts List */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={onLikePost}
              onBookmark={onBookmarkPost}
              onRepost={onRepostPost}
              onAddComment={onAddComment}
              onHashtagClick={onHashtagClick}
              onChannelClick={onChannelClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 bg-[#121222] border border-[#23233d] rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Wave Posts Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your search query or generate a new AI post to share with the community!
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 inline-block cursor-pointer"
          >
            Create First Post
          </button>
        </div>
      )}
    </div>
  );
};
