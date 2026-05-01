"use client";

import { motion } from "framer-motion";

export default function JourneyPage() {
  const milestones = [
    {
      year: "2024",
      title: "BUILDING_IN_PUBLIC.EXE",
      description:
        "Started documenting my journey, sharing knowledge, and building scalable full-stack applications.",
      active: true,
    },
    {
      year: "2023",
      title: "CONSISTENT_LEARNING.BAT",
      description:
        "Built discipline, learned deeply about full-stack engineering, and started building projects.",
      active: false,
    },
    {
      year: "2022",
      title: "INIT_JOURNEY.SH",
      description: "Started my coding journey with curiosity and zero direction.",
      active: false,
    },
  ];

  return (
    <div className="space-y-6 text-brand-cyan font-vt323">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-3xl tracking-widest text-brand-cyan mb-1">
          &gt; JOURNEY_SYS.EXE
        </div>
        <div className="text-brand-cyan/50 text-sm mb-6">
          SYSTEM TIMELINE // GROWTH LOG // EVOLUTION TRACKER
        </div>
      </motion.div>

      <div className="relative border-l-2 border-brand-cyan/30 ml-4 pl-8 space-y-8">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="relative"
          >
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[37px] top-2 w-3 h-3 border-2 ${
                m.active
                  ? "bg-brand-purple border-brand-purple shadow-[0_0_10px_rgba(255,0,255,0.8)]"
                  : "bg-black border-brand-cyan/50"
              }`}
            />

            <div
              className={`border-2 p-4 bg-black/50 transition-all ${
                m.active
                  ? "border-brand-purple/50 hover:border-brand-purple"
                  : "border-brand-cyan/30 hover:border-brand-cyan/60"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl text-brand-cyan">&gt; {m.title}</span>
                <span className="text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 text-sm border border-brand-cyan/30">
                  {m.year}
                </span>
              </div>
              <p className="text-brand-cyan/60 text-sm">{m.description}</p>
            </div>
          </motion.div>
        ))}

        {/* Future Vision */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          <div className="absolute -left-[37px] top-2 w-3 h-3 border-2 bg-brand-cyan border-brand-cyan shadow-[0_0_10px_rgba(0,255,204,0.8)]" />

          <div className="border-2 border-brand-cyan/50 p-4 bg-brand-cyan/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl text-brand-cyan">&gt; FUTURE_VISION.EXE</span>
              <span className="text-brand-cyan text-sm">∞</span>
            </div>
            <p className="text-brand-cyan/60 text-sm">
              To build impact-driven products, engineer scalable systems, and
              help millions of people through technology.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
