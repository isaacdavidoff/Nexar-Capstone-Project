"use client";

import { useEffect, useState, useMemo } from "react";
import { toDate, sortTasksBySmartPriority } from "@/services/task";

export default function UpcomingTasksCard({ tasks = [], loading, onEditTask }) {
  const [now, setNow] = useState(new Date());

  const displayTasks = useMemo(() => {
    // Only show pending tasks and limit to top 5 by priority/date
    const pending = tasks.filter(t => t.status !== 'completed');
    return sortTasksBySmartPriority(pending).slice(0, 5);
  }, [tasks]);

  // Unified color mapping for categories
  const typeStyles = {
    assignment: "bg-blue-50 text-blue-600 border-blue-100",
    lab: "bg-purple-50 text-purple-600 border-purple-100",
    quiz: "bg-amber-50 text-amber-600 border-amber-100",
    exam: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const priorityStyles = {
    high: "text-rose-600 bg-rose-50",
    medium: "text-amber-600 bg-amber-50",
    low: "text-emerald-600 bg-emerald-50",
  };

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (date) => {
    if (!date) return { label: "No date", color: "text-neutral-400" };
    
    if (date < now) return { label: "Overdue", color: "text-rose-500 font-black" };

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return { label: "Today", color: "text-rose-600 font-black" };
    }
    
    if (date.toDateString() === tomorrow.toDateString()) {
      return { label: "Tomorrow", color: "text-amber-500 font-bold" };
    }

    return {
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      color: "text-neutral-500",
    };
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-neutral-900 tracking-tight">Upcoming Deadlines</h2>
        {!loading && (
          <span className="text-[10px] font-black bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full uppercase">
            Top {displayTasks.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 bg-neutral-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : displayTasks.length === 0 ? (
        <div className="py-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-100">
          <p className="text-sm text-neutral-400">All caught up! 🎉</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {displayTasks.map((task) => {
            const dueDate = toDate(task.dueDate);
            const status = getStatus(dueDate);
            const styles = typeStyles[task.type] || "bg-neutral-50 text-neutral-500";

            return (
              <li
                key={task.id}
                onClick={() => onEditTask?.(task)}
                className="group relative flex items-center justify-between gap-4 p-3.5 rounded-xl border border-neutral-50 bg-white hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50/50 transition-all cursor-pointer active:scale-[0.98]"
              >
                {/* Visual Course Indicator */}
                <div 
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full" 
                  style={{ backgroundColor: task.courseColor || '#E5E5E5' }} 
                />

                <div className="min-w-0 flex-1 pl-2">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-neutral-800 truncate group-hover:text-indigo-600 transition-colors">
                      {task.title}
                    </p>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${priorityStyles[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-neutral-400 truncate max-w-[100px]">{task.courseName}</span>
                    <span className={`px-1.5 rounded-md border ${styles}`}>
                      {task.type}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-[11px] font-black uppercase tracking-tight ${status.color}`}>
                    {status.label}
                  </p>
                  {dueDate && (
                    <p className="text-[10px] text-neutral-400 font-medium">
                      {dueDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}