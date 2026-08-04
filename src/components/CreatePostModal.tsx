import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Send, Tag, Layers, RefreshCw, Wand2 } from 'lucide-react';
import { Channel, User } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  channels: Channel[];
  onCreatePost: (newPostData: {
    content: string;
    imageUrl?: string;
    hashtags: string[];
    channelId?: string;
    channelName?: string;
    isAiGenerated?: boolean;
  }) => void;
}

const presetImages = [
  { label: 'AI Cyber Ring', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Neon Cyberpunk', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Quantum Sphere', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Futuristic Grid', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Synthwave Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  channels,
  onCreatePost,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'write' | 'ai'>('ai');
  const [content, setContent] = useState('');
  const [hashtagsText, setHashtagsText] = useState('AI, Gemini, FutureTech');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState(channels[0]?.id || '');
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  // AI Generator Form State
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('tech');
  const [aiFormat, setAiFormat] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleGenerateWithAi = async () => {
    if (!aiTopic.trim()) {
      setAiError('Please enter a topic or concept for AI generation.');
      return;
    }
    setAiError('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          tone: aiTone,
          format: aiFormat,
          includeHashtags: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setContent(data.postContent || '');
        if (data.suggestedHashtags && Array.isArray(data.suggestedHashtags)) {
          setHashtagsText(data.suggestedHashtags.join(', '));
        }
        setIsAiGenerated(true);
        setActiveTab('write'); // Switch to editor tab to preview and fine-tune
      } else {
        setAiError(data.error || 'Failed to generate post');
      }
    } catch (err: any) {
      setAiError(err?.message || 'Network error while calling Gemini AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const hashtags = hashtagsText
      .split(',')
      .map((tag) => tag.trim().replace(/^#/, ''))
      .filter(Boolean);

    const chosenChannel = channels.find((c) => c.id === selectedChannelId);

    onCreatePost({
      content: content.trim(),
      imageUrl: customImageUrl || selectedImageUrl || undefined,
      hashtags,
      channelId: chosenChannel?.id,
      channelName: chosenChannel?.name,
      isAiGenerated,
    });

    // Reset & close
    setContent('');
    setAiTopic('');
    setSelectedImageUrl('');
    setCustomImageUrl('');
    setIsAiGenerated(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121222] border border-[#272744] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23233c] bg-[#161628]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-300">
              <Wand2 className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-base font-bold text-white">Create Wave Post</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-[#23233c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#23233c] bg-[#0f0f1c]">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
              activeTab === 'ai'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Post Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
              activeTab === 'write'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>Write & Edit</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'ai' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  What would you like to post about?
                </label>
                <textarea
                  rows={3}
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Gemini 3.6 flash models launching agentic features, or future of UI design..."
                  className="w-full bg-[#17172b] border border-[#2c2c48] focus:border-purple-500 text-xs text-white placeholder-gray-500 rounded-2xl p-3.5 outline-none transition-all"
                />
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  '🚀 AI Agent Workflows',
                  '🎨 Cyberpunk UI Aesthetics',
                  '⚡ Quantum Computing Update',
                  '💡 Startup & Product Hacks',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setAiTopic(chip.substring(3))}
                    className="text-[11px] bg-[#1d1d36] hover:bg-purple-900/40 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                    Tone
                  </label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full bg-[#17172b] border border-[#2c2c48] text-xs text-gray-200 rounded-xl p-2.5 outline-none"
                  >
                    <option value="tech">Tech / Thought Leader</option>
                    <option value="engaging">Engaging & Creative</option>
                    <option value="casual">Casual & Fun</option>
                    <option value="viral">Viral / High Energy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                    Format Style
                  </label>
                  <select
                    value={aiFormat}
                    onChange={(e) => setAiFormat(e.target.value)}
                    className="w-full bg-[#17172b] border border-[#2c2c48] text-xs text-gray-200 rounded-xl p-2.5 outline-none"
                  >
                    <option value="standard">Standard Post</option>
                    <option value="thread">Thread Starter</option>
                    <option value="question">Question & Discussion</option>
                  </select>
                </div>
              </div>

              {aiError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                  {aiError}
                </p>
              )}

              <button
                type="button"
                onClick={handleGenerateWithAi}
                disabled={isGenerating}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI is crafting post...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Post Content</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Post Content
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening in your digital world?"
                  className="w-full bg-[#17172b] border border-[#2c2c48] focus:border-purple-500 text-xs text-white placeholder-gray-500 rounded-2xl p-3.5 outline-none transition-all"
                />
              </div>

              {/* Hashtags Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-purple-400" />
                  <span>Hashtags (comma separated)</span>
                </label>
                <input
                  type="text"
                  value={hashtagsText}
                  onChange={(e) => setHashtagsText(e.target.value)}
                  placeholder="AI, Gemini, WaveSocial, Tech"
                  className="w-full bg-[#17172b] border border-[#2c2c48] focus:border-purple-500 text-xs text-white placeholder-gray-500 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Publish to Channel</span>
                </label>
                <select
                  value={selectedChannelId}
                  onChange={(e) => setSelectedChannelId(e.target.value)}
                  className="w-full bg-[#17172b] border border-[#2c2c48] text-xs text-gray-200 rounded-xl p-2.5 outline-none"
                >
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.name} ({ch.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Media Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>Attach Image Graphic</span>
                </label>

                {/* Presets */}
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {presetImages.map((img) => (
                    <div
                      key={img.label}
                      onClick={() => {
                        setSelectedImageUrl(img.url);
                        setCustomImageUrl('');
                      }}
                      className={`relative rounded-xl overflow-hidden h-14 border-2 cursor-pointer transition-all ${
                        selectedImageUrl === img.url
                          ? 'border-purple-500 ring-2 ring-purple-500/40 scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => {
                    setCustomImageUrl(e.target.value);
                    setSelectedImageUrl('');
                  }}
                  placeholder="Or paste custom image URL..."
                  className="w-full bg-[#17172b] border border-[#2c2c48] focus:border-purple-500 text-xs text-white placeholder-gray-500 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[#23233c] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#23233c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Post</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
