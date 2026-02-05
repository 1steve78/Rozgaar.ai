type Skill = {
  id: string
  name: string
}

type Props = {
  skills: Skill[]
  onSelect: (skillId: string) => void
}

export function SkillSelector({ skills, onSelect }: Props) {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="border rounded px-3 py-2 w-full"
    >
      <option value="">Select a skill</option>
      {skills.map((skill) => (
        <option key={skill.id} value={skill.id}>
          {skill.name}
        </option>
      ))}
    </select>
  )
}
