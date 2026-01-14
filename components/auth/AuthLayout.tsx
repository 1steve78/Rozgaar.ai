'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import AuthFeatures from './AuthFeatures';
import AuthForm from './AuthForm';

export default function AuthLayout() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.auth-panel', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4"
    >
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="auth-panel">
            <AuthFeatures />
          </div>
          <div className="auth-panel">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
