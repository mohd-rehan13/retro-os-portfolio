"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-heading text-5xl font-bold mb-6 text-white">About Me</h1>
        <div className="glass p-8 rounded-3xl border border-brand-border mb-12">
          <p className="text-xl text-gray-300 leading-relaxed mb-6 font-light">
            I am a full-stack engineer and digital creator focused on building scalable, aesthetic, and high-performance applications.
          </p>
          <p className="text-gray-400 leading-relaxed">
            My philosophy revolves around "Building in Public." By sharing my failures, learnings, and successes openly, I aim to not only keep myself accountable but to provide value to the broader developer community. I specialize in modern React ecosystems, specifically Next.js, alongside robust backend architectures.
          </p>
        </div>
        
        <h2 className="font-heading text-3xl font-bold mb-6 text-white">Core Technologies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "NestJS", "PostgreSQL", "Prisma", "Docker"].map((tech, i) => (
            <div key={i} className="bg-brand-dark/50 border border-brand-border/50 rounded-xl p-4 text-center hover:border-brand-cyan transition-colors">
              <span className="text-gray-300 font-medium">{tech}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
