"use client";

export default function AuthFeatures() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1F5BFF] via-[#1F5BFF] to-[#2B6BFF] px-10 py-12 text-white lg:flex">
      <div className="absolute inset-0">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute right-10 top-14 h-36 w-36 rounded-3xl border border-white/20 bg-white/10" />
        <div className="absolute right-28 top-40 h-20 w-20 rounded-2xl border border-white/20 bg-white/10" />
        <div className="absolute bottom-16 left-16 h-16 w-16 rounded-2xl border border-white/20 bg-white/10" />
      </div>

      <div className="relative space-y-8">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-center text-xs font-bold tracking-wide">
            RZ
          </span>
          Rozgaar.ai
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold leading-tight">
            Find your dream job with Rozgaar.ai
          </h2>
          <p className="text-sm text-white/80">
            Skill-based job discovery for freshers. No noise. Only relevant, verified
            opportunities.
          </p>
        </div>

        <div className="space-y-3 text-sm text-white/90">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-white" />
            Skill-based matching
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-white" />
            Verified recent jobs
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-white" />
            Simple application flow
          </div>
        </div>
      </div>

      <div className="relative mt-8 rounded-2xl border border-white/25 bg-white/10 p-6 text-xs text-white/85 shadow-[0_16px_40px_rgba(15,23,42,0.25)]">
        Build once. Apply everywhere. Let skills do the talking.
      </div>
    </div>
  );
}
