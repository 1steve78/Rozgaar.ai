'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/home/Header';
import SkillInput from '@/components/SkillInput';
import JobMarketBulletin from '@/components/jobs/JobMarketBulletin';
import RozgaarTips from '@/components/dashboard/RozgaarTips';
import FindJobsEntryPoint from '@/components/home/FindJobEntryPoint';
import JobRecommendations from '@/components/jobs/JobRecommendations';

export default function DashboardPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [savingSkill, setSavingSkill] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [profile, setProfile] = useState<{ name?: string; email?: string } | null>(null);
  const [usage, setUsage] = useState<{ chatCount: number; fetchCount: number; limits: { chat: number; fetch: number } } | null>(null);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await fetch('/api/user/skills');
        const data = await res.json();

        const userSkills =
          (data?.skills || []).map((s: any) => s.skillName ?? s.name ?? s) || [];

        setSkills(userSkills);
      } catch (err) {
        console.error('Failed to load skills', err);
      } finally {
        setLoadingSkills(false);
      }
    };

    loadSkills();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) return;
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const loadUsage = async () => {
      try {
        const res = await fetch('/api/user/usage');
        if (!res.ok) return;
        const data = await res.json();
        setUsage(data);
      } catch (err) {
        console.error('Failed to load usage stats', err);
      }
    };

    loadUsage();
  }, []);

  const displayName = profile?.name?.trim() || 'Rozgaar User';
  const firstName = displayName.split(' ')[0] || displayName;
  const visibleSkills = showAllSkills ? skills : skills.slice(0, 15);

  useEffect(() => {
    if (skills.length <= 15 && showAllSkills) {
      setShowAllSkills(false);
    }
  }, [skills.length, showAllSkills]);

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

  if (loadingSkills) {
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
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-6 lg:space-y-8">
        <JobMarketBulletin />

        <RozgaarTips />

        {usage && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Daily Limits</h3>
                <p className="text-sm text-slate-600">Free tier usage for today</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                Resets every 24 hours
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <p className="text-xs font-semibold uppercase text-blue-700">Chat Messages</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {usage.chatCount}/{usage.limits.chat}
                </p>
                <p className="text-xs text-slate-600 mt-1">AI mentor conversations</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <p className="text-xs font-semibold uppercase text-emerald-700">Job Fetches</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {usage.fetchCount}/{usage.limits.fetch}
                </p>
                <p className="text-xs text-slate-600 mt-1">Fresh job searches</p>
              </div>
            </div>
          </div>
        )}

        {/* Skills & Recommendations Section */}
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Skills Card */}
          <div className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add Your Skills</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {skills.length > 0
                    ? `You have ${skills.length} skill${skills.length > 1 ? 's' : ''} added`
                    : 'Start by adding your skills to get job recommendations'}
                </p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">
                Profile booster
              </span>
            </div>

            {/* Skill Input */}
            <div className={savingSkill ? 'opacity-60 pointer-events-none' : ''}>
              <SkillInput skills={skills} onSkillsChange={setSkills} onAddSkill={addSkill} />
            </div>

            {/* Empty State Warning */}
            {skills.length === 0 && (
              <div className="mt-6 p-5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-yellow-900">Add skills to get started</p>
                    <p className="text-sm text-yellow-800 mt-1">
                      Add your skills to unlock personalized job recommendations and better matches.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Display */}
            {skills.length > 0 && (
              <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-blue-900">
                    Your Skills ({skills.length})
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAllSkills(true)}
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Manage all
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {visibleSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-sm font-medium text-blue-700 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length > 15 && (
                    <button
                      type="button"
                      onClick={() => setShowAllSkills((prev) => !prev)}
                      className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                    >
                      {showAllSkills ? 'Show less' : `+${skills.length - 15} more`}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Success Message - Blue Theme */}
            {skills.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      Great! {skills.length} skill{skills.length > 1 ? 's' : ''} added
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      Keep adding more to improve your job matches and get better recommendations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Job Recommendations Card - Same Height */}
          <div className="flex flex-col h-full">
            <JobRecommendations userSkills={skills} limit={3} />
          </div>
        </div>

        <FindJobsEntryPoint />
      </div>
    </div>
  );
}
