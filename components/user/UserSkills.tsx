"use client"

import { useState } from "react"
import { SkillSelector } from "../skills/SkillSelector"

type Skill = { id: string; name: string }

export function UserSkills({
  allSkills,
  onAdd,
}: {
  allSkills: Skill[]
  onAdd: (skillId: string, proficiency: number) => void
}) {
  const [skillId, setSkillId] = useState("")
  const [level, setLevel] = useState(3)

  return (
    <div className="space-y-3 border p-4 rounded-xl">
      <h3 className="font-semibold">Add Skill</h3>

      <SkillSelector skills={allSkills} onSelect={setSkillId} />

      <input
        type="range"
        min={1}
        max={5}
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
      />

      <button
        onClick={() => onAdd(skillId, level)}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Add Skill
      </button>
    </div>
  )
}
