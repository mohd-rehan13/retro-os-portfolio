"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, Clock, Tag, Share2, Printer } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        // Fetch all to find the right one (or add a specific slug endpoint later)
        const res = await fetch(`${API}/posts`);
        if (res.ok) {
          const data = await res.json();
          const found = data.find((p: any) => p.slug === slug);
          setPost(found);
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-brand-cyan/50 font-vt323 animate-pulse">
        <div className="text-xl tracking-[0.3em]">&gt; LOADING_LOG_ENTRY...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-brand-cyan/50 font-vt323">
        <div className="text-xl tracking-widest mb-4">404: LOG_ENTRY_NOT_FOUND</div>
        <Link href="/blog" className="border-2 border-brand-cyan px-6 py-2 hover:bg-brand-cyan hover:text-black transition-all">
          RETURN_TO_ARCHIVE
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-brand-cyan font-vt323 max-w-4xl mx-auto pb-12">
      {/* Navigation */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-brand-cyan/60 hover:text-brand-cyan transition-colors group mb-4">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="tracking-[0.2em] uppercase text-sm">Back_to_Archive</span>
      </Link>

      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-wrap gap-4 items-center">
          <span className="px-3 py-1 bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs tracking-widest uppercase">
            {post.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-brand-cyan/40 tracking-widest uppercase">
            <Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-cyan/40 tracking-widest uppercase">
            <Clock size={12} /> {post.readTime}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl tracking-widest leading-tight text-white drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]">
          &gt; {post.title}
        </h1>

        <div className="h-px w-full bg-gradient-to-r from-brand-cyan/50 via-brand-cyan/10 to-transparent" />
      </motion.header>

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* Glass Content Panel */}
        <div className="bg-brand-dark/40 backdrop-blur-xl border-2 border-brand-cyan/20 p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle Decorative Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#a78bfa08_1px,transparent_1px),linear-gradient(to_bottom,#a78bfa08_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
          
          <div className="relative z-10 prose prose-invert prose-violet max-w-none">
            {/* Split text into paragraphs and render */}
            {post.content.split('\n').map((para: string, i: number) => (
              para.trim() ? (
                <p key={i} className="text-brand-cyan/80 text-lg leading-relaxed mb-6 tracking-wide first-letter:text-3xl first-letter:text-brand-purple first-letter:font-bold">
                  {para}
                </p>
              ) : <br key={i} />
            ))}
          </div>

          {/* Action Toolbar */}
          <div className="mt-12 pt-8 border-t border-brand-cyan/20 flex justify-between items-center text-brand-cyan/40">
            <div className="flex gap-4">
              <button className="hover:text-brand-cyan transition-colors" title="Print Log"><Printer size={18} /></button>
              <button className="hover:text-brand-cyan transition-colors" title="Share Log"><Share2 size={18} /></button>
            </div>
            <div className="text-[10px] tracking-widest uppercase">
              End_of_File // System_Verified
            </div>
          </div>
        </div>

        {/* Floating Scanline Effect (Local to post) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </motion.main>

      {/* Footer Nav */}
      <div className="pt-8 flex justify-center">
        <Link href="/blog" className="flex items-center gap-3 px-8 py-3 border-2 border-brand-cyan/30 text-brand-cyan/60 hover:border-brand-cyan hover:text-brand-cyan transition-all uppercase tracking-[0.4em] text-sm bg-black/20 backdrop-blur-md">
          Return_to_Central_Logs
        </Link>
      </div>
    </div>
  );
}
