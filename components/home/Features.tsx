import {
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
    icon: "ai",
    bgColor: "bg-blue-600",
  },
  {
    title: "Verified & Quality Jobs",
    description:
      "Every job on rozgaar.ai is curated to reduce fake, spam, and low-quality postings.",
    icon: "verified",
    bgColor: "bg-blue-600",
  },
  {
    title: "Smart Job Search",
    description:
      "Search jobs by skills, role, location, or experience using intelligent filters.",
    icon: Search,
    bgColor: "bg-blue-600",
  },
  {
    title: "Career Growth Insights",
    description:
      "Discover trending skills, in-demand roles, and long-term career growth paths.",
    icon: TrendingUp,
    bgColor: "bg-blue-600",
  },
  {
    title: "Fast Applications",
    description:
      "Apply to jobs in seconds with a clean, distraction-free experience.",
    icon: Clock,
    bgColor: "bg-blue-600",
  },
  {
    title: "Built for Freshers",
    description:
      "Special focus on students and freshers to help land the first opportunity.",
    icon: Briefcase,
    bgColor: "bg-blue-600",
  },
];

// Custom AI Icon Component
function AIIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="14"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="currentColor"
      >
        AI
      </text>
    </svg>
  );
}

// Custom Verified Icon Component
function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M8 12L11 15L16 9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Features() {
  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why choose rozgaar.ai?
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            let IconComponent;
            
            if (feature.icon === "ai") {
              IconComponent = AIIcon;
            } else if (feature.icon === "verified") {
              IconComponent = VerifiedIcon;
            } else {
              IconComponent = feature.icon as any;
            }

            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-5`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-base text-gray-600 leading-relaxed">
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