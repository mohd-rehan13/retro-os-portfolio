"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("AUTHENTICATION_FAILED: INVALID_CREDENTIALS");
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError("SYSTEM_ERROR: UNABLE_TO_CONTACT_AUTH_SERVER");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full font-vt323 text-brand-cyan">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md border-2 border-brand-purple/50 bg-black/80 p-6">
        <div className="text-2xl tracking-widest text-brand-purple mb-1 text-center">&gt; AUTH_LOGIN.EXE</div>
        <div className="text-brand-purple/50 text-sm mb-6 text-center">AUTHENTICATE TO ACCESS THE PORTAL</div>
        
        {error && (
          <div className="bg-red-950/50 border border-red-500 text-red-200 p-2 text-xs mb-4 text-center uppercase tracking-widest">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-brand-cyan/60 text-xs tracking-widest block mb-2">EMAIL:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border-2 border-brand-cyan/30 text-brand-cyan px-3 py-2 focus:outline-none focus:border-brand-cyan font-vt323 text-lg uppercase" 
              placeholder="ADMIN@RETRO.OS" 
              required
            />
          </div>
          <div>
            <label className="text-brand-cyan/60 text-xs tracking-widest block mb-2">PASSWORD:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border-2 border-brand-cyan/30 text-brand-cyan px-3 py-2 focus:outline-none focus:border-brand-cyan font-vt323 text-lg" 
              placeholder="••••••••" 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full border-2 border-brand-purple bg-brand-purple text-black px-6 py-3 text-xl tracking-widest hover:bg-black hover:text-brand-purple transition-all mt-4 disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN >>"}
          </button>
        </form>

        <div className="mt-6 text-[10px] text-brand-cyan/20 text-center uppercase tracking-[0.2em]">
          Default Credentials: admin@retro.os / password
        </div>
      </motion.div>
    </div>
  );
}
