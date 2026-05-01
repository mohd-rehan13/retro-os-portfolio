"use client";

import { ReactNode } from "react";

export function CrtEffect({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-brand-darker">
      <div className="crt crt-flicker absolute inset-0 pointer-events-none" />
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
