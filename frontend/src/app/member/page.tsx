"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Calendar, 
  Target, 
  Zap, 
  Layout, 
  X,
  Loader2,
  AlertCircle
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export default function MemberDashboard() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const res = await fetch(`${API}/goals`, { credentials: "include" });
        if (res.ok) setGoals(await res.json());
        else if (res.status === 401) setError("AUTHENTICATION_REQUIRED");
      } catch (err) {
        console.error("Failed to fetch goals:", err);
        setError("SYSTEM_OFFLINE");
      } finally {
        setLoading(false);
      }
    }
    fetchGoals();
  }, []);

  const completed = useMemo(() => goals.filter((g: any) => g.status === "COMPLETED").length, [goals]);
  const progressPercent = useMemo(() => goals.length === 0 ? 0 : Math.round((completed / goals.length) * 100), [goals, completed]);

  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!newGoalTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newGoalTitle,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        }),
        credentials: "include",
      });

      if (res.ok) {
        const goal = await res.json();
        setGoals([goal, ...goals]);
        setNewGoalTitle("");
      }
    } catch (err) {
      console.error("Failed to add goal:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleGoal(goalId: string, currentStatus: string) {
    const newStatus = currentStatus === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED";
    try {
      const res = await fetch(`${API}/goals/${goalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });
      if (res.ok) {
        setGoals(goals.map(g => g.id === goalId ? { ...g, status: newStatus } : g));
      }
    } catch (err) {
      console.error("Failed to toggle goal:", err);
    }
  }

  async function deleteGoal(goalId: string) {
    try {
      const res = await fetch(`${API}/goals/${goalId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setGoals(goals.filter(g => g.id !== goalId));
      }
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-brand-cyan font-vt323 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl tracking-[0.3em] mb-2">&gt; MEMBER_DASHBOARD.EXE</h1>
        <div className="text-brand-cyan/50 text-sm tracking-widest uppercase flex items-center gap-3">
          <span>SECURE_SESSION_ACTIVE</span>
          <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse" />
        </div>
      </motion.div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 border-brand-cyan/20 p-6 bg-black/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target size={40} />
          </div>
          <div className="text-brand-cyan/50 text-xs tracking-[0.2em] mb-1 uppercase">TOTAL_OBJECTIVES</div>
          <div className="text-4xl text-white">{goals.length}</div>
        </div>

        <div className="border-2 border-brand-cyan/20 p-6 bg-black/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity text-brand-purple">
            <Zap size={40} />
          </div>
          <div className="text-brand-cyan/50 text-xs tracking-[0.2em] mb-1 uppercase">CURRENT_VELOCITY</div>
          <div className="text-4xl text-brand-purple">{progressPercent}%</div>
        </div>

        <div className="border-2 border-brand-cyan/20 p-6 bg-black/40 flex flex-col justify-center">
          <div className="h-2 bg-brand-dark rounded-full overflow-hidden border border-brand-cyan/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-brand-cyan shadow-[0_0_15px_rgba(167,139,250,0.5)]"
            />
          </div>
          <div className="mt-3 text-[10px] text-brand-cyan/30 text-right uppercase tracking-[0.3em]">
            SYSTEM_OPTIMIZATION_LEVEL
          </div>
        </div>
      </div>

      {/* Goal Creation */}
      <motion.form 
        onSubmit={handleAddGoal}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-3"
      >
        <div className="relative flex-1">
          <Plus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-cyan/40" />
          <input 
            type="text"
            placeholder="ADD_NEW_OBJECTIVE..."
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            className="w-full bg-black/60 border-2 border-brand-cyan/20 pl-10 pr-4 py-3 text-brand-cyan placeholder:text-brand-cyan/20 focus:outline-none focus:border-brand-cyan/50 transition-all tracking-widest"
          />
        </div>
        <button 
          disabled={isSubmitting || !newGoalTitle.trim()}
          className="px-8 bg-brand-cyan text-black hover:bg-white transition-colors disabled:opacity-30 tracking-widest font-bold uppercase"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "COMMIT"}
        </button>
      </motion.form>

      {/* Goals List */}
      <div className="border-2 border-brand-cyan/20 bg-black/40 overflow-hidden">
        <div className="p-4 border-b border-brand-cyan/20 flex justify-between items-center bg-brand-cyan/5">
          <div className="flex items-center gap-2 text-sm tracking-[0.2em] uppercase">
            <Layout size={16} className="text-brand-cyan/60" />
            Active_Mission_Parameters
          </div>
          <span className="text-[10px] text-brand-cyan/40 tracking-[0.3em]">
            {new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-brand-cyan/40 animate-pulse tracking-widest uppercase">
            [ Syncing_With_Central_Core... ]
          </div>
        ) : error ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <AlertCircle className="text-brand-purple" />
            <div className="text-brand-purple tracking-widest uppercase">{error}</div>
          </div>
        ) : goals.length === 0 ? (
          <div className="py-20 text-center text-brand-cyan/30 tracking-[0.2em] uppercase italic">
            [ No objectives currently assigned ]
          </div>
        ) : (
          <div className="divide-y divide-brand-cyan/10">
            <AnimatePresence initial={false}>
              {goals.map((g, i) => (
                <motion.div 
                  key={g.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-4 flex items-center justify-between group hover:bg-brand-cyan/5 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => toggleGoal(g.id, g.status)}
                      className="transition-transform active:scale-90"
                    >
                      {g.status === "COMPLETED" 
                        ? <CheckCircle2 className="text-brand-cyan" size={24} /> 
                        : <Circle className="text-brand-cyan/20 group-hover:text-brand-cyan/40" size={24} />
                      }
                    </button>
                    <span className={`text-lg tracking-wide transition-all ${g.status === "COMPLETED" ? "line-through text-brand-cyan/30" : "text-brand-cyan"}`}>
                      &gt; {g.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-brand-cyan/30 uppercase tracking-widest hidden sm:block">
                      {new Date(g.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => deleteGoal(g.id)}
                      className="text-brand-cyan/20 hover:text-brand-purple transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Decorative Footer */}
      <div className="flex justify-between items-center text-[10px] text-brand-cyan/20 tracking-[0.5em] uppercase">
        <span>Sector_7G // Nodes_Verified</span>
        <span>Build_ID_050126</span>
      </div>
    </div>
  );
}
