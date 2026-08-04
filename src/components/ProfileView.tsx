import React, { useState } from 'react';
import { User, Post } from '../types';
import { PostCard } from './PostCard';
import { CheckCircle2, Edit3, Grid, Heart, Bookmark, Users, Sparkles, MapPin, Calendar, Link as LinkIcon, X, Check } from 'lucide-react';

interface ProfileViewProps {
  currentUser: User;
  posts: Post[];
  sampleUsers: User[];
  onUpdateProfile: (updated: Partial<User>) => void;
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onRepostPost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onHashtagClick: (hashtag: string) => void;
  onChannelClick: (channelName: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  posts,
  sampleUsers,
  onUpdateProfile,
  onLikePost,
  onBookmarkPost,
  onRepostPost,
  onAddComment,
  onHashtagClick,
  onChannelClick,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'bookmarks'>('posts');
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(currentUser.name);
  const [editHandle, setEditHandle] = useState(currentUser.handle);
  const [editBio, setEditBio] = useState(currentUser.bio);

  const myPosts = posts.filter((p) => p.author.id === currentUser.id);
  const likedPosts = posts.filter((p) => p.likedByMe);
  const bookmarkedPosts = posts.filter((p) => p.bookmarkedByMe);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName.trim(),
      handle: editHandle.trim(),
      bio: editBio.trim(),
    });
    setIsEditingModalOpen(false);
  };

  const currentTabPosts =
    activeTab === 'posts' ? myPosts : activeTab === 'liked' ? likedPosts : bookmarkedPosts;

  return (
    <div className="flex-1 max-w-3xl mx-auto space-y-6 pb-16">
      {/* Profile Header Banner */}
      <div className="bg-[#121222] border border-[#23233c] rounded-3xl overflow-hidden shadow-xl">
        {/* Banner Cover Image */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900 relative">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
            alt="Cover"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121222] via-transparent to-black/30" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-14 sm:-mt-16 mb-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-[#121222] shadow-2xl"
              />
              {currentUser.verified && (
                <div className="absolute bottom-1 right-1 bg-purple-600 rounded-full p-1 text-white shadow-md">
                  <CheckCircle2 className="w-4 h-4 fill-white text-purple-600" />
                </div>
              )}
            </div>

            <button
              onClick={() => setIsEditingModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1b1b32] hover:bg-[#252545] border border-[#2e2e50] text-xs font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-400" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>{currentUser.name}</span>
                {currentUser.verified && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </h2>
              <span className="text-xs text-gray-400 font-mono">{currentUser.handle}</span>
            </div>

            <p className="text-xs text-gray-200 leading-relaxed max-w-xl">
              {currentUser.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>San Francisco, CA</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Joined August 2026</span>
              </span>
              <span className="flex items-center gap-1 text-purple-300 font-semibold">
                <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>wave.ai/alexmorgan</span>
              </span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 pt-3 border-t border-[#212138] text-xs">
              <div>
                <span className="font-extrabold text-white text-sm mr-1">{myPosts.length}</span>
                <span className="text-gray-400">Posts</span>
              </div>

              <button
                onClick={() => setShowFollowersModal(true)}
                className="hover:underline cursor-pointer"
              >
                <span className="font-extrabold text-white text-sm mr-1">
                  {currentUser.followersCount}
                </span>
                <span className="text-gray-400">Followers</span>
              </button>

              <button
                onClick={() => setShowFollowersModal(true)}
                className="hover:underline cursor-pointer"
              >
                <span className="font-extrabold text-white text-sm mr-1">
                  {currentUser.followingCount}
                </span>
                <span className="text-gray-400">Following</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#212138] bg-[#121222] p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 rounded-xl cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>My Posts ({myPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`flex-1 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 rounded-xl cursor-pointer ${
            activeTab === 'liked'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Liked ({likedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 rounded-xl cursor-pointer ${
            activeTab === 'bookmarks'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarks ({bookmarkedPosts.length})</span>
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {currentTabPosts.length > 0 ? (
          currentTabPosts.map((post) => (
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
          ))
        ) : (
          <div className="text-center py-12 bg-[#121222] border border-[#23233c] rounded-3xl">
            <p className="text-xs text-gray-400">No posts in this section yet.</p>
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121222] border border-[#272744] w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#23233c] pb-3">
              <h3 className="text-sm font-bold text-white">Edit Profile</h3>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#18182b] border border-[#2d2d48] text-xs text-white rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Handle
                </label>
                <input
                  type="text"
                  value={editHandle}
                  onChange={(e) => setEditHandle(e.target.value)}
                  className="w-full bg-[#18182b] border border-[#2d2d48] text-xs text-white rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#18182b] border border-[#2d2d48] text-xs text-white rounded-xl p-3 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOLLOWERS MODAL */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121222] border border-[#272744] w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#23233c] pb-3">
              <h3 className="text-sm font-bold text-white">Wave Network Creators</h3>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {sampleUsers
                .filter((u) => u.id !== currentUser.id)
                .map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 bg-[#18182d] rounded-2xl border border-[#252542]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-500/30"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-gray-400 font-mono text-[11px]">{u.handle}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Toggled follow for ${u.name}`)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    >
                      {u.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
