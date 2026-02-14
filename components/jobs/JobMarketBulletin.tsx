"use client";

import { useEffect, useState } from "react";
import type { JobMarketItem, TrendType } from "../../types/jobMarket";

const mockData: JobMarketItem[] = [
  {
    id: 1,
    type: "TRENDING_ROLE",
    title: "AI Engineer",
    description: "Hiring trending this week",
    trend: "up",
    updatedAt: "2 min ago",
  },
  {
    id: 2,
    type: "SKILL",
    title: "React + TypeScript",
    description: "Frequently requested in new listings",
    trend: "up",
    updatedAt: "5 min ago",
  },
  {
    id: 3,
    type: "SLOWDOWN",
    title: "Manual QA",
    description: "Hiring slowed across startups",
    trend: "down",
    updatedAt: "10 min ago",
  },
];

const trendColor: Record<TrendType, string> = {
  up: "text-green-600",
  down: "text-red-500",
  neutral: "text-gray-500",
};

const trendSymbol: Record<TrendType, string> = {
  up: "^",
  down: "v",
  neutral: "o",
};

const JobMarketBulletin = () => {
  const [items, setItems] = useState<JobMarketItem[]>(mockData);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/job-market-bulletin")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) {
          return;
        }
        setItems(data);
      })
      .catch(() => {
        // Keep mock data on error
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full overflow-hidden mb-6">
      <div className="ticker">
        <div className="ticker__track">
          {[...items, ...items].map((item, index) => (
            <div key={`${item.id}-${index}`} className="ticker__item">
              <span className="font-medium text-slate-900">{item.title}</span>
              <span
                className={`text-xs font-semibold ${trendColor[item.trend]}`}
              >
                {trendSymbol[item.trend]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .ticker {
          width: 100%;
          overflow: hidden;
        }
        .ticker__track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: scroll 28s linear infinite;
        }
        .ticker:hover .ticker__track {
          animation-play-state: paused;
        }
        .ticker__item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.9);
          white-space: nowrap;
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
        }
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker__track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default JobMarketBulletin;
