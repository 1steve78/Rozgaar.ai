'use client';

export default function AuthFeatures() {
  return (
    <div className="hidden md:flex flex-col justify-between bg-sky-100 p-12">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">🌸</span>
          <span className="text-2xl font-bold">Rozgaar.ai</span>
        </div>

        <h2 className="text-4xl font-bold mb-4">
          Find Your Dream Job <br /> & Let It Bloom
        </h2>

        <p className="text-gray-700 mb-10">
          Skill-based job discovery for freshers.
        </p>

        <ul className="space-y-5">
          <li className="flex gap-3">✨ Skill-based matching</li>
          <li className="flex gap-3">✨ Verified recent jobs</li>
          <li className="flex gap-3">✨ Simple application flow</li>
        </ul>
      </div>
    </div>
  );
}
