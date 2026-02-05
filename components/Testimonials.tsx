export default function Testimonials() {
  return (
    <section className="grid md:grid-cols-2 gap-6 mt-20">
      
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <button className="px-6 py-2 rounded-full bg-indigo-600 text-white font-medium">
          Get Started
        </button>

        <p className="mt-6 text-gray-600">
          Rozgaar.ai helped me focus only on jobs that matched my skills.
          No distractions, no confusion.
        </p>

        <p className="mt-4 text-sm text-gray-400">— Fresher, 2025 Batch</p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h3 className="font-semibold text-lg">
          Future-ready for freshers 🚀
        </h3>

        <p className="mt-4 text-gray-600">
          Built to simplify early-career job hunting with clarity and calm UX.
        </p>

        <p className="mt-4 text-sm text-gray-400">
          Trusted by students & self-taught developers
        </p>
      </div>
    </section>
  );
}
