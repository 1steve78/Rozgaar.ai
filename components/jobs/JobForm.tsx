"use client"

import { useState } from "react"

export function JobForm({ onCreate }: { onCreate: (data: any) => void }) {
  const [title, setTitle] = useState("")

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <h3 className="font-semibold">Post Job</h3>

      <input
        placeholder="Job title"
        className="border px-3 py-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button
        onClick={() => onCreate({ title })}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create Job
      </button>
    </div>
  )
}
