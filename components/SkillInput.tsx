'use client';

import { useState, type ChangeEvent } from 'react';

type SkillInputProps = {
  skills?: string[];
  onSkillsChange?: (skills: string[]) => void;
  onAddSkill?: (skill: string) => void;
};

export default function SkillInput({
  skills,
  onSkillsChange,
  onAddSkill,
}: SkillInputProps) {
  const [mode, setMode] = useState<'manual' | 'resume'>('manual');
  const [input, setInput] = useState('');
  const [internalSkills, setInternalSkills] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const currentSkills = skills ?? internalSkills;

  const addSkill = () => {
    if (!input.trim()) return;

    const nextSkills = Array.from(
      new Set([...currentSkills, input.trim()])
    );

    if (onAddSkill) {
      onAddSkill(input.trim());
    }

    if (onSkillsChange) {
      onSkillsChange(nextSkills);
    } else {
      setInternalSkills(nextSkills);
    }
    setInput('');
  };

  const removeSkill = (skill: string) => {
    const nextSkills = currentSkills.filter(s => s !== skill);
    if (onSkillsChange) {
      onSkillsChange(nextSkills);
    } else {
      setInternalSkills(nextSkills);
    }
  };

  const handleResumeUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setResumeError(null);
    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/skills/extract', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to extract skills');
      }

      const extracted = Array.isArray(data?.skills)
        ? data.skills
        : [];

      const cleaned = extracted
        .filter((s: unknown) => typeof s === 'string')
        .map((s: string) => s.trim())
        .filter(Boolean);

      const merged = Array.from(
        new Set([...currentSkills, ...cleaned])
      );

      if (onSkillsChange) {
        onSkillsChange(merged);
      } else {
        setInternalSkills(merged);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to extract skills';
      setResumeError(message);
    } finally {
      setIsExtracting(false);
    }
  };


  return (
    <div
      id="skills-input"
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          Add Your Skills
        </h3>

        {/* MODE SWITCH */}
        <div className="flex items-center gap-3">
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              {currentSkills.length > 0 ? 'Add more skills' : 'Add skills'}
            </button>
          )}
          {showForm && (
            <>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
              >
                Close
              </button>
              <div className="flex rounded-full bg-gray-100 p-1 text-xs sm:text-sm">
                <button
                  onClick={() => setMode('manual')}
                  className={`rounded-full px-4 py-1.5 transition ${
                    mode === 'manual'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Type
                </button>
                <button
                  onClick={() => setMode('resume')}
                  className={`rounded-full px-4 py-1.5 transition ${
                    mode === 'resume'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Resume
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MANUAL INPUT */}
      {showForm && mode === 'manual' && (
        <>
          <div className="mt-3 flex items-center gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="e.g. React, SQL, Python"
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button
              onClick={addSkill}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          {/* SKILL TAGS */}
          {currentSkills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {currentSkills.map(skill => (
                <span
                  key={skill}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-blue-600/70 hover:text-blue-800"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {/* RESUME UPLOAD */}
      {showForm && mode === 'resume' && (
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-gray-900">
            Upload your resume
          </p>
          <p className="mt-1 text-xs text-gray-600">
            We'll extract skills automatically
          </p>

          <label className="mt-4 inline-block cursor-pointer rounded-xl bg-blue-600 px-6 py-2.5 text-sm text-white shadow-sm transition hover:bg-blue-700">
            Choose file
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleResumeUpload}
              disabled={isExtracting}
            />
          </label>

          {isExtracting && (
            <p className="mt-3 text-xs text-gray-600">
              Extracting skills...
            </p>
          )}

          {resumeError && (
            <p className="mt-3 text-xs text-rose-600">
              {resumeError}
            </p>
          )}

          <p className="mt-3 text-xs text-gray-500">
            PDF or DOCX - Max 2MB
          </p>
        </div>
      )}
    </div>
  );
}
