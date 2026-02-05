type Job = {
  id: string;
  title: string;
  company: string;
  location?: string;
};

export default function JobFeed({ jobs = [] }: { jobs?: Job[] }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 text-sm">
        No jobs found. Try adding more skills.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="
            bg-white
            border border-slate-200
            rounded-2xl
            p-5
            hover:border-sky-200
            transition
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {job.title}
              </h3>

              <p className="text-sm text-slate-600 mt-1">
                {job.company}
                {job.location && ` • ${job.location}`}
              </p>
            </div>

            <button
              className="
                text-sm
                px-4 py-2
                rounded-full
                border border-slate-200
                text-slate-700
                hover:bg-slate-50
                transition
              "
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
