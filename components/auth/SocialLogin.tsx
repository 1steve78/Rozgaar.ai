"use client";

import { supabase } from "@/supabase/client";

export default function SocialLogin() {
  const signInWithProvider = async (provider: "google" | "linkedin_oidc") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => signInWithProvider("google")}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
      >
        <span className="flex items-center justify-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[13px] font-bold text-slate-700 shadow-inner ring-1 ring-slate-200">
            G
          </span>
          Continue with Google
        </span>
      </button>

      <button
        onClick={() => signInWithProvider("linkedin_oidc")}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
      >
        <span className="flex items-center justify-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0A66C2] text-[12px] font-bold text-white shadow-inner">
            in
          </span>
          Continue with LinkedIn
        </span>
      </button>
    </div>
  );
}
