import { JobSource } from '@/lib/jobs/jobSources';

export default function JobSourceCard({
  source,
  url,
}: {
  source: JobSource;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        bg-white
        rounded-2xl
        p-6
        shadow-sm
        hover:shadow-md
        transition
        block
      "
    >
      <h3 className="text-lg font-semibold">{source.name}</h3>
      <p className="text-sm text-gray-500 mt-2">
        Open jobs on {source.name}
      </p>
    </a>
  );
}
