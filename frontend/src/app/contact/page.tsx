"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, content }),
      });
      if (res.ok) {
        setStatus("sent");
        setName(""); setEmail(""); setContent("");
      } else { setStatus("error"); }
    } catch { setStatus("error"); }
  }

  return (
    <div className="space-y-6 text-brand-cyan font-vt323 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-3xl tracking-widest mb-1">&gt; COMMS_UPLINK.EXE</div>
        <div className="text-brand-cyan/50 text-sm mb-6">TRANSMIT YOUR MESSAGE</div>
      </motion.div>

      {status === "sent" ? (
        <div className="border-2 border-brand-cyan p-8 bg-brand-cyan/5 text-center">
          <div className="text-4xl mb-4">✓</div>
          <div className="text-2xl mb-2">TRANSMISSION SUCCESSFUL</div>
          <button onClick={() => setStatus("idle")} className="mt-4 border-2 border-brand-cyan px-6 py-2 hover:bg-brand-cyan hover:text-black transition-all">NEW_MESSAGE</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="border-2 border-brand-cyan/50 p-6 bg-black/50 space-y-5">
          <div>
            <label className="text-brand-cyan/60 text-xs tracking-widest block mb-2">SENDER_NAME:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-black border-2 border-brand-cyan/30 text-brand-cyan px-3 py-2 focus:outline-none focus:border-brand-cyan font-vt323 text-lg" placeholder="John Doe" />
          </div>
          <div>
            <label className="text-brand-cyan/60 text-xs tracking-widest block mb-2">SENDER_EMAIL:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-black border-2 border-brand-cyan/30 text-brand-cyan px-3 py-2 focus:outline-none focus:border-brand-cyan font-vt323 text-lg" placeholder="john@example.com" />
          </div>
          <div>
            <label className="text-brand-cyan/60 text-xs tracking-widest block mb-2">MESSAGE_BODY:</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={5} className="w-full bg-black border-2 border-brand-cyan/30 text-brand-cyan px-3 py-2 focus:outline-none focus:border-brand-cyan font-vt323 text-lg resize-none" placeholder="How can we build the future together?" />
          </div>
          {status === "error" && <div className="text-brand-purple border border-brand-purple/50 p-2">[ ERROR: RETRY ]</div>}
          <button type="submit" disabled={status === "sending"} className="w-full border-2 border-brand-cyan bg-brand-cyan text-black px-6 py-3 text-xl tracking-widest hover:bg-black hover:text-brand-cyan transition-all disabled:opacity-50">
            {status === "sending" ? "TRANSMITTING..." : "SEND_MESSAGE >>"}
          </button>
        </form>
      )}
    </div>
  );
}
