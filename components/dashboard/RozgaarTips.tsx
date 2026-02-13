"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';

export default function DailyTipsBox() {
  const [tips, setTips] = useState<string[]>([]);
  const [displayText, setDisplayText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('job');
  const [fullName, setFullName] = useState('User');
  const [cards, setCards] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'erasing'>(
    'typing'
  );
  const [charIndex, setCharIndex] = useState(0);
  const [greetingShown, setGreetingShown] = useState(false);

  // Fetch tips from backend (Groq)
  const fetchNewTip = async (nextCategory?: string) => {
    setIsLoading(true);
    setDisplayText('');
    
    try {
      const selectedCategory = nextCategory ?? category;
      const response = await fetch(
        `/api/rozgaar-tips?category=${encodeURIComponent(selectedCategory)}`
      );
      const data = await response.json();
      const tipList =
        Array.isArray(data?.tips) && data.tips.length > 0
          ? data.tips.slice(0, 3)
          : ['Stay curious and keep learning!'];
      
      setTips(tipList);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tip:', error);
      setTips(['Keep pushing forward - every small step counts toward your goals!']);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!isMounted || !user) return;

      const fallback =
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        'User';

      setFullName(fallback);

      const { data } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (data?.full_name) {
        setFullName(data.full_name);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const greeting = `Hello ${fullName}, welcome back.`;
    const nextCards = greetingShown ? tips : [greeting, ...tips];
    setCards(nextCards);
    if (currentIndex >= nextCards.length) {
      setCurrentIndex(0);
    }
  }, [tips, fullName, greetingShown, currentIndex]);

  const getTimings = (text: string) => {
    const minHold = 1200;
    const totalTarget = 10000;
    const remaining = Math.max(1000, totalTarget - minHold);
    const typingPortion = Math.floor(remaining * 0.6);
    const erasingPortion = remaining - typingPortion;
    const length = Math.max(1, text.length);

    const typingInterval = Math.max(12, Math.floor(typingPortion / length));
    const erasingInterval = Math.max(10, Math.floor(erasingPortion / length));
    const holdMs =
      totalTarget - length * (typingInterval + erasingInterval);

    return {
      typingInterval,
      erasingInterval,
      holdMs: Math.max(minHold, holdMs),
    };
  };

  useEffect(() => {
    if (cards.length === 0 || isLoading) return;

    const text = cards[currentIndex] ?? '';
    const { typingInterval, erasingInterval, holdMs } = getTimings(text);
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (phase === 'typing') {
      if (charIndex < text.length) {
        timeout = setTimeout(() => {
          setDisplayText(text.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingInterval);
      } else {
        setPhase('holding');
      }
    } else if (phase === 'holding') {
      timeout = setTimeout(() => {
        setPhase('erasing');
      }, holdMs);
    } else if (phase === 'erasing') {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayText(text.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, erasingInterval);
      } else {
        setPhase('typing');
        setDisplayText('');

        if (!greetingShown && currentIndex === 0) {
          setGreetingShown(true);
          setCurrentIndex(0);
        } else {
          setCurrentIndex((prev) =>
            cards.length === 0 ? 0 : (prev + 1) % cards.length
          );
        }
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [
    cards,
    currentIndex,
    phase,
    charIndex,
    isLoading,
    greetingShown,
  ]);

  // Initial load
  useEffect(() => {
    fetchNewTip();
  }, []);

  // Auto-refresh every 3 days
  useEffect(() => {
    const interval = setInterval(() => {
      setCategory((prev) => {
        const next = prev === 'job' ? 'skill' : 'job';
        fetchNewTip(next);
        return next;
      });
    }, 1000 * 60 * 60 * 24 * 3);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="w-full">
        {isLoading ? (
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 p-6 md:p-8 shadow-lg">
            <div className="flex items-center justify-center py-10">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="transition-all duration-700">
            <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div className="text-xs font-bold text-blue-100 uppercase tracking-wide">
                  Rozgaar Tips
                </div>
              </div>
              <div className="mt-2 text-xl md:text-2xl font-semibold text-white min-h-[72px] leading-relaxed">
                {displayText}
                {phase !== 'holding' && (
                  <span className="inline-block w-1 h-6 bg-white ml-2 animate-blink align-middle"></span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        
        .animate-blink {
          animation: blink 0.7s infinite;
        }
      `}</style>
    </div>
  );
}