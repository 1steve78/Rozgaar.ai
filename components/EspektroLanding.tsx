'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EspektroLanding = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax transformations
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [500, 1000], [0, 100]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.from('.hero-title', {
        duration: 1.2,
        opacity: 0,
        y: 50,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.section-card', {
        scrollTrigger: {
          trigger: '.section-card',
          start: 'top center+=100',
          toggleActions: 'play none none reverse',
        },
        duration: 1,
        opacity: 0,
        y: 80,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, #e8d5b7 0%, #d4a574 25%, #c9965f 50%, #d4a574 75%, #e8d5b7 100%),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(139, 90, 43, 0.03) 2px,
            rgba(139, 90, 43, 0.03) 4px
          )
        `,
      }}
    >
      {/* Custom elegant cursor */}
      <motion.div
        className="fixed w-6 h-6 pointer-events-none z-50 opacity-70"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        style={{
          borderRadius: '50%',
          border: '2px solid #5c4033',
          boxShadow: 'inset 0 0 4px rgba(92, 64, 51, 0.4)',
        }}
      />

      {/* ==================== HERO SECTION - ESPEKTRO ==================== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Decorative corner ornaments - Top Left */}
        <div className="absolute top-8 left-8 w-20 h-20 opacity-30">
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-900"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-900"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-900"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-900"></div>
          </div>
        </div>

        {/* Decorative corner ornaments - Top Right */}
        <div className="absolute top-8 right-8 w-20 h-20 opacity-30">
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-900"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-900"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-900"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-900"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-5xl w-full">
          {/* MAIN ORNATE FRAME */}
          <div className="relative">
            {/* Outer decorative border */}
            <div
              className="relative p-8 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #f5e6d3 0%, #e8dcc9 50%, #f5e6d3 100%)',
                border: '3px solid #5c4033',
                boxShadow:
                  'inset 0 0 30px rgba(92, 64, 51, 0.2), 0 10px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Decorative border pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(90deg, transparent, transparent 20px, #5c4033 20px, #5c4033 22px),
                      repeating-linear-gradient(0deg, transparent, transparent 20px, #5c4033 20px, #5c4033 22px)
                    `,
                  }}
                ></div>
              </div>

              {/* Corner ornaments - Inner */}
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-amber-800 rounded-full opacity-60"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-800 rounded-full opacity-60"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-amber-800 rounded-full opacity-60"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-800 rounded-full opacity-60"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Title banner */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <div
                    className="inline-block px-16 py-4 mb-8"
                    style={{
                      background: '#3d2817',
                      border: '2px solid #8b5a2b',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <h1
                      className="hero-title font-serif text-6xl tracking-[0.3em] font-bold"
                      style={{
                        color: '#e8dcc9',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        letterSpacing: '0.15em',
                      }}
                    >
                      ESPEKTRO
                    </h1>
                  </div>
                </motion.div>

                {/* Two column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left column - Image with ornate frame */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="section-card relative"
                  >
                    {/* Ornate frame for image */}
                    <div
                      className="p-4 relative"
                      style={{
                        background: 'linear-gradient(135deg, #c9a574 0%, #8b5a2b 100%)',
                        border: '4px solid #5c4033',
                        boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.3), 0 5px 20px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {/* Corner decorations */}
                      <div className="absolute top-2 left-2 w-4 h-4 bg-amber-800 rounded-full"></div>
                      <div className="absolute top-2 right-2 w-4 h-4 bg-amber-800 rounded-full"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 bg-amber-800 rounded-full"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 bg-amber-800 rounded-full"></div>

                      {/* Image */}
                      <img
                        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop"
                        alt="Espektro Festival"
                        className="w-full h-80 object-cover"
                        style={{
                          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)',
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Right column - Text description */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="space-y-6 text-right"
                  >
                    <p
                      className="text-base font-serif leading-relaxed"
                      style={{
                        color: '#3d2817',
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                      }}
                    >
                      <span className="font-bold text-lg">Espektro</span> is the annual cultural
                      and technical spectacle hosted by <span className="font-bold">Kalyani Government Engineering College</span>.
                      <br />
                      <br />
                      As West Bengal's second-largest fest, Espektro masterfully intertwines the
                      realms of technology and creativity, setting the stage for a multifaceted
                      celebration. Over the course of several days, attendees are treated to a
                      dynamic experience.
                    </p>

                    <p
                      className="text-sm italic font-serif"
                      style={{ color: '#5c4033' }}
                    >
                      "Espektro – Where culture meets technology in a festival of innovation and
                      creativity!"
                    </p>

                    {/* Event Brochure Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mx-auto block px-8 py-3 font-serif font-bold tracking-wider"
                      style={{
                        background: '#8b3a1f',
                        color: '#f5e6d3',
                        border: '2px solid #5c4033',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      EVENT BROCHURE
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TECHFIX SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div style={{ y: y1 }} className="w-full">
          <div className="max-w-5xl mx-auto">
            <div
              className="relative p-8 shadow-2xl section-card"
              style={{
                background: 'linear-gradient(135deg, #f5e6d3 0%, #e8dcc9 50%, #f5e6d3 100%)',
                border: '3px solid #5c4033',
              }}
            >
              {/* Title */}
              <div className="text-center mb-12">
                <h2
                  className="font-serif text-5xl font-bold tracking-wide mb-2"
                  style={{ color: '#3d2817' }}
                >
                  TECHFIX
                </h2>
                <p className="font-serif italic" style={{ color: '#5c4033' }}>
                  तेकाफिक्स
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left text */}
                <div className="space-y-6">
                  <p
                    className="font-serif leading-relaxed"
                    style={{
                      color: '#3d2817',
                      fontSize: '1.05rem',
                      lineHeight: '1.8',
                    }}
                  >
                    <span className="font-bold">Techfix</span> serves as the technical cornerstone of Espektro,
                    immersing participants in a diverse variety of activities throughout the day. Organized
                    by the college's technical clubs, this segment showcases a spectrum of compelling games
                    and interactive challenges.
                  </p>

                  <p style={{ color: '#5c4033' }} className="font-serif">
                    Participants are afforded the opportunity to test their skills, engage in friendly
                    competition, and immerse themselves in hands-on experiences.
                  </p>

                  <p style={{ color: '#5c4033' }} className="font-serif">
                    Innovative workshops to competitive events, Techfix is designed to captivate and
                    challenge attendees, fostering a spirit of ingenuity and collaboration.
                  </p>
                </div>

                {/* Right image */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: false }}
                >
                  <div
                    className="p-4 relative"
                    style={{
                      background: 'linear-gradient(135deg, #c9a574 0%, #8b5a2b 100%)',
                      border: '4px solid #5c4033',
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop"
                      alt="Techfix"
                      className="w-full h-80 object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================== EXOTICA SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div style={{ y: y2 }} className="w-full">
          <div className="max-w-5xl mx-auto">
            <div
              className="relative p-8 shadow-2xl section-card"
              style={{
                background: 'linear-gradient(135deg, #f5e6d3 0%, #e8dcc9 50%, #f5e6d3 100%)',
                border: '3px solid #5c4033',
              }}
            >
              {/* Title */}
              <div className="text-center mb-12">
                <h2
                  className="font-serif text-5xl font-bold tracking-wide mb-2"
                  style={{ color: '#3d2817' }}
                >
                  EXOTICA
                </h2>
                <p className="font-serif italic" style={{ color: '#5c4033' }}>
                  Cultural Heartbeat
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left image */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: false }}
                >
                  <div
                    className="p-4 relative"
                    style={{
                      background: 'linear-gradient(135deg, #c9a574 0%, #8b5a2b 100%)',
                      border: '4px solid #5c4033',
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=400&fit=crop"
                      alt="Exotica"
                      className="w-full h-80 object-cover"
                    />
                  </div>
                </motion.div>

                {/* Right text */}
                <div className="space-y-6">
                  <p
                    className="font-serif leading-relaxed"
                    style={{
                      color: '#3d2817',
                      fontSize: '1.05rem',
                      lineHeight: '1.8',
                    }}
                  >
                    <span className="font-bold">Exotica</span> stands as the cultural heartbeat of Espektro,
                    showcasing a rich tapestry of talents from KGEC's student body. This segment immerses
                    attendees in a captivating ambiance of music and dance.
                  </p>

                  <p style={{ color: '#5c4033' }} className="font-serif">
                    Following the student performances, Exotica ascends to new heights with the renowned
                    artists from across India gracing the stage. Their emotive and masterful performances
                    resonate deeply.
                  </p>

                  <p style={{ color: '#5c4033' }} className="font-serif">
                    Through Exotica, Espektro celebrates KGEC's cultural heritage and becomes a platform
                    where local talent harmoniously blends with national luminaries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================== QUIXINE SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full">
          <div className="max-w-5xl mx-auto">
            <div
              className="relative p-8 shadow-2xl section-card"
              style={{
                background: 'linear-gradient(135deg, #f5e6d3 0%, #e8dcc9 50%, #f5e6d3 100%)',
                border: '3px solid #5c4033',
              }}
            >
              {/* Title */}
              <div className="text-center mb-12">
                <h2
                  className="font-serif text-5xl font-bold tracking-wide mb-2"
                  style={{ color: '#3d2817' }}
                >
                  QUIXINE
                </h2>
                <p className="font-serif italic" style={{ color: '#5c4033' }}>
                  Gastronomic Haven
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left text */}
                <div className="space-y-6">
                  <p
                    className="font-serif leading-relaxed"
                    style={{
                      color: '#3d2817',
                      fontSize: '1.05rem',
                      lineHeight: '1.8',
                    }}
                  >
                    <span className="font-bold">QuiXine</span> awaits, promising a gastronomic haven that
                    will ignite your senses and elevate your culinary experience. Prepare to embark on a
                    journey through a myriad of flavors and culinary marvels.
                  </p>

                  <p style={{ color: '#5c4033' }} className="font-serif">
                    Where every bite tells a story and every dish is a masterpiece in its own right. Immerse
                    yourself in a world of excitement as QuiXine hosts exhilarating culinary contests.
                  </p>

                  <p style={{ color: '#5c4033' }} className="font-serif">
                    Whether you're a seasoned chef or an aspiring home cook, there's something for everyone
                    to savor and enjoy. Join us at QuiXine and discover the true essence of culinary artistry.
                  </p>
                </div>

                {/* Right image */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: false }}
                >
                  <div
                    className="p-4 relative"
                    style={{
                      background: 'linear-gradient(135deg, #c9a574 0%, #8b5a2b 100%)',
                      border: '4px solid #5c4033',
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=400&fit=crop"
                      alt="QuiXine"
                      className="w-full h-80 object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer
        className="relative py-20 px-4 text-center"
        style={{
          background: '#3d2817',
          borderTop: '3px solid #5c4033',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
          >
            <h3
              className="font-serif text-5xl font-bold mb-6 tracking-wider"
              style={{ color: '#e8dcc9' }}
            >
              ESPEKTRO 2026
            </h3>
            <p className="font-serif text-lg mb-8" style={{ color: '#c9a574' }}>
              Where culture meets technology in a festival of innovation and creativity
            </p>
            <div className="flex justify-center gap-6 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 font-serif font-bold"
                style={{
                  background: '#e8dcc9',
                  color: '#3d2817',
                  border: '2px solid #e8dcc9',
                }}
              >
                REGISTER NOW
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 font-serif font-bold"
                style={{
                  background: 'transparent',
                  color: '#e8dcc9',
                  border: '2px solid #e8dcc9',
                }}
              >
                LEARN MORE
              </motion.button>
            </div>
            <p className="text-sm opacity-70 font-serif" style={{ color: '#c9a574' }}>
              © 2026 Espektro | Kalyani Government Engineering College
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default EspektroLanding;