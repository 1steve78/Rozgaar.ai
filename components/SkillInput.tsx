"use client";

import { useState } from "react";

export default function SkillInput({
  onAddSkill,
}: {
  onAddSkill: (skill: string) => void;
}) {
  const [skill, setSkill] = useState("");

  const handleAdd = () => {
    if (!skill.trim()) return;
    onAddSkill(skill.trim());
    setSkill("");
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
      <input
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        placeholder="Add a skill (e.g. React, Python)"
        className="
          flex-1
          bg-transparent
          outline-none
          text-sm
          text-slate-900
          placeholder:text-slate-400
        "
      />

      <button
        onClick={handleAdd}
        className="
          px-4 py-2
          rounded-full
          text-sm
          bg-sky-500
          text-white
          hover:bg-sky-600
          transition
        "
      >
        Add
      </button>
    </div>
  );
}
