import {
  Sparkles,
  ShieldCheck,
  Search,
  TrendingUp,
  Clock,
  Briefcase,
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Job Matching",
    description:
      "Our intelligent system understands your skills and recommends jobs that actually fit you.",
    icon: Sparkles,
  },
  {
    title: "Verified & Quality Jobs",
    description:
      "Every job on rozgaar.ai is curated to reduce fake, spam, and low-quality postings.",
    icon: ShieldCheck,
  },
  {
    title: "Smart Job Search",
    description:
      "Search jobs by skills, role, location, or experience using intelligent filters.",
    icon: Search,
  },
  {
    title: "Career Growth Insights",
    description:
      "Discover trending skills, in-demand roles, and long-term career growth paths.",
    icon: TrendingUp,
  },
  {
    title: "Fast Applications",
    description:
      "Apply to jobs in seconds with a clean, distraction-free experience.",
    icon: Clock,
  },
  {
    title: "Built for Freshers",
    description:
      "Special focus on students and freshers to help land the first opportunity.",
    icon: Briefcase,
  },
];

export default function Features() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-slate-900">
            Why choose <span className="text-sky-500">rozgaar.ai</span>?
          </h2>
          <p className="mt-4 text-slate-600">
            Built to simplify job search, reduce noise, and help you grow your
            career with clarity and confidence.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white border border-sky-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-lg bg-sky-100 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-sky-500" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
