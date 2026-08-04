import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat, Bookmark, Share2, Sparkles, Send, CheckCircle2, MoreHorizontal, MessageSquareCode } from 'lucide-react';
import { Post, Comment, User } from '../types';
import { safeApiCall } from '../lib/apiHelper';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onRepost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onHashtagClick?: (hashtag: string) => void;
  onChannelClick?: (channelName: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLike,
  onBookmark,
  onRepost,
  onAddComment,
  onHashtagClick,
  onChannelClick,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isGettingSmartReplies, setIsGettingSmartReplies] = useState(false);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [imageExpanded, setImageExpanded] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleFetchSmartReplies = async () => {
    setIsGettingSmartReplies(true);
    try {
      const data = await safeApiCall('/api/ai/smart-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postContent: post.content }),
      });
      if (data.success && Array.isArray(data.suggestions)) {
        setSmartReplies(data.suggestions);
      }
    } catch (err) {
      console.error('Smart reply error:', err);
    } finally {
      setIsGettingSmartReplies(false);
    }
  };

  return (
    <article className="bg-[#121222]/90 border border-[#23233c] hover:border-purple-500/30 rounded-3xl p-5 shadow-lg transition-all">
      {/* Top Header: Channel tag + Author */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/40"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-gray-100 hover:text-purple-300 transition-colors cursor-pointer">
                {post.author.name}
              </span>
              {post.author.verified && (
                <CheckCircle2 className="w-4 h-4 text-purple-400 fill-purple-400/20" />
              )}
              <span className="text-xs text-gray-400 font-mono">
                {post.author.handle}
              </span>
              <span className="text-gray-600 text-xs">•</span>
              <span className="text-xs text-gray-400">{post.timestamp}</span>
            </div>

            {post.channelName && (
              <button
                onClick={() => onChannelClick && onChannelClick(post.channelName!)}
                className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-bold text-purple-300 bg-purple-500/15 border border-purple-500/25 px-2 py-0.5 rounded-full hover:bg-purple-500/25 transition-colors cursor-pointer"
              >
                <span>in</span>
                <span className="underline">{post.channelName}</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post.isAiGenerated && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-purple-300 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-400/40 px-2.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 text-purple-300 animate-pulse" />
              <span>AI Generated</span>
            </span>
          )}
          <button className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1f1f33] transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Text */}
      <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap mb-3">
        {post.content}
      </p>

      {/* Image if available */}
      {post.imageUrl && (
        <div className="relative mb-3 overflow-hidden rounded-2xl border border-[#272740] bg-[#0a0a12]">
          <img
            src={post.imageUrl}
            alt="Post media"
            onClick={() => setImageExpanded(!imageExpanded)}
            className={`w-full object-cover transition-all duration-300 cursor-pointer ${
              imageExpanded ? 'max-h-[600px] object-contain bg-black' : 'max-h-96 hover:scale-[1.01]'
            }`}
          />
        </div>
      )}

      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.hashtags.map((tag) => (
            <button
              key={tag}
              onClick={() => onHashtagClick && onHashtagClick(tag)}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Interaction Controls */}
      <div className="flex items-center justify-between border-t border-[#212138] pt-3 text-gray-400 text-xs">
        {/* Like Button */}
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-rose-500/10 transition-all cursor-pointer ${
            post.likedByMe ? 'text-rose-400 font-bold' : 'hover:text-rose-400'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              post.likedByMe ? 'fill-rose-500 text-rose-500 scale-110' : ''
            } transition-transform`}
          />
          <span>{post.likes}</span>
        </button>

        {/* Comment Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-purple-500/10 hover:text-purple-300 transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.commentsCount}</span>
        </button>

        {/* Repost */}
        <button
          onClick={() => onRepost(post.id)}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-emerald-500/10 transition-all cursor-pointer ${
            post.repostedByMe ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>{post.reposts}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={() => onBookmark(post.id)}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-amber-500/10 transition-all cursor-pointer ${
            post.bookmarkedByMe ? 'text-amber-400 font-bold' : 'hover:text-amber-400'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.bookmarkedByMe ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{post.bookmarks}</span>
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-[#23233d] space-y-3">
          {/* AI Smart Replies Bar */}
          <div className="flex items-center justify-between gap-2 bg-[#17172b] p-2.5 rounded-2xl border border-purple-500/20">
            <span className="text-[11px] font-semibold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              AI Assistant Replies
            </span>
            <button
              onClick={handleFetchSmartReplies}
              disabled={isGettingSmartReplies}
              className="text-[10px] font-bold text-white bg-purple-600 hover:bg-purple-500 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isGettingSmartReplies ? 'Generating...' : 'Suggest Replies'}
            </button>
          </div>

          {smartReplies.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {smartReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => setCommentInput(reply)}
                  className="text-xs bg-[#202038] hover:bg-purple-900/40 text-purple-200 border border-purple-500/30 px-3 py-1.5 rounded-xl transition-all text-left cursor-pointer"
                >
                  "{reply}"
                </button>
              ))}
            </div>
          )}

          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-500/40 shrink-0"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a thoughtful comment..."
                className="flex-1 bg-[#18182a] border border-[#2e2e48] focus:border-purple-500 text-xs text-white placeholder-gray-500 rounded-xl px-3 py-2 outline-none"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Existing Comments List */}
          <div className="space-y-2.5 pt-1">
            {post.comments.map((comm) => (
              <div key={comm.id} className="flex gap-2.5 bg-[#161628] p-3 rounded-2xl border border-[#222238]">
                <img
                  src={comm.author.avatar}
                  alt={comm.author.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-200">{comm.author.name}</span>
                    <span className="text-[10px] text-gray-500">{comm.timestamp}</span>
                  </div>
                  <p className="text-gray-300 mt-1 leading-relaxed">{comm.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
