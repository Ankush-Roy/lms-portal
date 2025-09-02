import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHATBOT_IFRAME_SRC = "http://localhost:5000/chat?embed=1";

const sampleCourses = [
  { id:"C001", title:"Introduction to Data Privacy", category:"Compliance", duration:"2h 15m", status:"In Progress", progress:45, dueDate:"2025-09-15", hero:"#8b5cf6" },
  { id:"C004", title:"Secure Coding in Java", category:"Technology", duration:"2h 20m", status:"In Progress", progress:60, dueDate:"2025-09-08", hero:"#06b6d4" },
  { id:"C003", title:"Generative AI Fundamentals", category:"Technology", duration:"1h 50m", status:"Completed", progress:100, dueDate:"2025-08-18", hero:"#22c55e" },
  { id:"C005", title:"Inclusive Leadership", category:"Leadership", duration:"1h 35m", status:"Not Started", progress:0, dueDate:"2025-10-05", hero:"#f59e0b" },
];

const samplePaths = [
  { id:"LP-101", name:"New Manager Onboarding", courses:6, completion:66, owner:"HR Academy", deadline:"2025-10-10" },
  { id:"LP-202", name:"Data Analyst Growth Path", courses:9, completion:22, owner:"Analytics CoE", deadline:"2025-12-01" },
];

function useDarkMode(){
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return [dark, setDark];
}

function TopBar({ onToggleSidebar, onOpenChat }){
  const [dark, setDark] = useDarkMode();
  return (
    <div className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/60 backdrop-blur border-b border-slate-200/70 dark:border-slate-800/80">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="inline-flex md:hidden items-center justify-center rounded-xl border border-slate-300/70 dark:border-slate-700 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800" onClick={onToggleSidebar}>☰</button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-soft" />
            <h1 className="text-lg md:text-xl font-semibold tracking-tight">Learning Management System</h1>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">Modern</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center rounded-xl border border-slate-300/70 dark:border-slate-700 px-2">
            <span className="px-2 opacity-60">🔎</span>
            <input className="bg-transparent outline-none text-sm w-72 py-2" placeholder="Search courses, paths, skills…" />
          </div>
          <button onClick={() => setDark(v=>!v)} className="rounded-xl border border-slate-300/70 dark:border-slate-700 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">{dark ? "🌙" : "☀️"}</button>
          <button onClick={onOpenChat} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-white text-sm shadow-soft hover:bg-indigo-700">
            <span className="i-lucide-message-circle" aria-hidden /> Chat
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ open, currentTab, setCurrentTab }){
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
          initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -16, opacity: 0 }} transition={{ duration: 0.2 }}
          className={`fixed md:static left-0 top-12 md:top-0 z-20 h-[calc(100vh-3rem)] md:h-[100vh] w-68 bg-white/70 dark:bg-slate-900/60 backdrop-blur
                      border-r border-slate-200/70 dark:border-slate-800/80 p-3 ${open ? "block" : "hidden md:block"}`}
        >
          <div className="space-y-1">
            {nav.map(n => (
              <button key={n.key} onClick={() => setCurrentTab(n.key)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition
                ${currentTab === n.key ? "bg-gradient-to-r from-indigo-600/10 to-fuchsia-600/10 border border-indigo-200/60 dark:border-indigo-900/40" : "border border-transparent"}`}>
                <span>{n.icon}</span><span>{n.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300/70 dark:border-slate-700/70 p-3 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold mb-1">Tip</p>
            <p>Use the chatbot to summarize a course, generate a study plan, or get SQL for analytics on completions.</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function StatCard({ title, value, sub }){
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-soft bg-white/70 dark:bg-slate-900/60 backdrop-blur">
      <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {sub && <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  );
}

function ProgressBar({ value, accent="indigo" }){
  return (
    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <div className={`h-2 bg-${accent}-600`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function CourseCard({ c }){
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 shadow-soft bg-white/70 dark:bg-slate-900/60 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl shadow-soft" style={{background: `linear-gradient(135deg, ${c.hero}, #6366f1)`}} />
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{c.category} • {c.duration}</p>
          <h4 className="font-semibold mt-0.5">{c.title}</h4>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-2 bg-indigo-600" style={{ width: `${c.progress}%` }} />
          </div>
          <span className="w-10 text-right tabular-nums text-xs">{c.progress}%</span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Due {c.dueDate}</p>
      </div>
      <div className="mt-3">
        <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700">Resume</button>
      </div>
    </motion.div>
  );
}

function CoursesTable({ courses }){
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("dueDateAsc");

  const filtered = useMemo(() => {
    const t = courses.filter(c => {
      const hit = c.title.toLowerCase().includes(q.toLowerCase()) || c.category.toLowerCase().includes(q.toLowerCase());
      const statOk = status === "all" ? true : c.status === status;
      return hit && statOk;
    });
    const by = {
      dueDateAsc: (a,b)=>a.dueDate.localeCompare(b.dueDate),
      dueDateDesc:(a,b)=>b.dueDate.localeCompare(a.dueDate),
      titleAsc:(a,b)=>a.title.localeCompare(b.title),
    }[sort];
    return [...t].sort(by);
  }, [courses,q,status,sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input type="search" placeholder="Search courses…" className="rounded-xl border border-slate-300/70 dark:border-slate-700 px-3 py-2 text-sm w-64 bg-white/80 dark:bg-slate-900/60" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border border-slate-300/70 dark:border-slate-700 px-2 py-2 text-sm bg-white/80 dark:bg-slate-900/60">
          <option value="all">All Status</option><option>Not Started</option><option>In Progress</option><option>Completed</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="rounded-xl border border-slate-300/70 dark:border-slate-700 px-2 py-2 text-sm bg-white/80 dark:bg-slate-900/60">
          <option value="dueDateAsc">Due Date ↑</option><option value="dueDateDesc">Due Date ↓</option><option value="titleAsc">Title A–Z</option>
        </select>
        <div className="text-xs text-slate-500 dark:text-slate-400 ml-auto">{filtered.length} results</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => <CourseCard key={c.id} c={c} />)}
      </div>
    </div>
  );
}

function Dashboard(){
  const inProgress = sampleCourses.filter(c => c.status === "In Progress").slice(0,2);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active Courses" value="12" sub="2 due this week" />
        <StatCard title="Completed" value="34" sub="All time" />
        <StatCard title="Learning Paths" value="3" sub="1 in progress" />
        <StatCard title="Avg. Weekly Time" value="3h 20m" sub="last 4 weeks" />
      </div>

      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 p-4 shadow-soft backdrop-blur">
        <h3 className="font-semibold mb-3">Continue where you left off</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inProgress.map(c => <CourseCard key={c.id} c={c} />)}
        </div>
      </div>
    </div>
  );
}

