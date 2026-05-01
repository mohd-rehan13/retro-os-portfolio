"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Global Error:", error); }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center font-vt323 text-brand-cyan p-8">
      <div className="text-6xl mb-4">⚠</div>
      <div className="text-3xl tracking-widest mb-2">&gt; SYSTEM_ERROR</div>
      <p className="text-brand-cyan/50 text-sm mb-6 max-w-md">CRITICAL FAULT DETECTED. MODULE FAILED TO LOAD.</p>
      <div className="flex gap-4">
        <button onClick={() => reset()} className="border-2 border-brand-purple bg-brand-purple text-black px-6 py-2 tracking-widest hover:bg-black hover:text-brand-purple transition-all">RETRY</button>
        <button onClick={() => window.location.href = '/'} className="border-2 border-brand-cyan px-6 py-2 tracking-widest hover:bg-brand-cyan hover:text-black transition-all">HOME</button>
      </div>
    </div>
  );
}
