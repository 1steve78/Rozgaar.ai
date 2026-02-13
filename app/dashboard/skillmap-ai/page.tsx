'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/home/Header';
import { supabase } from '@/supabase/client';

interface Recommendation {
  type: string;
  title: string;
  url: string;
  description: string;
  platform?: string;
  duration?: string;
  difficulty?: string;
}

interface SkillItem {
  id?: string;
  skillName?: string;
  level?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: Recommendation[];
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I've analyzed the current job market trends. Tell me about your career goals or upload your resume to get a personalized learning path.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!isMounted) return;
      if (error || !data.user) {
        setUserId(null);
        return;
      }
      setUserId(data.user.id);
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const sendMessage = async (overrideMessage?: string) => {
    const trimmed = (overrideMessage ?? input).trim();
    if (!trimmed) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userId ? { message: trimmed, userId } : { message: trimmed }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.error
            ? `API error: ${data.error}`
            : `API error: ${response.status} ${response.statusText}`
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'I could not understand that. Please try again.',
          recommendations: data.recommendations,
        },
      ]);
    } catch {
      setApiError('Chat API call failed. Check console and network for details.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { badge: 'Spark', label: 'Analyze my resume' },
    { badge: 'Trend', label: 'Market trends for UI/UX' },
    { badge: 'Tips', label: 'Interview prep tips' },
    { badge: 'Tools', label: 'Recommended tools' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Header />

      <main className="relative flex-1 overflow-y-auto pb-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 left-1/4 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-indigo-200/25 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {messages.length === 1 && (
            <section className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                Ready to bridge your skill gap?
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg">
                Upload your resume or tell me about your dream job to get a personalized learning path.
              </p>
            </section>
          )}

          <section className="mx-auto max-w-5xl space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.role === 'assistant' ? (
                  <div className="flex gap-3 items-start animate-in fade-in duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      AI
                    </div>
                    <div className="flex-1 rounded-2xl border border-blue-100 bg-white/90 backdrop-blur-sm p-5 shadow-sm">
                      <span className="text-xs font-semibold text-slate-500 uppercase">
                        Skill Guide Assistant
                      </span>
                      <div className="mt-2 text-slate-800 leading-relaxed">
                        {renderMessageContent(msg.content)}
                      </div>

                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {msg.recommendations.map((rec, i) => (
                            <div
                              key={i}
                              className={`rounded-xl border-2 p-5 transition-all hover:shadow-lg hover:scale-[1.01] ${
                                rec.type === 'course'
                                  ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-white'
                                  : rec.type === 'youtube'
                                    ? 'border-red-300 bg-gradient-to-br from-red-50 to-white'
                                    : rec.type === 'book'
                                      ? 'border-green-300 bg-gradient-to-br from-green-50 to-white'
                                      : 'border-blue-300 bg-gradient-to-br from-blue-50 to-white'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <span
                                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                                    rec.type === 'course'
                                      ? 'bg-purple-200 text-purple-800'
                                      : rec.type === 'youtube'
                                        ? 'bg-red-200 text-red-800'
                                        : rec.type === 'book'
                                          ? 'bg-green-200 text-green-800'
                                          : 'bg-blue-200 text-blue-800'
                                  }`}
                                >
                                  {rec.type}
                                </span>
                                {rec.duration && (
                                  <span className="text-xs text-slate-600 flex items-center gap-1">
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    {rec.duration}
                                  </span>
                                )}
                                {rec.difficulty && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${
                                      rec.difficulty === 'Hard'
                                        ? 'bg-red-100 text-red-700'
                                        : rec.difficulty === 'Medium'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-green-100 text-green-700'
                                    }`}
                                  >
                                    Level: {rec.difficulty}
                                  </span>
                                )}
                              </div>

                              <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{rec.title}</h3>

                              {rec.platform && (
                                <p className="text-xs text-slate-600 mb-3">Platform: {rec.platform}</p>
                              )}

                              <p className="text-sm text-slate-700 mb-4 line-clamp-2">{rec.description}</p>

                              <a
                                href={rec.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-lg font-medium transition-colors"
                              >
                                Start Learning
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end animate-in fade-in duration-200">
                    <div className="max-w-2xl w-full md:w-auto">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase">You</span>
                      </div>
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl px-5 py-3 shadow-md">
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  AI
                </div>
                <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/85 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-10px_30px_rgba(15,23,42,0.08)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(action.label)}
                className="px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <span>{action.badge}</span>
                {action.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <button className="p-3 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me your career goals or upload your resume..."
              className="flex-1 px-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400"
              disabled={loading}
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>

          <p className="text-xs text-center text-slate-500 mt-3">
            Skill Guide AI can make mistakes. Consider checking important info.
          </p>
          {apiError && (
            <p className="text-xs text-center text-red-600 mt-2">{apiError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function renderMessageContent(content: string) {
  const normalized = content
    .replace(/\s*\*\*(Phase\s+\d+:[^*]+)\*\*/gi, '\n**$1**\n')
    .replace(/(\d+\.\s)/g, '\n$1')
    .replace(/(\*\s)/g, '\n$1')
    .replace(/(\-\s)/g, '\n$1')
    .trim();

  const lines = normalized.split('\n').map((line) => line.trim()).filter(Boolean);
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, '').trim());
        i += 1;
      }
      blocks.push(
        <ol key={`ol-${i}`} className="mt-3 space-y-2 list-decimal pl-6 text-sm text-slate-800">
          {items.map((item, idx) => (
            <li key={idx}>{renderInlineBold(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (/^(\*|-)\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^(\*|-)\s/.test(lines[i])) {
        items.push(lines[i].replace(/^(\*|-)\s/, '').trim());
        i += 1;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="mt-3 space-y-2 list-disc pl-6 text-sm text-slate-800">
          {items.map((item, idx) => (
            <li key={idx}>{renderInlineBold(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    blocks.push(
      <p key={`p-${i}`} className="text-sm text-slate-800">
        {renderInlineBold(line)}
      </p>
    );
    i += 1;
  }

  return <div className="space-y-3">{blocks}</div>;
}

function renderInlineBold(text: string) {
  const parts = text.split('**');
  if (parts.length === 1) {
    return text;
  }

  return (
    <>
      {parts.map((part, idx) =>
        idx % 2 === 1 ? (
          <strong key={idx} className="font-semibold text-slate-900">
            {part}
          </strong>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
}
