"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeroIllustration from "./HeroIllustration";

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleGetStarted = () => {
    router.push("/auth");
  };

  return (
    <section className="w-full bg-gray-50 relative overflow-hidden">
      {/* Blue Diagonal Background */}
      <div 
        className="absolute top-0 right-0 h-full bg-blue-600"
        style={{
          width: '55%',
          clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Find Your Dream Job <br />
              with rozgaar.ai
            </h1>

            <p className="text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed">
              Skill-based job discovery for freshers. No noise. Only relevant,
              verified opportunities.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl mt-8">
              <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="pl-5 pr-3">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Find your dream job..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-4 px-2 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-4 font-semibold hover:bg-blue-700 transition-colors m-1 rounded-full"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Get Started Button */}
            <div className="pt-4">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden lg:block">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}