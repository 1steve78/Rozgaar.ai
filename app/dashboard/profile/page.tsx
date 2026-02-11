'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/home/Header';
import SkillInput from '@/components/SkillInput';
import FindJobsEntryPoint from '@/components/home/FindJobEntryPoint';

type UserProfile = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  about?: string;
  role?: string;
};

type Experience = {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string[];
};

type Education = {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  details: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string;
};

const parseJsonSafe = async (res: Response) => {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    await res.text();
    return null;
  }
  return res.json();
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile>({
    role: 'Software Engineer (Fresher)',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSkill, setSavingSkill] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const [experiences] = useState<Experience[]>([
    {
      id: '1',
      title: 'Intern Software Developer',
      company: 'TechSolutions Inc.',
      duration: 'Jun 2023 - Aug 2023',
      description: [
        'Built frontend components using React.',
        'Assisted in backend API integration with Node.js.',
      ],
    },
  ]);

  const [educations] = useState<Education[]>([
    {
      id: '1',
      degree: 'B.Tech in Computer Science',
      institution: 'University of Technology',
      duration: '2020 - 2024',
      details: 'CGPA: 8.5/10 | Coursework: Data Structures, Algorithms, DBMS',
    },
  ]);

  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'AI-Powered Job Search Platform',
      description:
        'Built a platform connecting freshers with curated job opportunities using personalized recommendations.',
      techStack: 'Python, Django, React',
    },
    {
      id: '2',
      title: 'E-commerce Website Clone',
      description:
        'Developed a full-stack e-commerce site with authentication and product catalog features.',
      techStack: 'Node.js, PostgreSQL',
    },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, skillsRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/user/skills'),
        ]);

        if (profileRes.status === 401 || skillsRes.status === 401) {
          router.replace('/auth/login');
          return;
        }

        const profileData = await parseJsonSafe(profileRes);
        const skillsData = await parseJsonSafe(skillsRes);

        const userSkills =
          (skillsData?.skills || []).map(
            (s: any) => s.skillName ?? s.name ?? s
          ) || [];

        setProfile((prev) => ({ ...prev, ...profileData }));
        setSkills(userSkills);
      } catch (err) {
        console.error('Profile load failed', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const hasSkills = skills.length > 0;
  const displayName = profile?.name?.trim() || 'Rozgaar User';
  const initials = useMemo(() => {
    const parts = displayName.split(' ').filter(Boolean);
    const first = parts[0]?.[0] ?? 'R';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return `${first}${last}`.toUpperCase();
  }, [displayName]);

  const addSkill = async (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;

    setSavingSkill(true);
    try {
      const res = await fetch('/api/user/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillName: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to add skill');
      }

      setSkills((prev) => Array.from(new Set([...prev, trimmed])));
    } catch (err) {
      console.error('Failed to add skill', err);
    } finally {
      setSavingSkill(false);
    }
  };

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const saveEdit = (field: keyof UserProfile) => {
    setProfile((prev) => ({ ...prev, [field]: tempValue }));
    setEditingField(null);
    setTempValue('');
    // TODO: Save to API
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[340px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Profile Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                    {initials}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>

                {editingField === 'name' ? (
                  <div className="mt-4 w-full">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveEdit('name')}
                        className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 group/name cursor-pointer" onClick={() => startEdit('name', displayName)}>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 justify-center">
                      {displayName}
                      <svg
                        className="w-4 h-4 text-gray-400 opacity-0 group-hover/name:opacity-100 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </h2>
                  </div>
                )}

                {editingField === 'role' ? (
                  <div className="mt-2 w-full">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full px-3 py-1.5 border border-blue-300 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveEdit('role')}
                        className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p
                    className="mt-2 text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-700"
                    onClick={() => startEdit('role', profile.role || '')}
                  >
                    {profile.role || 'Add your role'}
                  </p>
                )}
              </div>

              <div className="mt-8 space-y-4 text-sm">
                <EditableField
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  label="Email"
                  value={profile.email || 'Add your email'}
                  field="email"
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  onTempChange={setTempValue}
                />

                <EditableField
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  }
                  label="Phone"
                  value={profile.phone || 'Add your phone'}
                  field="phone"
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  onTempChange={setTempValue}
                />

                <EditableField
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  }
                  label="Location"
                  value={profile.location || 'Add your location'}
                  field="location"
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  onTempChange={setTempValue}
                />

                <EditableField
                  icon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  }
                  label="LinkedIn"
                  value={profile.linkedin || 'Add LinkedIn'}
                  field="linkedin"
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  onTempChange={setTempValue}
                />
              </div>

              <div className="mt-8">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  About Me
                </h3>
                {editingField === 'about' ? (
                  <div className="mt-3">
                    <textarea
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveEdit('about')}
                        className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p
                    className="mt-3 text-sm leading-relaxed text-gray-600 cursor-pointer hover:text-gray-800 transition"
                    onClick={() =>
                      startEdit(
                        'about',
                        profile.about ||
                          'Share a short summary about your goals, strengths, and the kind of roles you are targeting.'
                      )
                    }
                  >
                    {profile.about ||
                      'Share a short summary about your goals, strengths, and the kind of roles you are targeting. This helps recruiters understand your profile quickly.'}
                  </p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="space-y-6">
            {/* Experience */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Experience</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              {experiences.map((exp) => (
                <div key={exp.id} className="mb-4 last:mb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                      <p className="text-sm text-blue-600">{exp.company}</p>
                      <p className="text-xs text-gray-500 mt-1">{exp.duration}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                  <ul className="mt-3 list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Education</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              {educations.map((edu) => (
                <div key={edu.id} className="mb-4 last:mb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-sm text-blue-600">{edu.institution}</p>
                      <p className="text-xs text-gray-500 mt-1">{edu.duration}</p>
                      <p className="text-sm text-gray-600 mt-2">{edu.details}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Skills</h3>
              <div className={savingSkill ? 'opacity-60 pointer-events-none' : ''}>
                <SkillInput skills={skills} onSkillsChange={setSkills} onAddSkill={addSkill} />
              </div>
            </div>

            {/* Projects */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Projects</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                        <p className="text-xs text-blue-600 mt-2 font-medium">
                          Tech Stack: {project.techStack}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 ml-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {hasSkills && <FindJobsEntryPoint />}
          </section>
        </div>
      </div>
    </div>
  );
}

function EditableField({
  icon,
  label,
  value,
  field,
  editingField,
  tempValue,
  onStartEdit,
  onSave,
  onCancel,
  onTempChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  field: string;
  editingField: string | null;
  tempValue: string;
  onStartEdit: (field: string, value: string) => void;
  onSave: (field: any) => void;
  onCancel: () => void;
  onTempChange: (value: string) => void;
}) {
  const isPlaceholder = value.startsWith('Add');

  if (editingField === field) {
    return (
      <div>
        <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
          {icon}
          <span>{label}</span>
        </div>
        <input
          type="text"
          value={tempValue}
          onChange={(e) => onTempChange(e.target.value)}
          className="w-full px-3 py-1.5 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onSave(field)}
            className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
      onClick={() => onStartEdit(field, isPlaceholder ? '' : value)}
    >
      <div className="flex items-center gap-3">
        <div className="text-blue-600">{icon}</div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className={`text-sm font-medium ${isPlaceholder ? 'text-gray-400' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
      </div>
      <svg
        className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    </div>
  );
}