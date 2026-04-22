"use client";

import { toDate } from "@/services/task";

export default function TaskList({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-neutral-100 rounded-[2rem] bg-neutral-50/50">
        <span className="text-3xl mb-3">✅</span>
        <p className="text-sm font-bold text-neutral-900">All caught up!</p>
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
          No pending tasks for this course.
        </p>
      </div>
    );
  }

  // Sort tasks: Pending first, then by Due Date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    return toDate(a.dueDate) - toDate(b.dueDate);
  });

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <div 
          key={task.id}
          className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all ${
            task.status === "completed" 
              ? "bg-neutral-50 border-transparent opacity-60" 
              : "bg-white border-neutral-100 shadow-sm hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Status Icon */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              task.status === "completed" 
                ? "bg-emerald-500 border-emerald-500 text-white" 
                : "border-neutral-200"
            }`}>
              {task.status === "completed" && <span className="text-[10px]">✓</span>}
            </div>

            <div>
              <h4 className={`font-black text-sm tracking-tight ${
                task.status === "completed" ? "line-through text-neutral-400" : "text-neutral-900"
              }`}>
                {task.title}
              </h4>
              <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                Due: {toDate(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {/* Priority Badge */}
             <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${
               task.priority === 'high' ? 'bg-rose-50 text-rose-600' :
               task.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
               'bg-blue-50 text-blue-600'
             }`}>
               {task.priority}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
}