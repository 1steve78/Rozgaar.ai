import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import Features from "@/components/home/Features";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="w-full">
        <HeroSection />
        <Features />
      </main>
    </div>
  );
}