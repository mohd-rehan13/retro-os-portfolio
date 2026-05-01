"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Terminal, LayoutDashboard, Target, Route, Mail, Folder } from "lucide-react";

export function Taskbar() {
  const pathname = usePathname();
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  const apps = [
    { name: "Root", path: "/", icon: <Terminal size={18} /> },
    { name: "BLOG_LOGS", path: "/blog", icon: <Folder size={18} /> },
    { name: "GOALS_EXE", path: "/goals", icon: <Target size={18} /> },
    { name: "JOURNEY_SYS", path: "/journey", icon: <Route size={18} /> },
    { name: "ADMIN_CTRL", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Comms", path: "/contact", icon: <Mail size={18} /> },
  ];

  return (
    <div className="h-12 w-full bg-brand-darker border-t-2 border-brand-cyan flex items-center px-4 justify-between z-50">
      <div className="flex items-center gap-2 h-full">
        <div className="font-vt323 text-xl font-bold bg-brand-cyan text-black px-4 h-full flex items-center mr-4 uppercase tracking-widest cursor-pointer hover:bg-white transition-colors">
          Start
        </div>
        
        {apps.map((app) => {
          const isActive = pathname === app.path;
          return (
            <Link key={app.path} href={app.path}>
              <div 
                className={`flex items-center gap-2 px-3 py-1 border-2 font-vt323 text-lg uppercase tracking-wider transition-all
                  ${isActive 
                    ? "bg-brand-cyan text-black border-brand-cyan shadow-[inset_2px_2px_0px_rgba(255,255,255,0.5)]" 
                    : "bg-brand-darker text-brand-cyan border-brand-cyan/50 hover:bg-brand-cyan/10"
                  }`}
              >
                {app.icon}
                <span className="hidden md:inline">{app.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="font-vt323 text-brand-cyan text-xl tracking-wider hidden sm:flex items-center gap-4">
        <span>SYS.OK</span>
        <span className="border-l-2 border-brand-cyan/50 pl-4">{time}</span>
      </div>
    </div>
  );
}

