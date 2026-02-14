"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, signup } from "@/lib/actions/auth";

export default function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (isSignup && !fullName) {
      setError("Full name is required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = isSignup
        ? await signup(email, password, fullName)
        : await login(email, password);

      if (res && "error" in res) {
        setError(res.error);
        setLoading(false);
      } else if (res && "success" in res) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
          Welcome
        </p>
        <h2 className="text-4xl font-semibold text-slate-900">
          {isSignup ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-sm text-slate-500">
          {isSignup
            ? "Start your skill-based job search in minutes."
            : "Log in to continue building your career path."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {isSignup && (
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
        )}

        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <div className="relative">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-14 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:text-slate-700 disabled:text-slate-300"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <div className="font-medium mb-1">Account created.</div>
            <div>{successMessage}</div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:translate-y-0 disabled:bg-blue-400"
        >
          {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
        </button>
      </form>

      <button
        onClick={() => {
          setIsSignup(!isSignup);
          setError(null);
          setSuccessMessage(null);
        }}
        disabled={loading}
        className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:text-blue-300"
      >
        {isSignup
          ? "Already have an account? Login"
          : "New here? Create an account"}
      </button>
    </div>
  );
}
