"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface Goal {
  id: string;
  title: string;
  description?: string;
  status: string;
  progress: number;
  month: number;
  year: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const res = await fetch(`${API}/goals`, { credentials: "include" });
        if (res.ok) {
          setGoals(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch goals:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGoals();
  }, []);

  const completed = goals.filter((g) => g.status === "COMPLETED").length;
  const total = goals.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6 text-brand-cyan font-vt323">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-3xl tracking-widest text-brand-cyan mb-1">
          &gt; GOALS_TRACKER.BAT
        </div>
        <div className="text-brand-cyan/50 text-sm mb-6">
          TRACKING OBJECTIVES // MONTHLY TARGETS // EXECUTION LOG
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border-2 border-brand-cyan/50 p-4 bg-black/50 text-center">
          <div className="text-brand-cyan/60 text-xs tracking-widest mb-1">COMPLETION</div>
          <div className="text-4xl text-brand-cyan">{pct}%</div>
        </div>
        <div className="border-2 border-brand-cyan/50 p-4 bg-black/50 text-center">
          <div className="text-brand-cyan/60 text-xs tracking-widest mb-1">COMPLETED</div>
          <div className="text-4xl text-brand-cyan">{completed}/{total}</div>
        </div>
        <div className="border-2 border-brand-purple/50 p-4 bg-black/50 text-center">
          <div className="text-brand-purple/60 text-xs tracking-widest mb-1">IN_PROGRESS</div>
          <div className="text-4xl text-brand-purple">{total - completed}</div>
        </div>
      </div>

      {/* Goals List */}
      <div className="border-2 border-brand-cyan/50 p-4 bg-black/50">
        <div className="text-lg tracking-widest text-brand-cyan mb-4 border-b border-brand-cyan/30 pb-2">
          &gt; ACTIVE_OBJECTIVES
        </div>

        {loading ? (
          <div className="text-brand-cyan/50 animate-pulse py-8 text-center">
            [ SCANNING GOALS DATABASE... ]
          </div>
        ) : goals.length === 0 ? (
          <div className="text-brand-cyan/40 text-center py-8">
            [ NO GOALS LOADED — SET TARGETS VIA API OR AUTHENTICATE ]
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal, i) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border border-brand-cyan/20 p-3 hover:bg-brand-cyan/5 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-brand-cyan">&gt; {goal.title}</span>
                  <span
                    className={`text-xs px-2 py-0.5 border ${
                      goal.status === "COMPLETED"
                        ? "border-brand-cyan/50 text-brand-cyan"
                        : "border-brand-purple/50 text-brand-purple"
                    }`}
                  >
                    {goal.status}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-black border border-brand-cyan/30">
                  <div
                    className={`h-full ${
                      goal.status === "COMPLETED" ? "bg-brand-cyan" : "bg-brand-purple"
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="text-right text-brand-cyan/40 text-xs mt-1">
                  {goal.progress}%
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
