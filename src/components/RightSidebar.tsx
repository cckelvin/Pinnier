import React from 'react';
import { Sparkles, MessageSquare, Image as ImageIcon, Users, MessageSquareQuote, Award, TrendingUp, ChevronRight } from 'lucide-react';
import { Channel } from '../types';

interface RightSidebarProps {
  channels: Channel[];
  onOpenAIGenerator: () => void;
  onOpenAIChat: () => void;
  onOpenChannel: (channelName: string) => void;
  onHashtagClick: (hashtag: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  channels,
  onOpenAIGenerator,
  onOpenAIChat,
  onOpenChannel,
  onHashtagClick,
}) => {
  const trendingTags = ['Gemini', 'AIArt', 'FutureTech', 'Web3', 'DesignSystem', 'Quantum'];

  return (
    <aside className="hidden lg:flex flex-col w-80 shrink-0 gap-5 py-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* AI POWER SECTION */}
      <div>
        <div className="text-[11px] font-bold text-purple-400/90 uppercase tracking-widest px-1 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Power</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* AI Post Generator Card */}
          <div className="bg-[#141428] border border-purple-500/30 rounded-2xl p-3.5 flex flex-col justify-between hover:border-purple-500/60 transition-all group">
            <div>
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400 mb-2">
                <Wand2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">AI Post Generator</h4>
              <p className="text-[10px] text-gray-400 leading-tight mb-3">
                Describe your idea and let AI generate the post.
              </p>
            </div>
            <button
              onClick={onOpenAIGenerator}
              className="w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
            >
              Generate
            </button>
          </div>

          {/* AI Chatbot Card */}
          <div className="bg-[#141428] border border-purple-500/30 rounded-2xl p-3.5 flex flex-col justify-between hover:border-purple-500/60 transition-all group">
            <div>
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">AI Chatbot</h4>
              <p className="text-[10px] text-gray-400 leading-tight mb-3">
                Your intelligent assistant is always ready.
              </p>
            </div>
            <button
              onClick={onOpenAIChat}
              className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
            >
              Chat Now
            </button>
          </div>
        </div>
      </div>

      {/* INBUILT APPS SECTION */}
      <div>
        <div className="text-[11px] font-bold text-blue-400/90 uppercase tracking-widest px-1 mb-3 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>Inbuilt Apps</span>
        </div>

        <div className="relative bg-gradient-to-tr from-[#12122b] to-[#1d1d3d] border border-[#2b2b4d] rounded-2xl p-4 overflow-hidden group">
          <div className="relative z-10">
            <h4 className="text-xs font-bold text-white mb-1">Image Studio</h4>
            <p className="text-[11px] text-gray-300 leading-relaxed mb-3">
              Attach & view stunning AI graphics and digital art visuals.
            </p>
          </div>
          <div className="h-28 rounded-xl overflow-hidden border border-[#2d2d50] relative">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
              alt="Studio showcase"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-purple-200 bg-black/60 px-2 py-0.5 rounded-full border border-purple-500/30">
              HD Visual Studio
            </span>
          </div>
        </div>
      </div>

      {/* TRENDING TOPICS */}
      <div className="bg-[#121222] border border-[#222238] rounded-2xl p-4">
        <h4 className="text-xs font-bold text-gray-200 mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          <span>Trending Hashtags</span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onHashtagClick(tag)}
              className="text-xs font-medium text-purple-300 bg-[#1b1b30] hover:bg-purple-900/40 border border-[#282844] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* METRICS & STATS */}
      <div className="bg-[#111120] border border-[#222238] rounded-2xl p-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Trusted. Smart. Yours.
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#18182b] p-2 rounded-xl border border-[#262640]">
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-0.5">
              <Users className="w-3 h-3" />
              <span className="text-xs font-bold text-white">12K+</span>
            </div>
            <span className="text-[9px] text-gray-400">Users</span>
          </div>

          <div className="bg-[#18182b] p-2 rounded-xl border border-[#262640]">
            <div className="flex items-center justify-center gap-1 text-indigo-400 mb-0.5">
              <MessageSquareQuote className="w-3 h-3" />
              <span className="text-xs font-bold text-white">250K+</span>
            </div>
            <span className="text-[9px] text-gray-400">Posts</span>
          </div>

          <div className="bg-[#18182b] p-2 rounded-xl border border-[#262640]">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
              <Award className="w-3 h-3" />
              <span className="text-xs font-bold text-white">98%</span>
            </div>
            <span className="text-[9px] text-gray-400">Rating</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

function Wand2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z" />
      <path d="m14 7 3 3" />
      <path d="M5 6v1" />
      <path d="M19 14v1" />
      <path d="M10 2v1" />
      <path d="M7 8H6" />
      <path d="M21 10h-1" />
    </svg>
  );
}
