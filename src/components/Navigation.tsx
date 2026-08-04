import React from 'react';
import { Home, Compass, Sparkles, MessageSquare, Bell, User as UserIcon, PlusCircle, Layers, Flame } from 'lucide-react';
import { TabType, NotificationItem } from '../types';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  notifications: NotificationItem[];
  onOpenCreateModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  notifications,
  onOpenCreateModal,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'explore' as TabType, label: 'Explore & Channels', icon: Compass },
    { id: 'ai-power' as TabType, label: 'AI Power Studio', icon: Sparkles, badge: 'NEW' },
    { id: 'chat' as TabType, label: 'AI Chatbot', icon: MessageSquare },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell, count: unreadCount },
    { id: 'profile' as TabType, label: 'Profile', icon: UserIcon },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 gap-6 py-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="bg-[#121220]/80 border border-[#23233b] rounded-3xl p-4 shadow-xl backdrop-blur-md">
          <div className="text-[11px] font-bold text-gray-400/80 uppercase tracking-wider px-3 mb-3">
            Menu
          </div>
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-[#1d1d32]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-500/30 text-purple-200 border border-purple-400/30">
                      {item.badge}
                    </span>
                  )}
                  {item.count ? item.count > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500 text-white">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Promo / Banner Card in Sidebar */}
        <div className="bg-gradient-to-b from-[#1a1738] to-[#111124] border border-purple-500/30 rounded-3xl p-4 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl group-hover:bg-purple-500/30 transition-all" />
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-200">Wave Creator Pro</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed mb-3">
            Generate unlimited AI posts, high-res artworks, and smart viral channel summaries.
          </p>
          <button
            onClick={() => setActiveTab('ai-power')}
            className="w-full py-2 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            Open AI Studio
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d18]/95 backdrop-blur-xl border-t border-[#23233d] px-4 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
            activeTab === 'home' ? 'text-purple-400 font-bold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
            activeTab === 'explore' ? 'text-purple-400 font-bold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </button>

        {/* Floating Create Button */}
        <button
          onClick={onOpenCreateModal}
          className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 border-2 border-[#0d0d18] active:scale-95 transition-transform cursor-pointer"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
            activeTab === 'chat' ? 'text-purple-400 font-bold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">AI Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 p-1 cursor-pointer ${
            activeTab === 'profile' ? 'text-purple-400 font-bold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </>
  );
};
