import React, { useState } from 'react';
import { Search, Bell, Sparkles, Plus, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { User, NotificationItem } from '../types';

interface HeaderProps {
  currentUser: User;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: NotificationItem[];
  onOpenCreateModal: () => void;
  onOpenAIChat: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  searchQuery,
  setSearchQuery,
  notifications,
  onOpenCreateModal,
  onOpenAIChat,
  onOpenProfile,
  onOpenNotifications,
}) => {
  const [showNotificationsPopover, setShowNotificationsPopover] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d15]/85 backdrop-blur-xl border-b border-[#232338] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group hover:scale-105 transition-transform">
            <span className="text-white font-black text-2xl italic tracking-tighter group-hover:rotate-6 transition-transform">W</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Wave
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI v2
              </span>
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, #hashtags, channels, creators..."
            className="w-full bg-[#161626] border border-[#2d2d48] hover:border-purple-500/40 focus:border-purple-500 text-sm text-gray-100 placeholder-gray-400/60 rounded-full pl-10 pr-4 py-2 transition-all outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-[#28283f] w-5 h-5 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Generator quick pill */}
          <button
            onClick={onOpenAIChat}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-800/60 hover:to-indigo-800/60 border border-purple-500/40 text-purple-200 text-xs font-semibold shadow-sm hover:shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Wave AI</span>
          </button>

          {/* Create Post Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-violet-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationsPopover(!showNotificationsPopover);
                onOpenNotifications();
              }}
              className="relative p-2.5 rounded-full bg-[#181828] hover:bg-[#23233b] border border-[#2a2a44] text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Profile Avatar */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-[#161626] hover:bg-[#222238] border border-[#2b2b46] transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/50"
            />
            <span className="hidden lg:inline text-xs font-semibold text-gray-200">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
