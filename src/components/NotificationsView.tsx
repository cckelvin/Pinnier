import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Sparkles, CheckCheck } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-purple-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-indigo-400" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto space-y-5 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-[#121222] border border-[#23233c] p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Notifications</h2>
            <p className="text-xs text-gray-400">Activity on your Wave profile & posts</p>
          </div>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs font-semibold text-purple-300 hover:text-white bg-[#1a1a32] hover:bg-[#232342] border border-[#2e2e4c] px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-[#141426] text-gray-400 hover:text-white border border-[#252540]'
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'bg-purple-600 text-white'
              : 'bg-[#141426] text-gray-400 hover:text-white border border-[#252540]'
          }`}
        >
          Unread
        </button>
      </div>

      {/* Notification Items */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                !item.read
                  ? 'bg-[#17172e] border-purple-500/40 shadow-md'
                  : 'bg-[#121222] border-[#222238]'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.user ? (
                  <img
                    src={item.user.avatar}
                    alt={item.user.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-purple-500/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-300" />
                  </div>
                )}

                <div className="text-xs">
                  <p className="text-gray-200">
                    {item.user && <span className="font-bold text-white mr-1">{item.user.name}</span>}
                    {item.content}
                  </p>
                  <span className="text-[10px] text-gray-500 mt-0.5 inline-block">{item.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {getIcon(item.type)}
                {!item.read && <span className="w-2 h-2 rounded-full bg-purple-500" />}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-[#121222] border border-[#23233c] rounded-3xl">
            <Bell className="w-8 h-8 text-purple-400/50 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No notifications to display right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};
