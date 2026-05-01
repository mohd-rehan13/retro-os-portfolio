"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Target, Trophy, Clock, ListTodo } from "lucide-react";

const API = "/api/proxy";

interface Goal {
  id: string;
  title: string;
  description?: string;
  status: string;
  progress: number;
  month: number;
  year: number;
}

interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [gRes, tRes] = await Promise.all([
          fetch(`${API}/goals`, { credentials: "include" }),
          fetch(`${API}/todos`, { credentials: "include" })
        ]);
        if (gRes.ok) setGoals(await gRes.json());
        if (tRes.ok) setTodos(await tRes.json());
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const completedGoals = goals.filter((g) => g.status === "COMPLETED").length;
  const totalGoals = goals.length;
  const goalsPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;

  return (
    <div className="space-y-8 text-brand-cyan font-vt323 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-3xl tracking-widest text-brand-cyan mb-1 flex items-center gap-3">
          <Target className="text-brand-cyan animate-pulse" />
          &gt; COMMAND_CENTER.EXE
        </div>
        <div className="text-brand-cyan/50 text-sm mb-6 uppercase">
          STRATEGIC OBJECTIVES // DAILY EXECUTION // PERFORMANCE LOG
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-2 border-brand-cyan/30 p-4 bg-black/40 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-cyan/50" />
          <div className="text-brand-cyan/40 text-xs tracking-widest mb-1 flex justify-between uppercase">
            <span>GOAL_COMPLETION</span>
            <Trophy size={12} />
          </div>
          <div className="text-4xl text-brand-cyan">{goalsPct}%</div>
          <div className="w-full h-1 bg-brand-cyan/10 mt-2">
            <motion.div initial={{ width: 0 }} animate={{ width: `${goalsPct}%` }} className="h-full bg-brand-cyan" />
          </div>
        </div>

        <div className="border-2 border-brand-purple/30 p-4 bg-black/40 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-purple/50" />
          <div className="text-brand-purple/40 text-xs tracking-widest mb-1 flex justify-between uppercase">
            <span>TODO_STATUS</span>
            <ListTodo size={12} />
          </div>
          <div className="text-4xl text-brand-purple">{completedTodos}/{totalTodos}</div>
          <div className="text-[10px] text-brand-purple/50 mt-1 uppercase">TASKS_REMAINING: {totalTodos - completedTodos}</div>
        </div>

        <div className="border-2 border-brand-cyan/30 p-4 bg-black/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-cyan/30" />
          <div className="text-brand-cyan/40 text-xs tracking-widest mb-1 flex justify-between uppercase">
            <span>SYSTEM_TIME</span>
            <Clock size={12} />
          </div>
          <div className="text-4xl text-brand-cyan/80">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}</div>
          <div className="text-[10px] text-brand-cyan/30 mt-1 uppercase">SYNC_STATUS: ACTIVE</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Goals Section */}
        <div className="space-y-4">
          <div className="text-lg tracking-[0.2em] text-brand-cyan flex items-center gap-2 border-b-2 border-brand-cyan/20 pb-2 uppercase">
            <Target size={18} /> MISSION_OBJECTIVES
          </div>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="text-brand-cyan/30 animate-pulse py-8 text-center uppercase">[ SCANNING_SECTORS... ]</div>
            ) : goals.length === 0 ? (
              <div className="text-brand-cyan/20 text-center py-12 border border-dashed border-brand-cyan/20 uppercase">
                &gt; NO_ACTIVE_MISSIONS_LOGGED
              </div>
            ) : (
              goals.map((goal, i) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-2 border-brand-cyan/10 p-4 bg-black/20 hover:border-brand-cyan/40 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="uppercase">
                      <h3 className="text-lg text-brand-cyan group-hover:text-white transition-colors">&gt; {goal.title}</h3>
                      <p className="text-brand-cyan/50 text-xs mt-1">{goal.description}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 border ${goal.status === "COMPLETED" ? "border-brand-cyan text-brand-cyan" : "border-brand-purple text-brand-purple"}`}>
                      {goal.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-brand-cyan/40 uppercase">
                      <span>SYNC_PROGRESS</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-brand-cyan/5 border border-brand-cyan/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        className={`h-full ${goal.status === "COMPLETED" ? "bg-brand-cyan" : "bg-brand-purple shadow-[0_0_8px_rgba(167,139,250,0.5)]"}`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Todo Section */}
        <div className="space-y-4">
          <div className="text-lg tracking-[0.2em] text-brand-purple flex items-center gap-2 border-b-2 border-brand-purple/20 pb-2 uppercase">
            <ListTodo size={18} /> DAILY_TASKS_QUEUE
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="text-brand-purple/30 animate-pulse py-8 text-center uppercase">[ FETCHING_QUEUE... ]</div>
            ) : todos.length === 0 ? (
              <div className="text-brand-purple/20 text-center py-12 border border-dashed border-brand-purple/20 uppercase">
                &gt; TASK_QUEUE_EMPTY
              </div>
            ) : (
              todos.map((todo, i) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`border border-brand-purple/20 p-3 flex items-center gap-4 transition-all uppercase ${todo.completed ? "bg-brand-purple/5 opacity-60" : "bg-black/30 hover:border-brand-purple/50"}`}
                >
                  <div className={todo.completed ? "text-brand-purple" : "text-brand-purple/40"}>
                    {todo.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </div>
                  <span className={`text-md flex-1 tracking-wider ${todo.completed ? "line-through text-brand-purple/40" : "text-brand-purple"}`}>
                    {todo.task}
                  </span>
                  {todo.completed && <span className="text-[10px] text-brand-purple/30 font-bold tracking-widest">[ DONE ]</span>}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
