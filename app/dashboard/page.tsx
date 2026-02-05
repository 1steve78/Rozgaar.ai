import Header from '@/components/home/Header';
import SkillInput from '@/components/SkillInput';
import JobFeed from '@/components/jobs/JobFeed';
import HeroDashboardCard from '@/components/home/HeroDashboardCard';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-24">
      <Header />

      {/* HERO CARD */}
      <HeroDashboardCard />

      {/* SKILLS + JOB FEED */}
      <section className="mt-14">
        <SkillInput />
        <JobFeed />
      </section>
    </div>
  );
}
