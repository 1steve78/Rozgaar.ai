'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Search } from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-item', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="bg-white rounded-3xl shadow-xl p-12 mb-16"
    >
      <h1 className="hero-item text-5xl font-bold text-gray-900 mb-4">
        Your Career Starts Here.
      </h1>

      <p className="hero-item text-gray-600 text-lg mb-8">
        Discover AI-powered job matches tailored for you.
      </p>

      <div className="hero-item flex items-center bg-gray-50 rounded-xl border-2 border-gray-200">
        <Search className="ml-4 text-gray-400" />
        <input
          className="flex-1 px-4 py-4 bg-transparent outline-none"
          placeholder="Search jobs..."
        />
        <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg m-1">
          Search
        </button>
      </div>
    </section>
  );
}
