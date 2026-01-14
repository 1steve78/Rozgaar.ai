'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const jobs = ['AI Engineer', 'Full Stack Dev', 'Product Manager'];

export default function FeaturedJobs() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.7,
      stagger: 0.2,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        Featured Opportunities
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {jobs.map((job, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
            className="bg-white rounded-2xl p-6 shadow cursor-pointer"
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })
            }
          >
            <h3 className="text-xl font-bold">{job}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
