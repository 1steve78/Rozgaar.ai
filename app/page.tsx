import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import Features from "@/components/home/Features";
import TrustedCompanies from "@/components/home/TrustedCompanies";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="w-full">
        <HeroSection />
        <Features />
        <TrustedCompanies />
      </main>
    </>
  );
}
