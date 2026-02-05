"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login, signup } from "@/lib/actions/auth"

export default function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    if (isSignup && !fullName) {
      setError("Full name is required")
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = isSignup
        ? await signup(email, password, fullName)
        : await login(email, password)

      // Handle different response types
      if (res && 'error' in res) {
        setError(res.error)
        setLoading(false)
      } else if (res && 'success' in res) {
        // Success! Redirect to dashboard
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      // Error handling - no logging in production
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-6">
        {isSignup ? "Create account" : "Welcome back"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <input
            className="w-full border rounded-lg p-3"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
        )}

        <input
          className="w-full border rounded-lg p-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          className="w-full border rounded-lg p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            <div className="font-medium mb-1">✅ Account created!</div>
            <div>{successMessage}</div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white rounded-lg p-3 font-medium transition-colors"
        >
          {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
        </button>
      </form>

      <button
        onClick={() => {
          setIsSignup(!isSignup)
          setError(null)
          setSuccessMessage(null)
        }}
        disabled={loading}
        className="mt-4 text-sm text-sky-700 hover:text-sky-800 disabled:text-sky-400"
      >
        {isSignup
          ? "Already have an account? Login"
          : "New here? Create an account"}
      </button>
    </div>
  )
}