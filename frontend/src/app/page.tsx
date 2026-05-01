"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Folder, Terminal, Target, Route, LayoutDashboard, Mail } from "lucide-react";

export default function Home() {
  const icons = [
    { name: "BLOG_LOGS.SYS", path: "/blog", icon: <Folder size={40} className="text-brand-cyan mb-2" /> },
    { name: "GOALS_EXE", path: "/goals", icon: <Target size={40} className="text-brand-cyan mb-2" /> },
    { name: "JOURNEY_SYS.EXE", path: "/journey", icon: <Route size={40} className="text-brand-cyan mb-2" /> },
    { name: "ADMIN_CTRL.EXE", path: "/admin", icon: <LayoutDashboard size={40} className="text-brand-cyan mb-2" /> },
    { name: "COMMS_UPLINK.EXE", path: "/contact", icon: <Mail size={40} className="text-brand-cyan mb-2" /> },
  ];

  return (
    <div className="w-full h-full relative p-8">
      {/* Welcome Message / ASCII Art Placeholder */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 right-8 text-right pointer-events-none"
      >
        <div className="text-brand-cyan/20 font-vt323 text-8xl font-bold leading-none select-none">
          REHAN<br />OS_v1.0
        </div>
      </motion.div>

      {/* Desktop Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-8 max-w-4xl">
        {icons.map((item, i) => (
          <Link key={i} href={item.path}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center justify-center p-4 hover:bg-brand-cyan/20 border border-transparent hover:border-brand-cyan/50 cursor-pointer transition-colors text-center group"
            >
              {item.icon}
              <span className="font-vt323 text-white group-hover:text-brand-cyan bg-black/50 px-1">
                {item.name}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
