import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, User, Bot, RefreshCw, Copy, Check, ChevronRight } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIChatViewProps {
  onOpenCreatePostWithIdea?: (text: string) => void;
}

export const AIChatView: React.FC<AIChatViewProps> = ({ onOpenCreatePostWithIdea }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: "Hello! I'm Wave AI, your intelligent assistant. I can answer complex tech questions, draft viral posts, or brainstorm ideas for your channel. What are we building today?",
      timestamp: 'Just now',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const messageToSend = customText || inputMessage;
    if (!messageToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: messageToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || 'Chat failed');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: "I'm having trouble connecting right now. Please check your Gemini API configuration or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Explain quantum computing in simple terms',
    'Write a viral post about AI tools for 2026',
    'How do I increase engagement in my channel?',
    'Give me 3 hashtags for a design post',
  ];

  return (
    <div className="flex-1 max-w-3xl mx-auto flex flex-col h-[calc(100vh-6rem)] bg-[#121222] border border-[#23233c] rounded-3xl overflow-hidden shadow-2xl mb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#161628] border-b border-[#23233c]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Sparkles className="w-5 h-5 text-purple-200 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Wave AI Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h2>
            <p className="text-[11px] text-gray-400">Powered by Gemini 3.6 Flash</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="text-xs text-gray-400 hover:text-white bg-[#202038] px-3 py-1.5 rounded-xl border border-[#2e2e4c] transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-indigo-900/60 text-indigo-300 border border-indigo-500/40'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-purple-300" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-3xl text-xs leading-relaxed space-y-2 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none'
                  : 'bg-[#18182d] border border-[#272744] text-gray-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              <div
                className={`text-[9px] flex items-center justify-between pt-1 ${
                  msg.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && onOpenCreatePostWithIdea && (
                  <button
                    onClick={() => onOpenCreatePostWithIdea(msg.text)}
                    className="text-[10px] font-semibold text-purple-300 hover:underline cursor-pointer"
                  >
                    Turn into Post →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-purple-300" />
            </div>
            <div className="bg-[#18182d] border border-[#272744] px-4 py-3 rounded-2xl rounded-tl-none text-xs text-purple-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Wave AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-6 py-2 bg-[#10101f] border-t border-[#202038] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-gray-400 shrink-0 uppercase tracking-wider">
          Suggested:
        </span>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] font-medium bg-[#1a1a32] hover:bg-purple-900/40 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-[#141426] border-t border-[#23233c]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Wave AI anything or brainstorm social media content..."
            className="flex-1 bg-[#1a1a30] border border-[#2d2d4c] focus:border-purple-500 text-xs text-white placeholder-gray-500 rounded-2xl px-4 py-3 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
