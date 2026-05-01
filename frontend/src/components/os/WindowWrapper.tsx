"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square } from "lucide-react";
import { ReactNode } from "react";

export function WindowWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If we are on the desktop root, we don't render a window.
  // Actually, maybe we render a "Welcome" window on root?
  // Let's just return children on root, and let page.tsx handle its own windows if it wants.
  if (pathname === "/") {
    return <>{children}</>;
  }

  // Get window title from pathname
  const title = pathname === "/admin" ? "ADMIN_CTRL_PANEL.EXE" 
    : pathname === "/blog" ? "BLOG_LOGS.SYS"
    : pathname === "/goals" ? "GOALS_SYS.EXE"
    : pathname === "/journey" ? "JOURNEY_SYS.EXE"
    : pathname === "/contact" ? "COMMS_UPLINK.EXE"
    : pathname.toUpperCase().replace("/", "") + ".EXE";

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="os-window absolute inset-x-4 top-4 md:inset-x-20 md:top-10 bottom-4 flex flex-col z-40 max-w-5xl mx-auto"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Title Bar */}
        <div className="os-titlebar h-8 flex items-center justify-between px-2 cursor-grab active:cursor-grabbing shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black" /> {/* Decorative icon */}
            <span>{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 flex items-center justify-center bg-black text-brand-cyan hover:bg-white hover:text-black border border-black transition-colors">
              <Minus size={14} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center bg-black text-brand-cyan hover:bg-white hover:text-black border border-black transition-colors">
              <Square size={12} />
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-6 h-6 flex items-center justify-center bg-black text-brand-cyan hover:bg-red-500 hover:text-white border border-black transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-black/80 p-6 relative custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
