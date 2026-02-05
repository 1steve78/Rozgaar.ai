const categories = [
  'Tech & IT',
  'Design',
  'Healthcare',
  'Education',
];

export default function SkillCategories() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12">
      {categories.map((cat) => (
        <div
          key={cat}
          className="rounded-2xl bg-white shadow-sm hover:shadow-md transition p-6 text-center font-medium text-gray-700"
        >
          {cat}
        </div>
      ))}
    </section>
  );
}
