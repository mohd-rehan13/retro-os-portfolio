"use client";

import { motion } from "framer-motion";

export default function ProjectsPage() {
  const projects = [
    { title: "DEVFLOW_SAAS", description: "Productivity suite and workflow engine for dev teams.", status: "IN_PROGRESS", tech: ["Next.js", "NestJS", "PostgreSQL"] },
    { title: "AI_NOTES_PLATFORM", description: "Smart semantic note-taking using LLMs.", status: "PLANNED", tech: ["React", "Python", "Vector DB"] },
    { title: "PERSONAL_BRAND_V2", description: "This platform. Enterprise-grade portfolio + CMS.", status: "COMPLETED", tech: ["Next.js 15", "Tailwind v4", "Framer Motion"] },
  ];

  return (
    <div className="space-y-6 text-brand-cyan font-vt323">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-3xl tracking-widest mb-1">&gt; PROJECTS.DIR</div>
        <div className="text-brand-cyan/50 text-sm mb-6">ACTIVE BUILDS // PLANNED SYSTEMS // SHIPPED CODE</div>
      </motion.div>

      <div className="space-y-4">
        {projects.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="border-2 border-brand-cyan/30 p-4 bg-black/50 hover:border-brand-cyan transition-all">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl">&gt; {p.title}</span>
              <span className={`text-xs px-2 py-0.5 border ${p.status === "COMPLETED" ? "border-brand-cyan/50 text-brand-cyan" : p.status === "IN_PROGRESS" ? "border-brand-purple/50 text-brand-purple" : "border-brand-cyan/20 text-brand-cyan/40"}`}>{p.status}</span>
            </div>
            <p className="text-brand-cyan/50 text-sm mb-3">{p.description}</p>
            <div className="flex gap-2">
              {p.tech.map((t, j) => (
                <span key={j} className="text-xs text-brand-cyan/60 border border-brand-cyan/20 px-2 py-0.5">{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
