"use client";

export default function ErrorBoundary({ error }: { error: Error }) {
  if (error.message.includes("limit reached")) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
        <h3 className="text-lg font-semibold mb-2">Daily Limit Reached</h3>
        <p className="text-sm mb-4">{error.message}</p>
        <button
          onClick={() => {
            window.location.href = "/pricing";
          }}
          className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Upgrade for Unlimited Access
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
      Something went wrong. Please try again.
    </div>
  );
}
