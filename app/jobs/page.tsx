import Header from '@/components/home/Header';
import JobsPage from '@/components/jobs/JobsPage';

export default function JobsRoutePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <JobsPage />
    </div>
  );
}
