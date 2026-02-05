export default function HeroDashboardCard() {
  return (
    <div className="w-full">
      <div
        className="
          bg-white
          border border-sky-100
          rounded-2xl
          shadow-md
          p-6
          max-w-md
          mx-auto
        "
      >
        {/* Search bar */}
        <div className="flex items-center gap-3 bg-sky-50 rounded-full px-4 py-3 mb-6">
          <span className="text-sky-500 text-sm">🔍</span>
          <span className="text-slate-500 text-sm">
            Find your dream job...
          </span>
          <button className="ml-auto bg-sky-500 text-white text-xs px-4 py-1.5 rounded-full">
            Search
          </button>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-3">
          {[
            "Tech & IT",
            "Creative Arts",
            "Healthcare",
            "Education",
          ].map((item) => (
            <div
              key={item}
              className="
                bg-sky-50
                text-slate-700
                text-sm
                py-3
                rounded-xl
                text-center
                hover:bg-sky-100
                transition
              "
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
