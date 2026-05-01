"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${API}/posts`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category?.toUpperCase()).filter(Boolean));
    return ["ALL", ...Array.from(cats)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || 
                            p.content?.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === "ALL" || p.category?.toUpperCase() === activeCategory;
      return matchesSearch && matchesCat && p.published;
    });
  }, [posts, search, activeCategory]);

  return (
    <div className="space-y-8 text-brand-cyan font-vt323">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl tracking-[0.3em] text-brand-cyan mb-2">&gt; BLOG_LOGS.SYS</h1>
        <p className="text-brand-cyan/50 text-sm tracking-widest uppercase">
          READING SYSTEM LOGS // TECHNICAL NOTES // KNOWLEDGE BASE
        </p>
      </motion.div>

      {/* Control Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between border-b-2 border-brand-cyan/20 pb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[300px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-cyan/30" />
          <input 
            type="text" 
            placeholder="SEARCH_ARCHIVE..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border-2 border-brand-cyan/20 pl-10 pr-4 py-2 text-brand-cyan placeholder:text-brand-cyan/20 focus:outline-none focus:border-brand-cyan transition-colors tracking-widest"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs tracking-[0.2em] border-2 transition-all ${
                activeCategory === cat 
                ? "bg-brand-cyan text-black border-brand-cyan" 
                : "border-brand-cyan/20 text-brand-cyan/50 hover:border-brand-cyan/50 hover:text-brand-cyan"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-brand-cyan/50 animate-pulse">
          <BookOpen size={48} className="mb-4 opacity-20" />
          <div className="text-xl tracking-widest">[ ACCESSING_DATABASE... ]</div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-brand-cyan/10">
          <p className="text-brand-cyan/40 tracking-widest text-lg uppercase">
            [ No matching logs found in this sector ]
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id || i}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="group relative border-2 border-brand-cyan/30 bg-black/40 p-6 hover:border-brand-cyan transition-all overflow-hidden">
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-brand-purple text-xs tracking-widest uppercase bg-brand-purple/5 px-2 py-0.5 border border-brand-purple/20">
                            <Tag size={12} /> {post.category || "GENERAL"}
                          </span>
                          <span className="flex items-center gap-1.5 text-brand-cyan/40 text-[10px] tracking-widest uppercase">
                            <Clock size={12} /> {post.readTime || "5M"}
                          </span>
                        </div>
                        <span className="text-brand-cyan/30 text-[10px] tracking-tighter">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-2xl text-brand-cyan group-hover:text-white transition-colors tracking-widest mb-3">
                        &gt; {post.title}
                      </h3>
                      
                      <p className="text-brand-cyan/50 text-sm leading-relaxed line-clamp-3 mb-6 tracking-wide group-hover:text-brand-cyan/70 transition-colors">
                        {post.content}
                      </p>

                      <div className="flex items-center gap-2 text-brand-cyan/40 text-xs tracking-[0.3em] uppercase group-hover:text-brand-cyan transition-colors">
                        Initialize_Reading_Protocol <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
                      <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-brand-cyan/10 group-hover:border-brand-cyan transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
