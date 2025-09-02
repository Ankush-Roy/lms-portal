import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ====================== Config ====================== */
// Your chatbot page (ensure it allows this origin in frame-ancestors)
const CHATBOT_IFRAME_SRC = "https://chatbot-interrait.eastus.cloudapp.azure.com/";

/* ====================== Demo Data ====================== */
const sampleCourses = [
  { id: "C001", title: "Introduction to Data Privacy", category: "Compliance", duration: "2h 15m", status: "In Progress", progress: 45, dueDate: "2025-09-15" },
  { id: "C002", title: "Advanced Excel for Analysts", category: "Productivity", duration: "3h 40m", status: "Not Started", progress: 0, dueDate: "2025-09-30" },
  { id: "C003", title: "Generative AI Fundamentals", category: "Technology", duration: "1h 50m", status: "Completed", progress: 100, dueDate: "2025-08-18" },
  { id: "C004", title: "Secure Coding in Java", category: "Technology", duration: "2h 20m", status: "In Progress", progress: 60, dueDate: "2025-09-08" },
  { id: "C005", title: "Inclusive Leadership", category: "Leadership", duration: "1h 35m", status: "Not Started", progress: 0, dueDate: "2025-10-05" },
];

const samplePaths = [
  { id: "LP-101", name: "New Manager Onboarding", courses: 6, completion: 66, owner: "HR Academy", deadline: "2025-10-10" },
  { id: "LP-202", name: "Data Analyst Growth Path", courses: 9, completion: 22, owner: "Analytics CoE", deadline: "2025-12-01" },
];

/* ====================== Icons (inline SVG) ====================== */
const Icon = {
  Menu: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Search: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Sun: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Moon: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M21 12.79A9 9 0 1111.21 3A7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Play: (props) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M8 5v14l11-7-11-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ====================== Small bits ====================== */
function Background() {
  // gradient blobs + subtle grid
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_50%_-10%,rgba(99,102,241,0.18),transparent),radial-gradient(40rem_30rem_at_80%_120%,rgba(16,185,129,0.15),transparent)]" />
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-slate-300/40 dark:text-slate-600/40" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);
  return [isDark, setIsDark];
}

/* ====================== UI Atoms ====================== */
function Pill({ active }) {
  return <span className={`absolute left-2 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-full ${active ? "bg-indigo-500" : "bg-transparent"}`} />;
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_8px_30px_rgba(0,0,0,0.06)] " +
        className
      }
    >
      {children}
    </div>
  );
}

function GradientNumber({ children }) {
  return <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-sky-400">{children}</span>;
}

function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
      />
    </div>
  );
}

/* ====================== Header + Nav ====================== */
function TopBar({ onToggleSidebar, onToggleTheme, isDark }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-4 md:px-6
      bg-white/60 dark:bg-slate-950/60 backdrop-blur border-b border-slate-200/70 dark:border-slate-800/70">
      <div className="flex items-center gap-3">
        <button
          className="inline-flex md:hidden items-center justify-center rounded-xl border border-slate-300/60 dark:border-slate-700/60 px-2.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Icon.Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">LMS Portal</h1>
        <span className="hidden md:inline-block text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
          Pro
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-300/70 dark:border-slate-700/70 px-3 py-2 text-sm
          bg-white/70 dark:bg-slate-900/40">
          <Icon.Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <input
            type="search"
            placeholder="Search courses, paths, skills…"
            className="bg-transparent outline-none w-72 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
          />
          <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">Ctrl ⌃ /</span>
        </div>

        <button
          onClick={onToggleTheme}
          title="Toggle theme"
          className="ml-1 rounded-xl border border-slate-300/70 dark:border-slate-700/70 px-2.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          {isDark ? <Icon.Sun className="w-5 h-5" /> : <Icon.Moon className="w-5 h-5" />}
        </button>

        <img
          src={"https://i.pravatar.cc/40?img=3"}
          alt="avatar"
          className="ml-1 w-9 h-9 rounded-xl border border-white/60 shadow"
        />
      </div>
    </div>
  );
}

