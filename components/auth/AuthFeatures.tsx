'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function AuthFeatures() {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-item', {
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      });
    }, featuresRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={featuresRef}
      className="bg-gradient-to-br from-indigo-600 to-purple-600 p-12 text-white hidden md:flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex items-center gap-3 mb-8 feature-item">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-bold text-2xl">
            R
          </div>
          <span className="text-3xl font-bold">Rozgaar AI</span>
        </div>

        <h2 className="text-4xl font-bold mb-4 feature-item">
          Your Dream Career<br />Awaits You
        </h2>

        <p className="text-indigo-100 mb-10 feature-item">
          AI-powered job discovery for ambitious professionals.
        </p>

        <div className="space-y-6">
          {[
            'AI-Powered Matching',
            'Smart Application Tracking',
            'Top Companies',
            'Career Growth Tools',
          ].map((text, i) => (
            <div key={i} className="flex gap-4 feature-item">
              <span className="text-3xl">✨</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
