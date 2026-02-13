'use client';

import { useState } from 'react';

export default function RozgaarAbout() {
  const [isDark, setIsDark] = useState(false);
  const themeLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  const features = [
    {
      icon: '🧠',
      title: 'AI Matching',
      description: 'Skill-based job matching powered by intelligent, bias-free systems.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '✓',
      title: 'Verified Listings',
      description: 'Curated and verified opportunities from trusted employers only.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: '✨',
      title: 'Distraction-Free',
      description: 'A clean, minimal interface designed for pure focus on your career.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📈',
      title: 'Early Career',
      description: 'Strong focus on freshers and high-potential early-career talent.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20 transition-colors duration-500">
        
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          aria-label={themeLabel}
          title={themeLabel}
          className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg hover:shadow-xl border border-slate-200/50 dark:border-slate-700/50 transition-all hover:scale-110 group"
        >
          <div className="relative w-6 h-6">
            <span className={`absolute inset-0 transition-all duration-500 ${isDark ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
              🌙
            </span>
            <span className={`absolute inset-0 transition-all duration-500 ${isDark ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}>
              ☀️
            </span>
          </div>
        </button>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <header className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto text-center relative">
            <div className="inline-block mb-6 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-full text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-wide border border-blue-200/50 dark:border-blue-800/50">
              Discover Your Next Opportunity
            </div>
            <h1 className="font-bold text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent leading-tight">
              About <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">rozgaar.ai</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
              Built to simplify job discovery for freshers and early professionals. We believe finding the right opportunity should be <span className="text-blue-600 dark:text-blue-400 font-semibold">clear, skill-focused, and free from noise</span>.
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 space-y-32 pb-32 relative">
          
          {/* Mission Section */}
          <section className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <div className="relative bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-10 md:p-16 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-6 tracking-wide uppercase text-sm bg-blue-50/80 dark:bg-blue-900/30 px-4 py-2 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                    <span className="text-xl">🚀</span>
                    Our Mission
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                    Bridging the gap between <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">talent and opportunity</span>
                  </h2>
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    Our mission is to help candidates discover relevant job opportunities based on their skills and interests, not endless scrolling or misleading listings. We focus on <span className="font-semibold text-slate-800 dark:text-slate-200">clarity, trust, and growth</span>.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="relative w-full max-w-md aspect-square">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-purple-500/10 to-cyan-500/20 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-700"></div>
                    <div className="relative bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl flex items-center justify-center border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm h-full">
                      <span className="text-9xl filter drop-shadow-lg">🎯</span>
                      <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500 border-4 border-white dark:border-slate-800">
                        <span className="text-5xl">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What We Do Section */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">What We Do</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400">Transforming job search with AI-first principles</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Philosophy Section */}
          <section className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold mb-6 tracking-wide uppercase text-sm bg-pink-50/80 dark:bg-pink-900/30 px-4 py-2 rounded-full border border-pink-200/50 dark:border-pink-800/50">
                <span className="text-xl">💙</span>
                Our Philosophy
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                Simplicity over complexity.<br />
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Usefulness over hype.</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start p-5 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-3xl">🎨</div>
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    rozgaar.ai is designed to stay <span className="font-semibold text-slate-800 dark:text-slate-200">minimal, transparent, and user-first</span>, so candidates can focus on what truly matters: building their careers.
                  </p>
                </div>
                <div className="flex gap-4 items-start p-5 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-3xl">💪</div>
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    We don&apos;t believe in vanity metrics or keyword stuffing. We believe in the <span className="font-semibold text-slate-800 dark:text-slate-200">power of true potential and direct connections</span>.
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl group-hover:blur-2xl transition-all duration-700"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 dark:border-slate-700/50 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-500">
                  <img
                    alt="Team collaboration"
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3LIOE_CWnuSviDz9Op_tDj_blllS1bI1YRuq-AufHIA36m8q0glWDGY2d93EWpaduiWybqsnukj6P1JxLfblBfhh2_x94vPsLp5zlNDFTA9AnsKYDQFgXw7-5fpjxSSSPS-Vi3i5e3cc-z07a795NnpKwXuNs1jHMx-JzF9hs2LA0yYA3aH3BrKOaFyHjP4OtXYFOjcya0S372aiKwHGP5vtTEr6yvOeF7fHln52_rBO8Bb_sX6ME_t2S9EScAqFRhxiJP8X8BA"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 max-w-xs hidden sm:block transform hover:scale-105 transition-transform duration-300">
                  <p className="italic text-slate-700 dark:text-slate-300 font-medium text-lg">
                    &ldquo;Minimalism is the ultimate sophistication in tech.&rdquo;
                  </p>
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">— Our Core Belief</div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center pt-12">
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-blue-950 dark:via-slate-900 dark:to-blue-950 rounded-[3rem] p-16 overflow-hidden shadow-2xl border border-slate-800/50">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="inline-block mb-6 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-300 font-semibold text-sm tracking-wide border border-white/20">
                  Join Our Journey
                </div>
                <h2 className="text-5xl font-bold text-white mb-6">Our Goal</h2>
                <p className="text-slate-300 text-xl mb-10 leading-relaxed">
                  We&apos;re building rozgaar.ai step by step, with the goal of becoming a <span className="text-white font-semibold">trusted career companion for millions of job seekers</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-5 px-12 rounded-2xl transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-3">
                    Join Us 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold py-5 px-12 rounded-2xl transition-all border border-white/20 hover:border-white/30 hover:scale-105">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/50 dark:border-slate-800/50 py-16 backdrop-blur-xl bg-white/30 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="font-bold text-3xl bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
                rozgaar<span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">.ai</span>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                © 2024 Rozgaar.ai. All rights reserved.
              </div>
              <div className="flex gap-6">
                <a className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium" href="#">Privacy</a>
                <a className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium" href="#">Terms</a>
                <a className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium" href="#">Twitter</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
