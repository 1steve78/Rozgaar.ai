export default function AboutPage() {
  return (
    <main className="w-full bg-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-slate-900">
          About <span className="text-sky-500">rozgaar.ai</span>
        </h1>

        <p className="mt-6 text-lg text-slate-600 leading-relaxed">
          rozgaar.ai is built to simplify job discovery for freshers and early
          professionals. We believe finding the right opportunity should be
          clear, skill-focused, and free from unnecessary noise.
        </p>

        {/* Mission */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-slate-900">
            Our Mission
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Our mission is to help candidates discover relevant job opportunities
            based on their skills and interests, not endless scrolling or
            misleading listings. We focus on clarity, trust, and growth.
          </p>
        </section>

        {/* What we do */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900">
            What We Do
          </h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>• Skill-based job matching powered by intelligent systems</li>
            <li>• Curated and verified job opportunities</li>
            <li>• Simple, distraction-free job discovery</li>
            <li>• Strong focus on freshers and early-career talent</li>
          </ul>
        </section>

        {/* Philosophy */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900">
            Our Philosophy
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            We value simplicity over complexity and usefulness over hype.
            rozgaar.ai is designed to stay minimal, transparent, and user-first,
            so candidates can focus on what truly matters: building their
            careers.
          </p>
        </section>

        {/* Closing */}
        <section className="mt-16 border-t border-slate-100 pt-8">
          <p className="text-slate-500 text-sm">
            We’re building rozgaar.ai step by step, with the goal of becoming a
            trusted career companion for millions of job seekers.
          </p>
        </section>
      </div>
    </main>
  );
}
