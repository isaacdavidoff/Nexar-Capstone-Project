"use client";

import { toDate } from "@/services/task";

export default function FocusCard({ task, onStartFocus }) {
  
  const getUrgency = (task) => {
    const due = toDate(task?.dueDate);
    if (!due) return { label: "No deadline", color: "bg-white/10 text-white" };

    const now = new Date();
    const diff = due - now;
    const hours = diff / (1000 * 60 * 60);
    const days = hours / 24;

    if (due < now) return { label: "Overdue", color: "bg-rose-500 text-white" };
    if (hours < 24) return { label: "Due Today", color: "bg-amber-400 text-amber-950" };
    if (days < 2) return { label: "Due Tomorrow", color: "bg-white/20 text-white" };

    return { 
      label: due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), 
      color: "bg-white/10 text-white" 
    };
  };

  if (!task) {
    return (
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center justify-center text-center min-h-[200px]">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3 text-xl">
          ✨
        </div>
        <h2 className="font-bold text-neutral-900 mb-1">All Caught Up</h2>
        <p className="text-xs text-neutral-500 px-4">
          Enjoy your free time or get ahead on future assignments!
        </p>
      </section>
    );
  }

  const urgency = getUrgency(task);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white p-6 rounded-2xl shadow-xl shadow-indigo-200">
      {/* Decorative background element */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🎯</span>
        <h2 className="font-bold tracking-tight text-white/90 uppercase text-[10px] tracking-widest">
          Focus Recommendation
        </h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold leading-snug mb-1 truncate">
          {task.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${urgency.color}`}>
            {urgency.label}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white uppercase tracking-tighter">
            {task.priority} Priority
          </span>
        </div>
        
        <div className="mt-4 space-y-1">
          <p className="text-xs text-white/80 flex items-center gap-1.5">
            <span className="opacity-50">📚</span> {task.courseName || "General Task"}
          </p>
          <p className="text-xs text-white/80 flex items-center gap-1.5">
            <span className="opacity-50">⏳</span> {task.estimatedTime || 25} Minute Session
          </p>
        </div>
      </div>

      <button
        onClick={() => onStartFocus(task)}
        disabled={!task?.id}
        className="w-full bg-white text-indigo-700 py-3 rounded-xl text-sm font-black shadow-md hover:bg-indigo-50 active:scale-[0.97] transition-all disabled:opacity-50"
      >
         <span className="mr-2"> ▶️ </span>
        START FOCUS SESSION
       

      </button>
    </section>
  );
}