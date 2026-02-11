'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/home/Header';
import SkillInput from '@/components/SkillInput';
import JobMarketBulletin from '@/components/jobs/JobMarketBulletin';
import RozgaarTips from '@/components/dashboard/RozgaarTips';
import FindJobsEntryPoint from '@/components/home/FindJobEntryPoint';
import JobRecommendations from '@/components/jobs/JobRecommendations';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';

export default function DashboardPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [savingSkill, setSavingSkill] = useState(false);
  const [profile, setProfile] = useState<{ name?: string; email?: string } | null>(
    null
  );

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await fetch('/api/user/skills');
        const data = await res.json();

        const userSkills =
          (data?.skills || []).map(
            (s: any) => s.skillName ?? s.name ?? s
          ) || [];

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

  const displayName = profile?.name?.trim() || 'Rozgaar User';
  const firstName = displayName.split(' ')[0] || displayName;

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

      setSkills(prev =>
        Array.from(new Set([...prev, trimmed]))
      );
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
        <WelcomeBanner firstName={firstName} skillsCount={skills.length} />

        <JobMarketBulletin />

        <RozgaarTips />

        <div className="rounded-3xl border border-gray-100 bg-white p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">Add Your Skills</h3>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Profile booster
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className={savingSkill ? 'opacity-60 pointer-events-none' : ''}>
                <SkillInput
                  skills={skills}
                  onSkillsChange={setSkills}
                  onAddSkill={addSkill}
                />
              </div>

              {skills.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Add skills to get started</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Add your skills to get personalized job recommendations and better matches.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="mt-6 w-full rounded-xl border-2 border-blue-600 bg-white px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
              >
                Save Skills
              </button>
            </div>

            <JobRecommendations userSkills={skills} limit={3} />
          </div>
        </div>

        <FindJobsEntryPoint />
      </div>
    </div>
  );
}
