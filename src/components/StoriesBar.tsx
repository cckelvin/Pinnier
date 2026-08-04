import React from 'react';
import { Plus, Cpu, Sparkles, Palette, Music, TrendingUp, Gamepad2, Coins, Globe } from 'lucide-react';

interface StoriesBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onOpenCreateModal: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  onOpenCreateModal,
}) => {
  const categories = [
    { id: 'All', label: 'All', icon: Globe },
    { id: 'Tech', label: 'Tech', icon: Cpu },
    { id: 'AI', label: 'AI', icon: Sparkles },
    { id: 'Design', label: 'Design', icon: Palette },
    { id: 'Music', label: 'Music', icon: Music },
    { id: 'Business', label: 'Business', icon: TrendingUp },
    { id: 'Gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'Crypto', label: 'Crypto', icon: Coins },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-3 min-w-max px-1">
        {/* (+) Create Story Bubble */}
        <button
          onClick={onOpenCreateModal}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 border-2 border-dashed border-purple-500/60 hover:border-purple-400 flex items-center justify-center transition-all group-hover:scale-105">
            <Plus className="w-5 h-5 text-purple-300 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-[11px] font-semibold text-purple-300 group-hover:text-white transition-colors">
            Create
          </span>
        </button>

        {/* Category Topic Bubbles */}
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all group-hover:scale-105 ${
                  isSelected
                    ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 border-purple-400 shadow-lg shadow-purple-600/30 text-white'
                    : 'bg-[#151526] border-[#292942] text-purple-300/80 hover:border-purple-500/50 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`text-[11px] font-medium transition-colors ${
                  isSelected ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-200'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
