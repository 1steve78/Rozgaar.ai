"use client";

import { useState } from "react";
import SkillInput from "@/components/SkillInput";
import JobFeed from "@/components/jobs/JobFeed";

type JobFeedJob = {
  id: string;
  title: string;
  company: string;
  location?: string;
};

type SkillsJobSectionProps = {
  jobs?: JobFeedJob[];
};

export default function SkillsJobSection({ jobs }: SkillsJobSectionProps) {
  const [skills, setSkills] = useState<string[]>([]);

  return (
    <>
      <SkillInput skills={skills} onSkillsChange={setSkills} />
      {skills.length > 0 && (
        <p className="mt-3 text-xs text-slate-500">
          Skills: {skills.join(", ")}
        </p>
      )}
      <div className="mt-6">
        <JobFeed jobs={jobs} />
      </div>
    </>
  );
}
