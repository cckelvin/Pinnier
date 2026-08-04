import React, { useState } from 'react';
import { Compass, Search, Users, Cpu, Sparkles, Palette, Music, TrendingUp, Coins, Check, Plus, MessageSquare } from 'lucide-react';
import { Channel } from '../types';

interface ExploreChannelsProps {
  channels: Channel[];
  onToggleJoinChannel: (channelId: string) => void;
  onSelectChannel: (channelName: string) => void;
}

export const ExploreChannels: React.FC<ExploreChannelsProps> = ({
  channels,
  onToggleJoinChannel,
  onSelectChannel,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredChannels = channels.filter((ch) => {
    if (selectedCategory !== 'All' && ch.category !== selectedCategory) return false;
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      return ch.name.toLowerCase().includes(q) || ch.description.toLowerCase().includes(q);
    }
    return true;
  });

  const iconMap: Record<string, any> = {
    Cpu,
    Sparkles,
    Palette,
    Music,
    TrendingUp,
    Coins,
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto space-y-6 pb-16">
      {/* Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-violet-900/60 via-purple-900/50 to-indigo-900/60 border border-purple-500/30 p-6 overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-md space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover Communities</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Explore Topic Channels</h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Join vibrant discussions around AI models, design systems, tech breakthroughs, synthwave music, and startup growth.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search channels by topic or keyword..."
            className="w-full bg-[#141426] border border-[#272742] focus:border-purple-500 text-xs text-white placeholder-gray-500 rounded-2xl pl-10 pr-4 py-2.5 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Tech', 'AI', 'Design', 'Music', 'Business', 'Crypto'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-[#151528] text-gray-400 hover:text-white border border-[#25253e]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredChannels.map((channel) => {
          const IconComp = iconMap[channel.iconName] || Sparkles;

          return (
            <div
              key={channel.id}
              className="bg-[#121222] border border-[#23233c] hover:border-purple-500/40 rounded-3xl overflow-hidden shadow-lg transition-all flex flex-col group"
            >
              {/* Banner Header */}
              <div className="h-24 relative overflow-hidden bg-[#0c0c16]">
                <img
                  src={channel.bannerUrl}
                  alt={channel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121222] via-transparent to-black/30" />
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-purple-200 border border-purple-500/30 backdrop-blur-md">
                  {channel.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 -mt-6 relative z-10">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#1a1a30] border-2 border-[#121222] flex items-center justify-center text-purple-400 shadow-lg">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <button
                      onClick={() => onToggleJoinChannel(channel.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        channel.isJoined
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                          : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30'
                      }`}
                    >
                      {channel.isJoined ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Joined</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Join Channel</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3
                    onClick={() => onSelectChannel(channel.name)}
                    className="text-sm font-bold text-white hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    {channel.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between pt-2 border-t border-[#202035] text-[11px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>{(channel.memberCount / 1000).toFixed(1)}K members</span>
                  </div>

                  <button
                    onClick={() => onSelectChannel(channel.name)}
                    className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Feed</span>
                    <MessageSquare className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
