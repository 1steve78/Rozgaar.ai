export default function TrustedCompanies() {
  return (
    <section className="w-full bg-gradient-to-br from-sky-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white border border-sky-100 rounded-2xl py-10 shadow-sm text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Trusted By Top Companies
          </h3>

          <div className="flex flex-wrap justify-center gap-8 text-slate-600 font-medium">
            <span>Google</span>
            <span>Microsoft</span>
            <span>Amazon</span>
            <span>Flipkart</span>
          </div>
        </div>
      </div>
    </section>
  );
}
