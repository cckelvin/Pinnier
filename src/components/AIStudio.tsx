import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Copy, Check, Send, Lightbulb, MessageSquareQuote, Layers, Tag, Feather } from 'lucide-react';
import { Post, User, Channel } from '../types';

interface AIStudioProps {
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

export const AIStudio: React.FC<AIStudioProps> = ({
  currentUser,
  channels,
  onCreatePost,
}) => {
  const [activeTool, setActiveTool] = useState<'generator' | 'enhancer' | 'ideas'>('generator');

  // Generator State
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('engaging');
  const [format, setFormat] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<{
    postContent: string;
    suggestedHashtags: string[];
    imagePrompt?: string;
    catchyTitle?: string;
  } | null>(null);

  // Enhancer State
  const [draftInput, setDraftInput] = useState('');
  const [enhanceAction, setEnhanceAction] = useState('enhance');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState('');

  // Ideas State
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isGettingIdeas, setIsGettingIdeas] = useState(false);

  const [copied, setCopied] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState(channels[0]?.id || '');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGeneratePost = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGeneratedOutput(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone, format, includeHashtags: true }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedOutput({
          postContent: data.postContent,
          suggestedHashtags: data.suggestedHashtags || [],
          imagePrompt: data.imagePrompt,
          catchyTitle: data.catchyTitle,
        });
      } else {
        setErrorMessage(data.details || data.error || 'Failed to generate post');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Network error while contacting AI API.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceDraft = async () => {
    if (!draftInput.trim()) return;
    setIsEnhancing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/ai/enhance-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftText: draftInput, action: enhanceAction }),
      });
      const data = await res.json();
      if (data.success) {
        setEnhancedResult(data.enhancedText);
      } else {
        setErrorMessage(data.details || data.error || 'Failed to enhance draft');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Network error while enhancing draft.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleFetchIdeas = async () => {
    setIsGettingIdeas(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Give me 4 viral social media post concepts for tech & AI creators in JSON list format: ["concept 1", "concept 2", "concept 3", "concept 4"]',
        }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        try {
          const match = data.reply.match(/\[[\s\S]*\]/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (Array.isArray(parsed)) setIdeas(parsed);
          } else {
            setIdeas([
              'How agentic AI models will reshape web app deployment in 2026',
              '5 UI micro-interactions that boost user retention instantly',
              'Why server-side API keys and lazy initialization are crucial for web security',
              'Quantum computing vs classical supercomputers: simplify for non-coders',
            ]);
          }
        } catch {
          setIdeas([
            'The rise of AI co-pilots in social media creation',
            'Designing dark mode UIs with high accessibility contrast',
            'Building full-stack React 19 & Express applications',
          ]);
        }
      } else {
        setErrorMessage(data.details || data.error || 'Failed to fetch ideas');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Network error while fetching ideas.');
    } finally {
      setIsGettingIdeas(false);
    }
  };

  const handlePublishGenerated = (contentToPublish: string, tags: string[]) => {
    const chosenChannel = channels.find((c) => c.id === selectedChannelId);
    onCreatePost({
      content: contentToPublish,
      hashtags: tags,
      channelId: chosenChannel?.id,
      channelName: chosenChannel?.name,
      isAiGenerated: true,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    });
    alert('Post published to Wave Social Feed!');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900/70 via-purple-900/60 to-indigo-900/70 border border-purple-500/40 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-300" />
          </div>
          <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
            Wave AI Power Suite
          </span>
        </div>
        <h2 className="text-xl font-black text-white">AI Content Generator & Polish Studio</h2>
        <p className="text-xs text-gray-300 mt-1 leading-relaxed max-w-lg">
          Powered by Gemini 3.6 Flash. Create viral social posts, refine drafts, generate hashtags, and discover content ideas instantly.
        </p>
      </div>

      {/* Tool Navigation Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-[#121222] p-1.5 rounded-2xl border border-[#23233c]">
        <button
          onClick={() => setActiveTool('generator')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTool === 'generator'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Post Generator</span>
        </button>

        <button
          onClick={() => setActiveTool('enhancer')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTool === 'enhancer'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Feather className="w-3.5 h-3.5" />
          <span>Text Enhancer</span>
        </button>

        <button
          onClick={() => setActiveTool('ideas')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTool === 'ideas'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Topic Ideas</span>
        </button>
      </div>

      {/* Tool Panel Content */}
      <div className="bg-[#121222] border border-[#23233c] rounded-3xl p-6 shadow-xl space-y-5">
        {errorMessage && (
          <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-2xl text-xs text-red-200 leading-relaxed flex items-start gap-2">
            <span className="text-base font-bold text-red-400">⚠️</span>
            <div>
              <p className="font-bold text-red-300 mb-0.5">AI Request Issue</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {activeTool === 'generator' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-200 mb-1.5">
                Describe your post topic or raw idea:
              </label>
              <textarea
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Why AI Studio + Gemini 3.6 flash makes building fullstack web applications effortless..."
                className="w-full bg-[#17172b] border border-[#2c2c48] focus:border-purple-500 text-xs text-white placeholder-gray-500 rounded-2xl p-3.5 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-[#17172b] border border-[#2c2c48] text-xs text-white rounded-xl p-2.5 outline-none"
                >
                  <option value="engaging">Engaging & Visionary</option>
                  <option value="thought_leader">Thought Leader / Tech Leader</option>
                  <option value="casual">Casual & Conversational</option>
                  <option value="viral">Viral & Punchy</option>
                  <option value="educational">Educational & Informative</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Post Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-[#17172b] border border-[#2c2c48] text-xs text-white rounded-xl p-2.5 outline-none"
                >
                  <option value="standard">Standard Post</option>
                  <option value="thread">Thread Starter</option>
                  <option value="question">Question / Discussion Starter</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGeneratePost}
              disabled={isGenerating || !topic.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini AI is generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span>Generate Post</span>
                </>
              )}
            </button>

            {/* Generated Result */}
            {generatedOutput && (
              <div className="mt-6 pt-5 border-t border-[#23233c] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Generated Wave Post
                  </span>
                  <button
                    onClick={() => handleCopy(generatedOutput.postContent)}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-[#1c1c32] px-2.5 py-1 rounded-lg"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-[#17172b] border border-[#2a2a48] p-4 rounded-2xl text-xs text-gray-100 whitespace-pre-wrap leading-relaxed">
                  {generatedOutput.postContent}
                </div>

                {generatedOutput.suggestedHashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {generatedOutput.suggestedHashtags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/25 px-2.5 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Target Channel:</span>
                    <select
                      value={selectedChannelId}
                      onChange={(e) => setSelectedChannelId(e.target.value)}
                      className="bg-[#18182b] border border-[#2d2d48] text-xs text-white rounded-lg p-1.5 outline-none"
                    >
                      {channels.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() =>
                      handlePublishGenerated(
                        generatedOutput.postContent,
                        generatedOutput.suggestedHashtags
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish to Feed</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTool === 'enhancer' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-200 mb-1.5">
                Paste your draft post to polish:
              </label>
              <textarea
                rows={4}
                value={draftInput}
                onChange={(e) => setDraftInput(e.target.value)}
                placeholder="Paste any rough thought or draft here..."
                className="w-full bg-[#17172b] border border-[#2c2c48] focus:border-purple-500 text-xs text-white placeholder-gray-500 rounded-2xl p-3.5 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold">Enhance Goal:</span>
              <div className="flex gap-2">
                {[
                  { id: 'enhance', label: 'Polish & Emojis' },
                  { id: 'thread', label: 'Convert to Thread' },
                  { id: 'summarize', label: 'Summarize Key Points' },
                  { id: 'professional', label: 'Executive Tone' },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setEnhanceAction(act.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      enhanceAction === act.id
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-[#18182b] text-gray-400 hover:text-white border border-[#282845]'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleEnhanceDraft}
              disabled={isEnhancing || !draftInput.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isEnhancing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Polishing text...</span>
                </>
              ) : (
                <>
                  <Feather className="w-4 h-4" />
                  <span>Enhance Draft</span>
                </>
              )}
            </button>

            {enhancedResult && (
              <div className="mt-4 p-4 bg-[#17172b] border border-purple-500/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">Enhanced Result</span>
                  <button
                    onClick={() => handleCopy(enhancedResult)}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-[#1c1c32] px-2.5 py-1 rounded-lg"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-xs text-gray-100 whitespace-pre-wrap leading-relaxed">
                  {enhancedResult}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTool === 'ideas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Viral Content Ideas</h3>
                <p className="text-xs text-gray-400">
                  Click any topic idea to generate a complete post.
                </p>
              </div>
              <button
                onClick={handleFetchIdeas}
                disabled={isGettingIdeas}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isGettingIdeas ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Fetch Ideas</span>
              </button>
            </div>

            {ideas.length > 0 ? (
              <div className="space-y-2.5">
                {ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setTopic(idea);
                      setActiveTool('generator');
                    }}
                    className="bg-[#17172b] border border-[#272744] hover:border-purple-500/50 p-3.5 rounded-2xl text-xs text-purple-200 flex items-center justify-between gap-3 cursor-pointer group hover:bg-[#1f1f3a] transition-all"
                  >
                    <span className="font-medium">💡 {idea}</span>
                    <span className="text-[10px] font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
                      Use Idea →
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#17172b] rounded-2xl border border-[#262642]">
                <Lightbulb className="w-8 h-8 text-purple-400/60 mx-auto mb-2" />
                <p className="text-xs text-gray-400">
                  Click "Fetch Ideas" above to let Gemini AI generate trending content topics tailored for Wave creators.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
