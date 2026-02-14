'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/home/Header';
import SkillInput from '@/components/SkillInput';
import FindJobsEntryPoint from '@/components/home/FindJobEntryPoint';
import { supabase } from '@/supabase/client';

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
  const [passwordForm, setPasswordForm] = useState({
    next: '',
    confirm: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Modal states
  const [experienceModal, setExperienceModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    data: Experience | null;
  }>({ isOpen: false, mode: 'add', data: null });

  const [educationModal, setEducationModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    data: Education | null;
  }>({ isOpen: false, mode: 'add', data: null });

  const [projectModal, setProjectModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    data: Project | null;
  }>({ isOpen: false, mode: 'add', data: null });

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

  const saveEdit = async (field: keyof UserProfile) => {
    const value = tempValue;
    const previousValue = profile[field] ?? '';
    setProfile((prev) => ({ ...prev, [field]: value }));
    setEditingField(null);
    setTempValue('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (res.status === 401) {
        router.replace('/auth/login');
        return;
      }

      if (!res.ok) {
        const data = await parseJsonSafe(res);
        throw new Error(data?.error || 'Failed to save profile');
      }

      const updatedProfile = await parseJsonSafe(res);
      if (updatedProfile) {
        setProfile((prev) => ({ ...prev, ...updatedProfile }));
      }
    } catch (err) {
      console.error('Failed to save profile', err);
      setProfile((prev) => ({ ...prev, [field]: previousValue }));
    }
  };

  // Experience handlers
  const handleSaveExperience = (exp: Experience) => {
    if (experienceModal.mode === 'add') {
      setExperiences([...experiences, exp]);
    } else {
      setExperiences(experiences.map((e) => (e.id === exp.id ? exp : e)));
    }
    setExperienceModal({ isOpen: false, mode: 'add', data: null });
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  // Education handlers
  const handleSaveEducation = (edu: Education) => {
    if (educationModal.mode === 'add') {
      setEducations([...educations, edu]);
    } else {
      setEducations(educations.map((e) => (e.id === edu.id ? edu : e)));
    }
    setEducationModal({ isOpen: false, mode: 'add', data: null });
  };

  const handleDeleteEducation = (id: string) => {
    setEducations(educations.filter((e) => e.id !== id));
  };

  // Project handlers
  const handleSaveProject = (proj: Project) => {
    if (projectModal.mode === 'add') {
      setProjects([...projects, proj]);
    } else {
      setProjects(projects.map((p) => (p.id === proj.id ? proj : p)));
    }
    setProjectModal({ isOpen: false, mode: 'add', data: null });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordForm.next || passwordForm.next.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.next,
      });

      if (error) {
        setPasswordError(error.message || 'Failed to update password.');
        return;
      }

      setPasswordSuccess('Password updated successfully.');
      setPasswordForm({ next: '', confirm: '' });
    } finally {
      setPasswordLoading(false);
    }
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
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                  {initials}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{displayName}</h2>
                {profile.role && (
                  <p className="text-sm text-blue-600 font-medium mb-4">{profile.role}</p>
                )}
              </div>

              <div className="space-y-3 mt-6">
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
                  value={profile.email || 'Add email'}
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
                  value={profile.phone || 'Add phone'}
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
                  value={profile.location || 'Add location'}
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
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
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
            </div>

            {/* About Section */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About</h3>
              <div>
                {editingField === 'about' ? (
                  <div>
                    <textarea
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
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
                    className={`text-sm ${
                      profile.about ? 'text-gray-600' : 'text-gray-400'
                    } cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition`}
                    onClick={() => startEdit('about', profile.about || '')}
                  >
                    {profile.about || 'Add a brief description about yourself...'}
                  </p>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Security</h3>
                {showPasswordForm && (
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => !prev)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {showPasswords ? 'Hide' : 'Show'} passwords
                  </button>
                )}
              </div>
              <p className="mb-4 text-xs text-slate-500">
                Use a strong password you do not reuse elsewhere.
              </p>

              {!showPasswordForm ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(true);
                    setPasswordError(null);
                    setPasswordSuccess(null);
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                >
                  Change password
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="New password"
                    value={passwordForm.next}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, next: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={passwordForm.confirm}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />

                  {passwordError && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {passwordLoading ? 'Updating...' : 'Save password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordForm({ next: '', confirm: '' });
                        setPasswordError(null);
                        setPasswordSuccess(null);
                      }}
                      className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <section className="lg:col-span-2 space-y-6">
            {/* Experience */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Experience</h3>
                <button
                  onClick={() =>
                    setExperienceModal({ isOpen: true, mode: 'add', data: null })
                  }
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              {experiences.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  No experience added yet. Click "Add" to get started.
                </p>
              ) : (
                experiences.map((exp) => (
                  <div key={exp.id} className="mb-4 last:mb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                        <p className="text-sm text-blue-600">{exp.company}</p>
                        <p className="text-xs text-gray-500 mt-1">{exp.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setExperienceModal({ isOpen: true, mode: 'edit', data: exp })
                          }
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <ul className="mt-3 list-disc pl-5 text-sm text-gray-600 space-y-1">
                      {exp.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>

            {/* Education */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Education</h3>
                <button
                  onClick={() =>
                    setEducationModal({ isOpen: true, mode: 'add', data: null })
                  }
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              {educations.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  No education added yet. Click "Add" to get started.
                </p>
              ) : (
                educations.map((edu) => (
                  <div key={edu.id} className="mb-4 last:mb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-sm text-blue-600">{edu.institution}</p>
                        <p className="text-xs text-gray-500 mt-1">{edu.duration}</p>
                        <p className="text-sm text-gray-600 mt-2">{edu.details}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setEducationModal({ isOpen: true, mode: 'edit', data: edu })
                          }
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(edu.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
                <button
                  onClick={() =>
                    setProjectModal({ isOpen: true, mode: 'add', data: null })
                  }
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              {projects.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  No projects added yet. Click "Add" to get started.
                </p>
              ) : (
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
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() =>
                              setProjectModal({ isOpen: true, mode: 'edit', data: project })
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hasSkills && <FindJobsEntryPoint />}
          </section>
        </div>
      </div>

      {/* Modals */}
      {experienceModal.isOpen && (
        <ExperienceModal
          mode={experienceModal.mode}
          data={experienceModal.data}
          onSave={handleSaveExperience}
          onClose={() => setExperienceModal({ isOpen: false, mode: 'add', data: null })}
        />
      )}

      {educationModal.isOpen && (
        <EducationModal
          mode={educationModal.mode}
          data={educationModal.data}
          onSave={handleSaveEducation}
          onClose={() => setEducationModal({ isOpen: false, mode: 'add', data: null })}
        />
      )}

      {projectModal.isOpen && (
        <ProjectModal
          mode={projectModal.mode}
          data={projectModal.data}
          onSave={handleSaveProject}
          onClose={() => setProjectModal({ isOpen: false, mode: 'add', data: null })}
        />
      )}
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

// Experience Modal Component
function ExperienceModal({
  mode,
  data,
  onSave,
  onClose,
}: {
  mode: 'add' | 'edit';
  data: Experience | null;
  onSave: (exp: Experience) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Experience>(
    data || {
      id: Date.now().toString(),
      title: '',
      company: '',
      duration: '',
      description: [''],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.duration) return;
    onSave({
      ...formData,
      description: formData.description.filter((d) => d.trim() !== ''),
    });
  };

  const addDescriptionPoint = () => {
    setFormData({ ...formData, description: [...formData.description, ''] });
  };

  const updateDescriptionPoint = (index: number, value: string) => {
    const newDesc = [...formData.description];
    newDesc[index] = value;
    setFormData({ ...formData, description: newDesc });
  };

  const removeDescriptionPoint = (index: number) => {
    setFormData({
      ...formData,
      description: formData.description.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'add' ? 'Add Experience' : 'Edit Experience'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Software Engineer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., TechCorp Inc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Jan 2023 - Present"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsibilities & Achievements
            </label>
            {formData.description.map((desc, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => updateDescriptionPoint(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your responsibility or achievement"
                />
                {formData.description.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDescriptionPoint(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDescriptionPoint}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add point
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              {mode === 'add' ? 'Add Experience' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Education Modal Component
function EducationModal({
  mode,
  data,
  onSave,
  onClose,
}: {
  mode: 'add' | 'edit';
  data: Education | null;
  onSave: (edu: Education) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Education>(
    data || {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      duration: '',
      details: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.degree || !formData.institution || !formData.duration) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'add' ? 'Add Education' : 'Edit Education'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., B.Tech in Computer Science"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., University of Technology"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2020 - 2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details
            </label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              placeholder="e.g., CGPA: 8.5/10 | Coursework: Data Structures, Algorithms"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              {mode === 'add' ? 'Add Education' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Project Modal Component
function ProjectModal({
  mode,
  data,
  onSave,
  onClose,
}: {
  mode: 'add' | 'edit';
  data: Project | null;
  onSave: (proj: Project) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Project>(
    data || {
      id: Date.now().toString(),
      title: '',
      description: '',
      techStack: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.techStack) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'add' ? 'Add Project' : 'Edit Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., E-commerce Platform"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Describe what the project does and your role in it"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack *</label>
            <input
              type="text"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., React, Node.js, MongoDB"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              {mode === 'add' ? 'Add Project' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
