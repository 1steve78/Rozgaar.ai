"use client";

import { useRouter } from "next/navigation";
import HeroDashboardCard from "./HeroDashboardCard";
import { getCurrentUser} from "@/lib/actions/auth"; 

export default function HeroSection() {
  const router = useRouter();

  const handleGetStarted = async () => {
    const user = await getCurrentUser();

    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">
            Find Your Dream Job <br />
            with <span className="text-sky-500">rozgaar.ai</span>
          </h1>

          <p className="mt-5 text-slate-600 max-w-md">
            Skill-based job discovery for freshers. No noise. Only relevant,
            verified opportunities.
          </p>

          <button
            onClick={handleGetStarted}
            className="mt-8 bg-sky-500 text-white px-6 py-3 rounded-full hover:bg-sky-600 transition"
          >
            Get Started
          </button>
        </div>

        {/* Right */}
        <HeroDashboardCard />
      </div>
    </section>
  );
}
