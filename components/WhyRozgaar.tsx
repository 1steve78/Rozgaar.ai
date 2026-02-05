const features = [
  {
    title: 'Smart Search & Match',
    desc: 'Jobs filtered by your skills, not algorithms.',
    icon: '🎯',
  },
  {
    title: 'Personalized Profile',
    desc: 'One skill list. Infinite relevant jobs.',
    icon: '👤',
  },
  {
    title: 'Easy Application Tracking',
    desc: 'Keep everything simple and focused.',
    icon: '📌',
  },
];

export default function WhyRozgaar() {
  return (
    <section className="grid md:grid-cols-3 gap-6 mt-16">
      {features.map((f) => (
        <div
          key={f.title}
          className="
            bg-white/70 backdrop-blur
            rounded-2xl p-6
            shadow-sm hover:shadow-md
          "
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-sky-100 text-xl">
            {f.icon}
          </div>

          <h3 className="mt-4 font-semibold text-lg">
            {f.title}
          </h3>

          <p className="mt-2 text-gray-600 text-sm">
            {f.desc}
          </p>
        </div>
      ))}
    </section>
  );
}