function Sidebar({ open, currentTab, setCurrentTab }) {
  const nav = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "courses", label: "My Courses", icon: "📚" },
    { key: "paths", label: "Learning Paths", icon: "🧭" },
    { key: "progress", label: "My Progress", icon: "📈" },
    { key: "admin", label: "Admin", icon: "🛠️" },
  ];
  return (
    <AnimatePresence>
      {(open || typeof window !== "undefined") && (
        <motion.aside
          initial={{ x: -220 }}
          animate={{ x: 0 }}
          exit={{ x: -220 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className={`fixed md:static left-0 top-14 md:top-0 z-20 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] w-64
            p-4 md:pt-6 border-r border-slate-200/70 dark:border-slate-800/70
            bg-white/70 dark:bg-slate-950/40 backdrop-blur ${open ? "block" : "hidden md:block"}`}
        >
          <nav className="space-y-1 relative">
            {nav.map((n) => {
              const active = currentTab === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => setCurrentTab(n.key)}
                  className={`relative w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all
                    ${active
                      ? "bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/40"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900/40 border border-transparent"}`}
                >
                  <Pill active={active} />
                  <span className="text-lg">{n.icon}</span>
                  <span>{n.label}</span>
                </button>
              );
            })}
          </nav>

          <GlassCard className="mt-6 p-4 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold mb-1">Tip</p>
            <p>Use the copilot to summarize a course, generate a study plan, or get SQL for analytics on completions.</p>
          </GlassCard>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

/* ====================== Widgets ====================== */
function StatCard({ title, value, sub, trend = [6, 8, 7, 10, 12, 11, 13] }) {
  const path = trend
    .map((v, i) => `${(i / (trend.length - 1)) * 100},${100 - (v / Math.max(...trend)) * 100}`)
    .join(" ");
  return (
    <GlassCard className="p-5 hover:shadow-lg transition-shadow">
      <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          <GradientNumber>{value}</GradientNumber>
        </p>
        {/* Tiny sparkline */}
        <svg viewBox="0 0 100 40" className="w-24 h-10">
          <polyline
            fill="none"
            vectorEffect="non-scaling-stroke"
            points={path}
            className="stroke-indigo-500/80"
            strokeWidth="2"
          />
        </svg>
      </div>
      {sub && <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">{sub}</p>}
    </GlassCard>
  );
}

function CourseCard({ c }) {
  return (
    <GlassCard className="p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{c.category}</p>
        <span className="text-xs rounded-full px-2 py-0.5 border border-slate-200/70 dark:border-slate-700/70 text-slate-500 dark:text-slate-400">
          {c.duration}
        </span>
      </div>
      <h4 className="font-semibold text-lg mt-1 text-slate-900 dark:text-white">{c.title}</h4>
      <div className="mt-4">
        <ProgressBar value={c.progress} />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Due {c.dueDate}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-600 px-3.5 py-2 text-xs text-white font-semibold hover:brightness-110">
          <Icon.Play className="w-4 h-4" /> Resume
        </button>
        <button className="rounded-lg border border-slate-300/70 dark:border-slate-700/70 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
          Details
        </button>
      </div>
    </GlassCard>
  );
}

function CoursesTable({ courses }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("dueDateAsc");

  const filtered = useMemo(() => {
    const t = courses.filter((c) => {
      const hit =
        c.title.toLowerCase().includes(q.toLowerCase()) ||
        c.category.toLowerCase().includes(q.toLowerCase());
      const statOk = status === "all" ? true : c.status === status;
      return hit && statOk;
    });
    const by = {
      dueDateAsc: (a, b) => a.dueDate.localeCompare(b.dueDate),
      dueDateDesc: (a, b) => b.dueDate.localeCompare(a.dueDate),
      titleAsc: (a, b) => a.title.localeCompare(b.title),
    }[sort];
    return [...t].sort(by);
  }, [courses, q, status, sort]);

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 rounded-xl border border-slate-300/70 dark:border-slate-700/70 px-3 py-2 bg-white/70 dark:bg-slate-900/40">
            <Icon.Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <input
              type="search"
              placeholder="Search courses…"
              className="bg-transparent outline-none w-56 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-300/70 dark:border-slate-700/70 px-3 py-2 text-sm bg-white/70 dark:bg-slate-900/40"
          >
            <option value="all">All Status</option>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-300/70 dark:border-slate-700/70 px-3 py-2 text-sm bg-white/70 dark:bg-slate-900/40"
          >
            <option value="dueDateAsc">Due Date ↑</option>
            <option value="dueDateDesc">Due Date ↓</option>
            <option value="titleAsc">Title A–Z</option>
          </select>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{filtered.length} results</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wide">
              <th className="py-2 pr-3">Course</th>
              <th className="py-2 pr-3">Category</th>
              <th className="py-2 pr-3">Duration</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Progress</th>
              <th className="py-2 pr-3">Due</th>
              <th className="py-2 pr-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="bg-white/80 dark:bg-slate-900/60 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <td className="py-4 px-3 rounded-l-xl font-medium text-slate-800 dark:text-slate-100">{c.title}</td>
                <td className="py-4 px-3 text-slate-600 dark:text-slate-300">{c.category}</td>
                <td className="py-4 px-3 text-slate-600 dark:text-slate-300">{c.duration}</td>
                <td className="py-4 px-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                    ${
                      c.status === "Completed"
                        ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : c.status === "In Progress"
                        ? "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        : "bg-slate-100/80 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="py-4 px-3 w-48">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={c.progress} />
                    <span className="w-10 text-right tabular-nums text-sm font-medium text-slate-700 dark:text-slate-200">{c.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-3 tabular-nums text-slate-600 dark:text-slate-300">{c.dueDate}</td>
                <td className="py-4 px-3 rounded-r-xl">
                  <button className="rounded-lg border border-slate-300/70 dark:border-slate-700/70 px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                    Continue
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function PathsGrid({ paths }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {paths.map((p) => (
        <GlassCard key={p.id} className="p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{p.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Owner: {p.owner}</p>
            </div>
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">ID: {p.id}</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Courses: <b>{p.courses}</b>
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Deadline: <span className="tabular-nums">{p.deadline}</span>
              </p>
            </div>
            <div className="w-40">
              <ProgressBar value={p.completion} />
              <p className="mt-1 text-xs text-right tabular-nums font-semibold text-slate-700 dark:text-slate-200">{p.completion}%</p>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-sm text-white font-semibold hover:brightness-110">
              Open Path
            </button>
            <button className="rounded-xl border border-slate-300/70 dark:border-slate-700/70 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
              View Courses
            </button>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function Dashboard({ courses }) {
  const inProgressCourses = courses.filter((c) => c.status === "In Progress").slice(0, 2);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Active Courses" value="12" sub="2 due this week" trend={[4, 5, 7, 6, 8, 11, 12]} />
        <StatCard title="Completed" value="34" sub="All time" trend={[10, 11, 13, 12, 16, 17, 18]} />
        <StatCard title="Learning Paths" value="3" sub="1 in progress" trend={[2, 2, 3, 3, 3, 3, 3]} />
        <StatCard title="Avg. Weekly Time" value="3h 20m" sub="last 4 weeks" trend={[2, 3, 3, 4, 3, 4, 3]} />
      </div>

      <GlassCard className="p-6">
        <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">Continue where you left off</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {inProgressCourses.map((c) => (
            <CourseCard key={c.id} c={c} />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ====================== Chat Drawer ====================== */
function ChatSlideOver({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
        >
          {/* dim background */}
          <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

          {/* panel */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="
              absolute right-0 top-0 h-full w-full sm:w-[520px]
              bg-white shadow-2xl border-l border-slate-200
              flex flex-col rounded-none sm:rounded-l-2xl overflow-hidden
            "
          >
            {/* slim header */}
            <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-semibold">LMS Chatbot</h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {/* iframe fills the rest */}
            <div className="flex-1 min-h-0">
              <iframe
                title="LMS Chatbot"
                src={CHATBOT_IFRAME_SRC + (CHATBOT_IFRAME_SRC.includes('?') ? '&' : '?') + 'embed=1'}
                className="w-full h-full block"
                allow="clipboard-write"
                style={{ border: 0 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ====================== Page ====================== */
export default function LmsPortal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [isDark, setIsDark] = useDarkMode();

  return (
    <div className="min-h-screen pt-14 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
      <Background />
      <TopBar
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        onToggleTheme={() => setIsDark((d) => !d)}
        isDark={isDark}
      />

      <div className="flex">
        <Sidebar open={sidebarOpen} currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentTab === "dashboard" && <Dashboard courses={sampleCourses} />}
            {currentTab === "courses" && <CoursesTable courses={sampleCourses} />}
            {currentTab === "paths" && <PathsGrid paths={samplePaths} />}
            {currentTab === "progress" && (
              <GlassCard className="p-8 text-sm">
                <h3 className="font-semibold text-xl mb-3 text-slate-900 dark:text-white">My Progress</h3>
                <p className="text-slate-600 dark:text-slate-300">Visualizations for completions by month, hours learned, badges… (hook your charts here)</p>
              </GlassCard>
            )}
            {currentTab === "admin" && (
              <GlassCard className="p-8 text-sm">
                <h3 className="font-semibold text-xl mb-3 text-slate-900 dark:text-white">Admin</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-200">
                  <li>Upload SCORM/xAPI packages</li>
                  <li>Manage users & enrollments</li>
                  <li>Create learning paths</li>
                  <li>Reports & compliance exports</li>
                </ul>
              </GlassCard>
            )}
          </div>
        </main>
      </div>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 6px 16px rgba(99,102,241,0.45)" }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setChatOpen(true)}
        className="fixed bottom-5 right-5 rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-sky-600 text-white px-6 py-4 text-sm font-semibold"
      >
        IICA
      </motion.button>

      <ChatSlideOver open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
