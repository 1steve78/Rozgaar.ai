'use client';

type SkillsManagerProps = {
  skills: string[];
  onAddSkill: () => void;
  onEditSkills: () => void;
};

export default function SkillsManager({
  skills,
  onAddSkill,
  onEditSkills,
}: SkillsManagerProps) {
  const isEmpty = skills.length === 0;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Your Skills</h3>

      {isEmpty ? (
        <div className="mt-4 rounded-xl border border-dashed p-6 text-center">
          <p className="text-sm text-gray-600">
            Skills help us match better jobs
          </p>

          <button
            onClick={onAddSkill}
            className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-900"
          >
            Add Skills
          </button>
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map(skill => (
              <span
                key={skill}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>

          <button
            onClick={onEditSkills}
            className="mt-4 text-sm font-medium text-gray-700 hover:underline"
          >
            Update skills
          </button>
        </>
      )}
    </div>
  );
}
