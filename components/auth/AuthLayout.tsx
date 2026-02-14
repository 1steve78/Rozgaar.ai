'use client';

import AuthFeatures from './AuthFeatures';
import AuthForm from './AuthForm';
import SocialLogin from './SocialLogin';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f7fb] px-4 py-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_40px_120px_rgba(15,23,42,0.15)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-12 lg:p-14">
            <AuthForm />

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Or
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mt-6">
              <SocialLogin />
            </div>
          </div>

          <AuthFeatures />
        </div>
      </div>
    </div>
  );
}
