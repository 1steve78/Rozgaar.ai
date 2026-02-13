"use client";

import { useState } from "react";
import Header from "@/components/home/Header";

export default function SurveyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    setSubmitting(true);
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "user_survey",
          metadata: payload,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Quick Feedback</h1>
          <p className="text-sm text-slate-600 mb-6">
            Help us improve Rozgaar.ai with a short 2-minute survey.
          </p>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              Thanks for the feedback! We appreciate your time.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm font-medium text-slate-700">
                Did you find a job you applied to?
                <select
                  name="found_job"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                  required
                >
                  <option value="yes">Yes</option>
                  <option value="no">No, still looking</option>
                  <option value="not_yet">Not yet, but found interesting ones</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                How would you rate the job matches?
                <input
                  type="range"
                  name="match_quality"
                  min="1"
                  max="5"
                  defaultValue="3"
                  className="mt-2 w-full"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                What would make you use this daily?
                <textarea
                  name="daily_use"
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                  placeholder="Tell us what would keep you coming back..."
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Would you pay $5/month for unlimited access?
                <select
                  name="willingness_to_pay"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                  required
                >
                  <option value="yes">Yes</option>
                  <option value="maybe">Maybe</option>
                  <option value="no">No</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
