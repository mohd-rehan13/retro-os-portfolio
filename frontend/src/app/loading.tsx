"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-darker/40 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        {/* Multi-layered Glass Loader */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          
          {/* Outer Ring - Violet glow */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-r-2 border-brand-cyan/40 rounded-full shadow-[0_0_20px_rgba(167,139,250,0.2)]"
          />
          
          {/* Middle Ring - Amber pulse */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-b-2 border-l-2 border-brand-purple/40 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          />
          
          {/* Inner Core - Pulsing violet */}
          <motion.div
            animate={{ 
              scale: [0.8, 1.1, 0.8],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 bg-brand-cyan/20 rounded-full border border-brand-cyan/40 flex items-center justify-center backdrop-blur-xl"
          >
            <div className="w-2 h-2 bg-brand-cyan rounded-full animate-ping" />
          </motion.div>

          {/* Decorative bits */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-brand-cyan/30 rounded-full" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-brand-cyan/30 rounded-full" />
        </div>

        {/* System Text sequence */}
        <div className="mt-12 text-center space-y-2">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-brand-cyan font-vt323 text-xl tracking-[0.3em] uppercase"
          >
            Initializing_System
          </motion.p>
          
          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  backgroundColor: ["rgba(167,139,250,0.2)", "rgba(167,139,250,1)", "rgba(167,139,250,0.2)"]
                }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full"
              />
            ))}
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 1] }}
            className="text-[10px] text-brand-purple tracking-widest uppercase font-tech mt-4"
          >
            Secure_Uplink_Established // Level_04_Auth
          </motion.p>
        </div>
      </div>

      {/* Background Decorative Grid/Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#a78bfa11_1px,transparent_1px),linear-gradient(to_bottom,#a78bfa11_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
    </div>
  );
}
