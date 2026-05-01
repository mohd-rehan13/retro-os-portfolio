"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Users,
  FileText,
  Mail,
  Activity,
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  Shield,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Save,
  UserPlus,
  UserMinus,
  Info
} from "lucide-react";

const API = "/api/proxy";

type Tab = "overview" | "users" | "posts" | "messages" | "milestones" | "todos" | "goals";
type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/* ─── tiny helpers ───────────────────────────────── */
function timeAgo(date: string) {
  if (!date) return "—";
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/* ─── Animated stat bar ──────────────────────────── */
function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max === 0 ? 0 : Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs tracking-widest">
        <span className="text-brand-cyan/60">{label}</span>
        <span className={color}>{value}</span>
      </div>
      <div className="h-2 bg-brand-dark border border-brand-cyan/20 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full"
          style={{ background: color === "text-brand-purple" ? "#f59e0b" : "#a78bfa" }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ADMIN DASHBOARD
   ═══════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modals & Notifications
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<any | null>(null);
  const [editingTodo, setEditingTodo] = useState<any | null>(null);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [milestoneToDelete, setMilestoneToDelete] = useState<string | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  /* ── Notification Helper ────────────────────────── */
  const notify = (message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  /* ── Fetch all data ──────────────────────────────── */
  async function loadData() {
    try {
      const [uRes, mRes, pRes, aRes, miRes, tRes, gRes] = await Promise.all([
        fetch(`${API}/users`, { credentials: "include" }),
        fetch(`${API}/messages`, { credentials: "include" }),
        fetch(`${API}/posts/admin/all`, { credentials: "include" }),
        fetch(`${API}/users/analytics`, { credentials: "include" }),
        fetch(`${API}/milestones`, { credentials: "include" }),
        fetch(`${API}/todos`, { credentials: "include" }),
        fetch(`${API}/goals`, { credentials: "include" }),
      ]);
      if (uRes.ok) setUsers(await uRes.json());
      if (mRes.ok) setMessages(await mRes.json());
      if (pRes.ok) setPosts(await pRes.json());
      if (aRes.ok) setAnalytics(await aRes.json());
      if (miRes.ok) setMilestones(await miRes.json());
      if (tRes.ok) setTodos(await tRes.json());
      if (gRes.ok) setGoals(await gRes.json());
    } catch (e) {
      notify("CONNECTION_FAILURE: SYSTEM_OFFLINE", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (status === "authenticated") {
      loadData();
    }
  }, [status]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 600);
  }

  /* ── Action Handlers ─────────────────────────────── */
  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === "ADMIN" ? "MEMBER" : "ADMIN";
    try {
      const res = await fetch(`${API}/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
        credentials: "include",
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        notify(`USER_ROLE_UPDATED: ${newRole}`);
      } else {
        notify("PERMISSION_DENIED", "error");
      }
    } catch (e) {
      notify("REQUEST_FAILED", "error");
    }
  }

  async function confirmDeletePost() {
    if (!postToDelete) return;
    setIsDeleting(postToDelete);
    try {
      const res = await fetch(`${API}/posts/${postToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== postToDelete));
        notify("DATA_DELETED: POST_REMOVED");
      } else {
        notify("ERROR_DELETING_POST", "error");
      }
    } catch (e) {
      notify("CONNECTION_ERROR", "error");
    } finally {
      setIsDeleting(null);
      setPostToDelete(null);
    }
  }

  async function savePost(post: any) {
    try {
      const isNew = !post.id;
      const dataToSave = { ...post };
      
      if (!dataToSave.slug && dataToSave.title) {
        dataToSave.slug = dataToSave.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      
      if (isNew) {
        dataToSave.readTime = dataToSave.readTime || "5M";
        dataToSave.category = dataToSave.category || "GENERAL";
      }

      const url = isNew ? `${API}/posts` : `${API}/posts/${post.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
        credentials: "include",
      });

      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          setPosts([saved, ...posts]);
        } else {
          setPosts(posts.map(p => p.id === post.id ? saved : p));
        }
        setEditingPost(null);
        notify(isNew ? "DATABASE_ENTRY: POST_CREATED" : "DATABASE_UPDATED: POST_SAVED");
      } else {
        notify("SAVE_FAILED", "error");
      }
    } catch (e) {
      notify("CONNECTION_ERROR", "error");
    }
  }

  async function saveMilestone(m: any) {
    try {
      const isNew = !m.id;
      const url = isNew ? `${API}/milestones` : `${API}/milestones/${m.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(m),
        credentials: "include",
      });

      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          setMilestones([saved, ...milestones]);
        } else {
          setMilestones(milestones.map(x => x.id === m.id ? saved : x));
        }
        setEditingMilestone(null);
        notify(isNew ? "JOURNEY_LOGGED: MILESTONE_CREATED" : "JOURNEY_UPDATED: MILESTONE_SAVED");
      } else {
        notify("SAVE_FAILED", "error");
      }
    } catch (e) {
      notify("CONNECTION_ERROR", "error");
    }
  }

  async function confirmDeleteMilestone() {
    if (!milestoneToDelete) return;
    setIsDeleting(milestoneToDelete);
    try {
      const res = await fetch(`${API}/milestones/${milestoneToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMilestones(milestones.filter(m => m.id !== milestoneToDelete));
        notify("DATA_DELETED: MILESTONE_REMOVED");
      } else {
        notify("ERROR_DELETING_MILESTONE", "error");
      }
    } catch (e) {
      notify("CONNECTION_ERROR", "error");
    } finally {
      setIsDeleting(null);
      setMilestoneToDelete(null);
    }
  }

  /* ── Todo Handlers ──────────────────────────────── */
  async function saveTodo(todo: any) {
    try {
      const isNew = !todo.id;
      const url = isNew ? `${API}/todos` : `${API}/todos/${todo.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
        credentials: "include",
      });
      if (res.ok) {
        const saved = await res.json();
        setTodos(isNew ? [saved, ...todos] : todos.map(t => t.id === todo.id ? saved : t));
        setEditingTodo(null);
        notify(isNew ? "TASK_CREATED" : "TASK_UPDATED");
      }
    } catch (e) { notify("SAVE_FAILED", "error"); }
  }

  async function confirmDeleteTodo() {
    if (!todoToDelete) return;
    try {
      const res = await fetch(`${API}/todos/${todoToDelete}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        setTodos(todos.filter(t => t.id !== todoToDelete));
        notify("TASK_PURGED");
      }
    } catch (e) { notify("DELETE_FAILED", "error"); }
    finally { setTodoToDelete(null); }
  }

  async function toggleTodo(todo: any) {
    await saveTodo({ ...todo, completed: !todo.completed });
  }

  /* ── Goal Handlers ──────────────────────────────── */
  async function saveGoal(goal: any) {
    try {
      const isNew = !goal.id;
      const url = isNew ? `${API}/goals` : `${API}/goals/${goal.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goal),
        credentials: "include",
      });
      if (res.ok) {
        const saved = await res.json();
        setGoals(isNew ? [saved, ...goals] : goals.map(g => g.id === goal.id ? saved : g));
        setEditingGoal(null);
        notify(isNew ? "GOAL_INITIALIZED" : "GOAL_UPDATED");
      }
    } catch (e) { notify("SAVE_FAILED", "error"); }
  }

  async function confirmDeleteGoal() {
    if (!goalToDelete) return;
    try {
      const res = await fetch(`${API}/goals/${goalToDelete}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        setGoals(goals.filter(g => g.id !== goalToDelete));
        notify("GOAL_REMOVED");
      }
    } catch (e) { notify("DELETE_FAILED", "error"); }
    finally { setGoalToDelete(null); }
  }

  function initNewPost() {
    setEditingPost({
      title: "",
      content: "",
      category: "GENERAL",
      published: false,
      readTime: "5M"
    });
  }

  function initNewMilestone() {
    setEditingMilestone({
      year: new Date().getFullYear().toString(),
      title: "",
      description: "",
      active: false
    });
  }

  function initNewTodo() {
    setEditingTodo({ task: "", completed: false });
  }

  function initNewGoal() {
    setEditingGoal({
      title: "",
      description: "",
      status: "IN_PROGRESS",
      progress: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      userId: session?.user?.id || ""
    });
  }

  /* ── Filtered + sorted data ──────────────────────── */
  const filteredUsers = useMemo(() => {
    let list = users;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => sortDir === "desc" ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [users, search, sortDir]);

  const filteredPosts = useMemo(() => {
    let list = posts;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title?.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => sortDir === "desc" ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [posts, search, sortDir]);

  const filteredMilestones = useMemo(() => {
    let list = milestones;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.title?.toLowerCase().includes(q) || m.year.includes(q));
    }
    return [...list].sort((a, b) => sortDir === "desc" ? b.year.localeCompare(a.year) : a.year.localeCompare(b.year));
  }, [milestones, search, sortDir]);

  const filteredTodos = useMemo(() => {
    let list = todos;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.task?.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => sortDir === "desc" ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [todos, search, sortDir]);

  const filteredGoals = useMemo(() => {
    let list = goals;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((g) => g.title?.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => sortDir === "desc" ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [goals, search, sortDir]);

  const filteredMessages = useMemo(() => {
    let list = messages;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.name?.toLowerCase().includes(q) || m.content?.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => sortDir === "desc" ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages, search, sortDir]);

  /* ── Stat aggregates ─────────────────────────────── */
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  const tabs: { id: Tab; label: string; icon: any; count: number }[] = [
    { id: "overview", label: "OVERVIEW", icon: <Activity size={16} />, count: 0 },
    { id: "users", label: "USERS", icon: <Users size={16} />, count: users.length },
    { id: "posts", label: "POSTS", icon: <FileText size={16} />, count: posts.length },
    { id: "goals", label: "GOALS", icon: <TrendingUp size={16} />, count: goals.length },
    { id: "todos", label: "TODOS", icon: <CheckCircle2 size={16} />, count: todos.length },
    { id: "milestones", label: "JOURNEY", icon: <TrendingUp size={16} />, count: milestones.length },
    { id: "messages", label: "MESSAGES", icon: <Mail size={16} />, count: messages.length },
  ];

  return (
    <div className="space-y-5 font-vt323 text-brand-cyan relative min-h-[500px]">
      {/* ── Toasts ─────────────────────────────────── */}
      <div className="fixed bottom-20 right-8 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={`px-4 py-2 border-2 flex items-center gap-3 shadow-lg pointer-events-auto min-w-[240px] ${
                t.type === "error" ? "bg-red-950/80 border-red-500 text-red-200" :
                t.type === "info" ? "bg-blue-950/80 border-blue-400 text-blue-200" :
                "bg-brand-dark/90 border-brand-cyan text-brand-cyan"
              }`}
            >
              {t.type === "error" ? <AlertCircle size={18} /> : t.type === "info" ? <Info size={18} /> : <CheckCircle2 size={18} />}
              <span className="text-sm tracking-wider flex-1 uppercase">{t.message}</span>
              <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="hover:opacity-50 transition-opacity">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Header ─────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl tracking-widest text-brand-cyan">&gt; ADMIN_CTRL_PANEL.EXE</h1>
            <p className="text-brand-cyan/50 text-sm mt-1 uppercase">SYSTEM METRICS // CMS MANAGEMENT // AUDIT LOG</p>
          </div>
          <button onClick={handleRefresh} className="border-2 border-brand-cyan/50 px-4 py-2 text-sm tracking-widest hover:bg-brand-cyan/10 hover:border-brand-cyan transition-all flex items-center gap-2 group">
            <RefreshCw size={14} className={refreshing ? "animate-spin text-brand-cyan" : "group-hover:text-brand-cyan"} />
            REFRESH
          </button>
        </div>
      </motion.div>

      {/* ── Tabs ───────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 border-b-2 border-brand-cyan/20 pb-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 text-sm tracking-widest border-2 transition-all ${activeTab === t.id ? "bg-brand-cyan text-black border-brand-cyan shadow-[inset_2px_2px_0px_rgba(255,255,255,0.4)]" : "border-brand-cyan/30 text-brand-cyan/70 hover:border-brand-cyan/60 hover:bg-brand-cyan/5"}`}>
            {t.icon} {t.label}
            {t.count > 0 && <span className={`text-xs px-1.5 py-0.5 ${activeTab === t.id ? "bg-black/30 text-brand-cyan" : "bg-brand-cyan/10 text-brand-cyan/60"}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Search + Sort ──────────────────────────── */}
      {activeTab !== "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-cyan/40" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="SEARCH..." className="w-full bg-black/60 border-2 border-brand-cyan/30 pl-9 pr-4 py-2 text-sm text-brand-cyan placeholder:text-brand-cyan/30 tracking-widest focus:outline-none focus:border-brand-cyan transition-colors" />
          </div>
          <button onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")} className="border-2 border-brand-cyan/30 px-3 py-2 text-sm flex items-center gap-1 hover:border-brand-cyan/60 transition-colors tracking-widest">
            {sortDir === "desc" ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            {sortDir === "desc" ? "NEWEST" : "OLDEST"}
          </button>
          {activeTab === "posts" && (
            <button onClick={initNewPost} className="bg-brand-cyan text-black px-4 py-2 text-sm font-bold tracking-widest hover:bg-white transition-colors uppercase">
              + NEW_ENTRY
            </button>
          )}
          {activeTab === "milestones" && (
            <div className="flex gap-3">
              <button onClick={() => window.open('/journey', '_blank')} className="border-2 border-brand-purple/50 px-4 py-2 text-sm tracking-widest hover:bg-brand-purple/10 text-brand-purple transition-all uppercase font-bold">
                VIEW_JOURNEY_SYS.EXE
              </button>
              <button onClick={initNewMilestone} className="bg-brand-cyan text-black px-4 py-2 text-sm font-bold tracking-widest hover:bg-white transition-colors uppercase">
                + NEW_MILESTONE
              </button>
            </div>
          )}
          {activeTab === "todos" && (
            <button onClick={initNewTodo} className="bg-brand-cyan text-black px-4 py-2 text-sm font-bold tracking-widest hover:bg-white transition-colors uppercase">
              + NEW_TASK
            </button>
          )}
          {activeTab === "goals" && (
            <div className="flex gap-3">
              <button onClick={() => window.open('/goals', '_blank')} className="border-2 border-brand-purple/50 px-4 py-2 text-sm tracking-widest hover:bg-brand-purple/10 text-brand-purple transition-all uppercase font-bold">
                VIEW_GOALS_SYS.EXE
              </button>
              <button onClick={initNewGoal} className="bg-brand-cyan text-black px-4 py-2 text-sm font-bold tracking-widest hover:bg-white transition-colors uppercase">
                + NEW_GOAL
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Loading ────────────────────────────────── */}
      {loading && <div className="text-brand-cyan/50 animate-pulse py-12 text-center text-lg tracking-widest">[ LOADING SYSTEM DATA... ]</div>}

      {/* ── Tab Content ────────────────────────────── */}
      {!loading && (
        <AnimatePresence mode="wait">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "USERS.COUNT", value: analytics?.totalUsers || users.length, icon: <Users size={20} />, accent: "text-brand-cyan" },
                  { label: "POSTS.TOTAL", value: analytics?.totalPosts || posts.length, icon: <FileText size={20} />, accent: "text-brand-cyan" },
                  { label: "GOALS.ACTIVE", value: goals.length, icon: <TrendingUp size={20} />, accent: "text-brand-cyan" },
                  { label: "TODOS.PENDING", value: todos.filter(t => !t.completed).length, icon: <CheckCircle2 size={20} />, accent: "text-brand-purple" },
                ].map((s, i) => (
                  <div key={i} className="border-2 border-brand-cyan/30 p-4 bg-black/50 hover:border-brand-cyan transition-all group">
                    <div className="flex items-center justify-between mb-3 text-brand-cyan/50 text-xs tracking-widest uppercase">
                      <span>{s.label}</span>
                      <span className="group-hover:text-brand-cyan/80 transition-colors">{s.icon}</span>
                    </div>
                    <div className={`text-3xl ${s.accent}`}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="border-2 border-brand-cyan/30 p-5 bg-black/50 space-y-4">
                <h3 className="text-sm tracking-widest text-brand-cyan/60 border-b border-brand-cyan/20 pb-2 flex items-center gap-2"><TrendingUp size={14} /> SYSTEM_BREAKDOWN.LOG</h3>
                <StatBar label="ADMINS" value={analytics?.adminCount || 0} max={analytics?.totalUsers || 1} color="text-brand-purple" />
                <StatBar label="MEMBERS" value={analytics?.memberCount || 0} max={analytics?.totalUsers || 1} color="text-brand-cyan" />
              </div>

              <div className="border-2 border-brand-cyan/30 p-5 bg-black/50">
                <h3 className="text-sm tracking-widest text-brand-cyan/60 border-b border-brand-cyan/20 pb-2 mb-3 flex items-center gap-2"><Clock size={14} /> RECENT_ACTIVITY.LOG</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {[...users, ...posts, ...messages, ...milestones].filter(x => x.createdAt).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-brand-cyan/10 last:border-0 uppercase">
                      <span className="text-brand-cyan/30">{item.role ? <Shield size={12} /> : item.year ? <TrendingUp size={12} /> : item.title ? <FileText size={12} /> : <Mail size={12} />}</span>
                      <span className="text-brand-cyan/80 truncate flex-1">{item.name || item.title}</span>
                      <span className="text-brand-cyan/30 text-xs whitespace-nowrap">{timeAgo(item.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border-2 border-brand-cyan/30 bg-black/50">
              <div className="p-4 border-b border-brand-cyan/20 flex items-center gap-2 text-sm tracking-widest text-brand-cyan/60 uppercase">
                <Users size={16} /> REGISTERED_USERS.DB — {filteredUsers.length} RECORDS
              </div>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-[1.2fr_1.5fr_0.8fr_1fr_0.8fr] gap-3 px-4 py-3 text-brand-cyan/50 text-xs tracking-widest border-b border-brand-cyan/20 min-w-[600px] uppercase">
                   <span>NAME</span> <span>EMAIL</span> <span>ROLE</span> <span>JOINED</span> <span>ACTIONS</span>
                </div>
                {filteredUsers.map((u, i) => (
                  <div key={u.id || i} className="grid grid-cols-[1.2fr_1.5fr_0.8fr_1fr_0.8fr] gap-3 px-4 py-3 text-sm border-b border-brand-cyan/10 hover:bg-brand-cyan/5 items-center min-w-[600px] group uppercase">
                    <span className="truncate">{u.name}</span>
                    <span className="text-brand-cyan/60 truncate">{u.email}</span>
                    <span>
                      <span className={`px-2 py-0.5 border text-[10px] ${u.role === "ADMIN" ? "text-brand-purple border-brand-purple/40 bg-brand-purple/5" : "text-brand-cyan/60 border-brand-cyan/20"}`}>
                        {u.role}
                      </span>
                    </span>
                    <span className="text-brand-cyan/40 text-xs whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <button onClick={() => toggleRole(u.id, u.role)} className="p-1.5 border border-brand-cyan/20 hover:border-brand-cyan hover:bg-brand-cyan/10 transition-colors" title={u.role === "ADMIN" ? "Demote to Member" : "Promote to Admin"}>
                        {u.role === "ADMIN" ? <UserMinus size={14} className="text-brand-purple" /> : <UserPlus size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* POSTS */}
          {activeTab === "posts" && (
            <motion.div key="posts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <div className="text-brand-cyan/50 text-xs tracking-widest uppercase">BLOG_POSTS.DB — {filteredPosts.length} RECORDS</div>
              {filteredPosts.map((p, i) => (
                <div key={p.id || i} className="border-2 border-brand-cyan/20 p-4 bg-black/50 hover:border-brand-cyan/40 transition-all flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0 uppercase">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg text-brand-cyan truncate">&gt; {p.title}</h3>
                      <span className={`text-[10px] px-1.5 border ${p.published ? "border-brand-cyan/40 text-brand-cyan" : "border-brand-purple/40 text-brand-purple"}`}>
                        {p.published ? "LIVE" : "DRAFT"}
                      </span>
                    </div>
                    <div className="text-brand-cyan/40 text-xs flex gap-4">
                      <span>{timeAgo(p.createdAt)}</span>
                      <span>CAT: {p.category || "GENERAL"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingPost(p)} className="p-2 border border-brand-cyan/30 hover:border-brand-cyan hover:bg-brand-cyan/10 text-brand-cyan transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => setPostToDelete(p.id)} className="p-2 border border-red-900/50 hover:border-red-500 hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* MILESTONES */}
          {activeTab === "milestones" && (
            <motion.div key="milestones" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <div className="text-brand-cyan/50 text-xs tracking-widest uppercase">JOURNEY_MILESTONES.DB — {filteredMilestones.length} RECORDS</div>
              {filteredMilestones.map((m, i) => (
                <div key={m.id || i} className="border-2 border-brand-cyan/20 p-4 bg-black/50 hover:border-brand-cyan/40 transition-all flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0 uppercase">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg text-brand-cyan truncate">&gt; {m.title}</h3>
                      <span className={`text-[10px] px-1.5 border ${m.active ? "border-brand-purple/40 text-brand-purple" : "border-brand-cyan/20 text-brand-cyan/40"}`}>
                        {m.active ? "ACTIVE" : "HISTORICAL"}
                      </span>
                    </div>
                    <div className="text-brand-cyan/40 text-xs flex gap-4">
                      <span className="text-brand-cyan font-bold">{m.year}</span>
                      <span className="truncate">{m.description}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingMilestone(m)} className="p-2 border border-brand-cyan/30 hover:border-brand-cyan hover:bg-brand-cyan/10 text-brand-cyan transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => setMilestoneToDelete(m.id)} className="p-2 border border-red-900/50 hover:border-red-500 hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TODOS */}
          {activeTab === "todos" && (
            <motion.div key="todos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <div className="text-brand-cyan/50 text-xs tracking-widest uppercase">TODO_TASKS.DB — {filteredTodos.length} RECORDS</div>
              {filteredTodos.map((t, i) => (
                <div key={t.id || i} className="border-2 border-brand-cyan/20 p-4 bg-black/50 hover:border-brand-cyan/40 transition-all flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => toggleTodo(t)} className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${t.completed ? "bg-brand-cyan border-brand-cyan text-black" : "border-brand-cyan/40 text-transparent hover:border-brand-cyan"}`}>
                      {t.completed && <CheckCircle2 size={14} />}
                    </button>
                    <span className={`text-lg transition-all uppercase ${t.completed ? "text-brand-cyan/30 line-through" : "text-brand-cyan"}`}>{t.task}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingTodo(t)} className="p-2 border border-brand-cyan/30 hover:border-brand-cyan hover:bg-brand-cyan/10 text-brand-cyan transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => setTodoToDelete(t.id)} className="p-2 border border-red-900/50 hover:border-red-500 hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* GOALS */}
          {activeTab === "goals" && (
            <motion.div key="goals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <div className="text-brand-cyan/50 text-xs tracking-widest uppercase">GOAL_OBJECTIVES.DB — {filteredGoals.length} RECORDS</div>
              {filteredGoals.map((g, i) => (
                <div key={g.id || i} className="border-2 border-brand-cyan/20 p-4 bg-black/50 hover:border-brand-cyan/40 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="uppercase">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg text-brand-cyan truncate">&gt; {g.title}</h3>
                        <span className={`text-[10px] px-1.5 border ${g.status === "COMPLETED" ? "border-brand-cyan/40 text-brand-cyan" : "border-brand-purple/40 text-brand-purple"}`}>
                          {g.status}
                        </span>
                      </div>
                      <div className="text-brand-cyan/40 text-xs">{g.month}/{g.year} — {g.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingGoal(g)} className="p-2 border border-brand-cyan/30 hover:border-brand-cyan hover:bg-brand-cyan/10 text-brand-cyan transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => setGoalToDelete(g.id)} className="p-2 border border-red-900/50 hover:border-red-500 hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-brand-cyan/40 uppercase">
                      <span>PROGRESS</span>
                      <span>{g.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-black border border-brand-cyan/20">
                      <div className="h-full bg-brand-cyan transition-all duration-500" style={{ width: `${g.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* MESSAGES */}
          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <div className="text-brand-purple/50 text-xs tracking-widest uppercase">INBOX_MESSAGES.LOG — {filteredMessages.length} RECORDS</div>
              {filteredMessages.map((m, i) => (
                <div key={m.id || i} className="border-2 border-brand-purple/20 bg-black/50 overflow-hidden uppercase">
                  <button onClick={() => setExpandedMsg(expandedMsg === i ? null : i)} className="w-full p-4 text-left flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={14} className="text-brand-purple/60" />
                      <span className="text-brand-purple">{m.name}</span>
                      <span className="text-brand-purple/30 text-xs truncate">&lt;{m.email}&gt;</span>
                    </div>
                    <ChevronDown size={14} className={`text-brand-purple/40 transition-transform ${expandedMsg === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedMsg === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="border-t border-brand-purple/20 bg-brand-purple/5">
                        <div className="p-4 text-sm text-brand-cyan/70 whitespace-pre-wrap leading-relaxed">{m.content}</div>
                        <div className="px-4 pb-3 text-[10px] text-brand-purple/30 text-right">{new Date(m.createdAt).toLocaleString()}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Edit/Create Post Modal ─────────────────── */}
      <AnimatePresence>
        {editingPost && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingPost(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-brand-dark border-2 border-brand-cyan shadow-[0_0_50px_rgba(167,139,250,0.2)] overflow-hidden rounded-lg">
              <div className="bg-brand-cyan text-black px-4 py-2 flex items-center justify-between font-vt323 tracking-widest text-lg uppercase">
                <span>&gt; {editingPost.id ? "EDIT_POST" : "CREATE_POST"}</span>
                <button onClick={() => setEditingPost(null)}><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar uppercase">
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-cyan/60 tracking-widest">TITLE</label>
                  <input type="text" value={editingPost.title} onChange={(e) => setEditingPost({...editingPost, title: e.target.value})} className="w-full bg-black/40 border border-brand-cyan/30 p-2 text-brand-cyan focus:outline-none focus:border-brand-cyan" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-cyan/60 tracking-widest">CATEGORY</label>
                    <input type="text" value={editingPost.category} onChange={(e) => setEditingPost({...editingPost, category: e.target.value})} className="w-full bg-black/40 border border-brand-cyan/30 p-2 text-brand-cyan focus:outline-none focus:border-brand-cyan" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-cyan/60 tracking-widest">STATUS</label>
                    <select value={editingPost.published ? "true" : "false"} onChange={(e) => setEditingPost({...editingPost, published: e.target.value === "true"})} className="w-full bg-black/40 border border-brand-cyan/30 p-2 text-brand-cyan focus:outline-none focus:border-brand-cyan">
                      <option value="true">PUBLISHED</option>
                      <option value="false">DRAFT</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-cyan/60 tracking-widest">CONTENT</label>
                  <textarea rows={10} value={editingPost.content} onChange={(e) => setEditingPost({...editingPost, content: e.target.value})} className="w-full bg-black/40 border border-brand-cyan/30 p-2 text-brand-cyan focus:outline-none focus:border-brand-cyan font-mono text-sm" />
                </div>
              </div>
              <div className="p-4 bg-brand-cyan/5 border-t border-brand-cyan/20 flex justify-end gap-3">
                <button onClick={() => setEditingPost(null)} className="px-6 py-2 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/10 uppercase text-sm">CANCEL</button>
                <button onClick={() => savePost(editingPost)} className="px-6 py-2 bg-brand-cyan text-black hover:bg-white transition-colors flex items-center gap-2 text-sm font-bold">
                  <Save size={16} /> SAVE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit/Create Milestone Modal ────────────────── */}
      <AnimatePresence>
        {editingMilestone && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingMilestone(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-brand-dark border-2 border-brand-purple shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden rounded-lg">
              <div className="bg-brand-purple text-black px-4 py-2 flex items-center justify-between font-vt323 tracking-widest text-lg uppercase">
                <span>&gt; {editingMilestone.id ? "EDIT_MILESTONE" : "CREATE_MILESTONE"}</span>
                <button onClick={() => setEditingMilestone(null)}><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4 uppercase">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-purple/60 tracking-widest">YEAR_STAMP</label>
                    <input type="text" value={editingMilestone.year} onChange={(e) => setEditingMilestone({...editingMilestone, year: e.target.value})} className="w-full bg-black/40 border border-brand-purple/30 p-2 text-brand-purple focus:outline-none focus:border-brand-purple" placeholder="YYYY" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-purple/60 tracking-widest">SYSTEM_STATE</label>
                    <select value={editingMilestone.active ? "true" : "false"} onChange={(e) => setEditingMilestone({...editingMilestone, active: e.target.value === "true"})} className="w-full bg-black/40 border border-brand-purple/30 p-2 text-brand-purple focus:outline-none focus:border-brand-purple">
                      <option value="true">ACTIVE_NOW</option>
                      <option value="false">HISTORICAL</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-purple/60 tracking-widest">EVENT_TITLE</label>
                  <input type="text" value={editingMilestone.title} onChange={(e) => setEditingMilestone({...editingMilestone, title: e.target.value})} className="w-full bg-black/40 border border-brand-purple/30 p-2 text-brand-purple focus:outline-none focus:border-brand-purple" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-purple/60 tracking-widest">DESCRIPTION_LOG</label>
                  <textarea rows={4} value={editingMilestone.description} onChange={(e) => setEditingMilestone({...editingMilestone, description: e.target.value})} className="w-full bg-black/40 border border-brand-purple/30 p-2 text-brand-purple focus:outline-none focus:border-brand-purple font-vt323 text-lg leading-relaxed" />
                </div>
              </div>
              <div className="p-4 bg-brand-purple/5 border-t border-brand-purple/20 flex justify-end gap-3">
                <button onClick={() => setEditingMilestone(null)} className="px-6 py-2 border border-brand-purple/30 text-brand-purple hover:bg-brand-purple/10 uppercase text-sm">CANCEL</button>
                <button onClick={() => saveMilestone(editingMilestone)} className="px-6 py-2 bg-brand-purple text-black hover:bg-white transition-colors flex items-center gap-2 text-sm font-bold">
                  <Save size={16} /> COMMIT_MILESTONE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit/Create Todo Modal ──────────────────── */}
      <AnimatePresence>
        {editingTodo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingTodo(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-brand-dark border-2 border-brand-cyan shadow-[0_0_50px_rgba(167,139,250,0.2)] overflow-hidden rounded-lg">
              <div className="bg-brand-cyan text-black px-4 py-2 flex items-center justify-between font-vt323 tracking-widest text-lg uppercase">
                <span>&gt; {editingTodo.id ? "EDIT_TASK" : "CREATE_TASK"}</span>
                <button onClick={() => setEditingTodo(null)}><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4 uppercase">
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-cyan/60 tracking-widest">TASK_CONTENT</label>
                  <input type="text" value={editingTodo.task} onChange={(e) => setEditingTodo({...editingTodo, task: e.target.value})} className="w-full bg-black/40 border border-brand-cyan/30 p-2 text-brand-cyan focus:outline-none focus:border-brand-cyan" />
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setEditingTodo({...editingTodo, completed: !editingTodo.completed})} className={`w-5 h-5 border flex items-center justify-center ${editingTodo.completed ? "bg-brand-cyan border-brand-cyan text-black" : "border-brand-cyan/30 text-transparent"}`}>
                    <CheckCircle2 size={12} />
                  </button>
                  <span className="text-sm tracking-widest text-brand-cyan/80">COMPLETED</span>
                </div>
              </div>
              <div className="p-4 bg-brand-cyan/5 border-t border-brand-cyan/20 flex justify-end gap-3">
                <button onClick={() => setEditingTodo(null)} className="px-6 py-2 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/10 uppercase text-sm">CANCEL</button>
                <button onClick={() => saveTodo(editingTodo)} className="px-6 py-2 bg-brand-cyan text-black hover:bg-white transition-colors flex items-center gap-2 text-sm font-bold uppercase">
                  <Save size={16} /> COMMIT_TASK
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit/Create Goal Modal ──────────────────── */}
      <AnimatePresence>
        {editingGoal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingGoal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-xl bg-brand-dark border-2 border-brand-cyan shadow-[0_0_50px_rgba(167,139,250,0.2)] overflow-hidden rounded-lg">
              <div className="bg-brand-cyan text-black px-4 py-2 flex items-center justify-between font-vt323 tracking-widest text-lg uppercase">
                <span>&gt; {editingGoal.id ? "EDIT_GOAL" : "INITIALIZE_GOAL"}</span>
                <button onClick={() => setEditingGoal(null)}><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar uppercase">
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-cyan/60 tracking-widest">GOAL_TITLE</label>
                  <input type="text" value={editingGoal.title} onChange={(e) => setEditingGoal({...editingGoal, title: e.target.value})} className="w-full bg-black/40 border border-brand-cyan/30 p-2 text-brand-cyan focus:outline-none focus:border-brand-cyan" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-cyan/60 tracking-widest">MONTH (1-12)</label>
                    <input type="number" value={editingGoal.month} onChange={(e) => setEditingGoal({...editingGoal, month: parseInt(e.target.value)})} className="w-full bg-black/40 border border-brand-cyan/30 p-2 text-brand-cyan focus:outline-none focus:border-brand-cyan" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-cyan/60 tracking-widest">YEAR</label>
                    <input type="number" value={editingGoal.year} onChange={(e) => setEditingGoal({...editingGoal, year: parseInt(e.target.value)})} className="w-full bg-black/40 border border-brand-cyan/30 p-2 text-brand-cyan focus:outline-none focus:border-brand-cyan" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-cyan/60 tracking-widest">STATUS</label>
                    <select value={editingGoal.status} onChange={(e) => setEditingGoal({...editingGoal, status: e.target.value})} className="w-full bg-black/40 border border-brand-cyan/30 p-2 text-brand-cyan focus:outline-none focus:border-brand-cyan">
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-cyan/60 tracking-widest">PROGRESS ({editingGoal.progress}%)</label>
                    <input type="range" min="0" max="100" value={editingGoal.progress} onChange={(e) => setEditingGoal({...editingGoal, progress: parseInt(e.target.value)})} className="w-full h-8 accent-brand-cyan bg-black/40" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-cyan/60 tracking-widest">DESCRIPTION</label>
                  <textarea rows={3} value={editingGoal.description} onChange={(e) => setEditingGoal({...editingGoal, description: e.target.value})} className="w-full bg-black/40 border border-brand-cyan/30 p-2 text-brand-cyan focus:outline-none focus:border-brand-cyan" />
                </div>
              </div>
              <div className="p-4 bg-brand-cyan/5 border-t border-brand-cyan/20 flex justify-end gap-3">
                <button onClick={() => setEditingGoal(null)} className="px-6 py-2 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/10 uppercase text-sm">CANCEL</button>
                <button onClick={() => saveGoal(editingGoal)} className="px-6 py-2 bg-brand-cyan text-black hover:bg-white transition-colors flex items-center gap-2 text-sm font-bold uppercase">
                  <Save size={16} /> COMMIT_GOAL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ──────────────── */}
      <AnimatePresence>
        {(postToDelete || milestoneToDelete || todoToDelete || goalToDelete) && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setPostToDelete(null); setMilestoneToDelete(null); setTodoToDelete(null); setGoalToDelete(null); }} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm border-2 border-red-500 bg-black p-6 space-y-6 uppercase">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle size={32} />
                <h2 className="text-xl tracking-widest">CRITICAL_ACTION_REQUIRED</h2>
              </div>
              <p className="text-red-200/70 text-sm tracking-widest leading-relaxed">
                ARE YOU SURE YOU WANT TO PURGE THIS RESOURCE? THIS ACTION CANNOT BE UNDONE.
              </p>
              <div className="flex gap-3">
                <button onClick={() => { setPostToDelete(null); setMilestoneToDelete(null); setTodoToDelete(null); setGoalToDelete(null); }} className="flex-1 py-2 border-2 border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/10 tracking-widest text-xs">
                  ABORT
                </button>
                <button onClick={() => {
                  if (postToDelete) confirmDeletePost();
                  else if (milestoneToDelete) confirmDeleteMilestone();
                  else if (todoToDelete) confirmDeleteTodo();
                  else if (goalToDelete) confirmDeleteGoal();
                }} disabled={!!isDeleting} className="flex-1 py-2 bg-red-600 text-white hover:bg-red-500 font-bold tracking-widest text-xs flex items-center justify-center gap-2">
                  {isDeleting ? <RefreshCw size={14} className="animate-spin" /> : "PURGE_ENTRY"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