function ChatSlideOver({ open, onClose }){
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type:"spring", stiffness:280, damping:28 }}
            className="absolute right-0 top-0 h-full w-full sm:w-[540px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-semibold">LMS Copilot</h3>
              </div>
              <button onClick={onClose} className="rounded-md border border-slate-300 dark:border-slate-700 px-2 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">Close</button>
            </div>
            <div className="flex-1 min-h-0">
              <iframe title="LMS Copilot" src={CHATBOT_IFRAME_SRC} className="w-full h-full block" allow="clipboard-write" style={{border:0}} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LmsPortal(){
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 bg-radial-fade">
      <TopBar onToggleSidebar={() => setSidebarOpen(s=>!s)} onOpenChat={() => setChatOpen(true)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <main className="flex-1 p-4 md:p-6 md:ml-0 md:mt-0 mt-12">
          <div className="max-w-[1200px] mx-auto space-y-5">
            {currentTab === "dashboard" && <Dashboard />}
            {currentTab === "courses" && <CoursesTable courses={sampleCourses} />}
            {currentTab === "paths" && (
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 p-5 shadow-soft backdrop-blur">
                <h3 className="font-semibold mb-3">Learning Paths</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {samplePaths.map(p => (
                    <motion.div key={p.id} whileHover={{ y:-2 }} className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 bg-white/70 dark:bg-slate-900/60 shadow-soft">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{p.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Owner: {p.owner}</p>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">ID: {p.id}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm">Courses: <b>{p.courses}</b></p>
                          <p className="text-sm">Deadline: <span className="tabular-nums">{p.deadline}</span></p>
                        </div>
                        <div className="w-40">
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-2 bg-fuchsia-600" style={{ width: `${p.completion}%` }} />
                          </div>
                          <p className="mt-1 text-xs text-right tabular-nums">{p.completion}%</p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700">Open Path</button>
                        <button className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">View Courses</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {currentTab === "progress" && (
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 p-6 shadow-soft text-sm backdrop-blur">
                <h3 className="font-semibold mb-2">My Progress</h3>
                <p className="text-slate-600 dark:text-slate-300">Hook your charts here: completions by month, hours learned, badges…</p>
              </div>
            )}
            {currentTab === "admin" && (
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 p-6 shadow-soft text-sm backdrop-blur">
                <h3 className="font-semibold mb-2">Admin</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Upload SCORM/xAPI packages</li>
                  <li>Manage users & enrollments</li>
                  <li>Create learning paths</li>
                  <li>Reports & compliance exports</li>
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>

      <button onClick={() => setChatOpen(true)} className="fixed bottom-5 right-5 rounded-full shadow-soft bg-indigo-600 text-white px-5 py-3 text-sm hover:bg-indigo-700">
        Ask Copilot
      </button>

      <ChatSlideOver open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
