import type { Metadata } from "next";
import { Share_Tech_Mono, VT323 } from "next/font/google";
import "./globals.css";
import { CrtEffect } from "@/components/os/CrtEffect";
import { Taskbar } from "@/components/os/Taskbar";
import { WindowWrapper } from "@/components/os/WindowWrapper";
import AuthProvider from "@/components/providers/SessionProvider";

const shareTech = Share_Tech_Mono({
  weight: "400",
  variable: "--font-tech",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohammad Rehan | Desktop OS",
  description: "Interactive Retro-Futuristic Terminal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${shareTech.variable} ${vt323.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-brand-darker text-brand-cyan font-tech overflow-hidden selection:bg-brand-purple/50">
        <CrtEffect>
          {/* Desktop Environment */}
          <main className="flex-1 relative w-full h-[calc(100vh-48px)] p-4 md:p-8">
            <AuthProvider>
              <WindowWrapper>{children}</WindowWrapper>
            </AuthProvider>
          </main>
          
          <Taskbar />
        </CrtEffect>
      </body>
    </html>
  );
}
