"use client";
import React from "react";
import { motion } from "framer-motion";

export default function EspektroBrochure() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] p-6">
      {/* Outer Frame */}
      <div className="relative max-w-6xl w-full bg-[#efe3c2] rounded-2xl shadow-2xl border-[10px] border-[#7c5a34]">
        {/* Decorative inner border */}
        <div className="border-[6px] border-[#c9a46a] rounded-xl m-2 p-6 bg-[#f4e9cd]">

          {/* Header */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#2c2c2c] text-[#e7c98a] px-8 py-2 rounded-full text-3xl font-serif tracking-wide shadow-lg">
              Espektro
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="border-[6px] border-[#7c5a34] rounded-lg overflow-hidden shadow-xl bg-black"
            >
              {/* Replace the src with your actual event image */}
              <img
                src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=1600&auto=format&fit=crop"
                alt="Festival crowd"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Text Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-between bg-[#f7edd4] border-[4px] border-[#c9a46a] rounded-lg p-6 shadow-inner"
            >
              <div className="space-y-4 text-[#3b2b1a] font-serif leading-relaxed">
                <p>
                  <span className="font-bold text-xl">Espektro</span> is the annual cultural and technical spectacle hosted by <span className="font-semibold">Kalyani Government Engineering College</span>.
                </p>
                <p>
                  As West Bengal’s second-largest fest, Espektro masterfully intertwines the realms of technology and creativity, setting the stage for a multifaceted celebration.
                </p>
                <p>
                  Over the course of several days, attendees are treated to a dynamic experience.
                </p>
                <p className="font-semibold">
                  Espektro – Where culture meets technology in a festival of innovation and creativity!
                </p>
              </div>

              {/* Button */}
              <div className="mt-6 flex justify-center">
                <button className="bg-[#7c3f1d] hover:bg-[#5e2f14] text-[#f4e9cd] px-6 py-3 rounded-full shadow-lg tracking-widest text-sm">
                  EVENT BROCHURE
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#7c5a34] rounded-tl-md" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#7c5a34] rounded-tr-md" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#7c5a34] rounded-bl-md" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#7c5a34] rounded-br-md" />
      </div>
    </div>
  );
}
