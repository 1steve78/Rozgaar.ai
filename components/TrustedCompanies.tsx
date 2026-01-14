const companies = ['Google', 'Microsoft', 'Amazon', 'Flipkart'];

export default function TrustedCompanies() {
  return (
    <section className="bg-white rounded-3xl shadow-sm p-12 text-center">
      <h2 className="text-2xl font-bold mb-8">
        Trusted By Top Companies
      </h2>

      <div className="flex justify-center gap-12 flex-wrap text-xl font-semibold text-gray-600">
        {companies.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
    </section>
  );
}
