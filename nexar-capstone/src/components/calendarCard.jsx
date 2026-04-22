"use client";

import { useMemo } from "react";
import { groupTasksByDate } from "@/services/task";

export default function CalendarCard({ tasks = [] }) {
  const now = new Date();

  // Anchors week to Monday
  const days = useMemo(() => {
    const start = new Date();
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0); 
  
    return [...Array(7)].map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, []);

  const tasksByDay = useMemo(() => groupTasksByDate(tasks), [tasks]);
  const isToday = (date) => date.toDateString() === now.toDateString();

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-neutral-900 tracking-tight">Weekly Schedule</h2>
        <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-1 rounded-full uppercase font-bold tracking-wider">
          Week View
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="py-10 text-center border-2 border-dashed border-neutral-50 rounded-xl">
          <p className="text-sm text-neutral-400">Clear skies! No tasks this week.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {days.map((date, i) => {
            const dateKey = date.toDateString();
            const dayTasks = tasksByDay[dateKey] || [];
            const active = isToday(date);

            return (
              <div key={i} className="flex flex-col items-center">
                <span className={`text-[10px] uppercase font-black mb-3 ${active ? 'text-indigo-600' : 'text-neutral-400'}`}>
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>

                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 text-sm font-bold transition-all ${
                    active 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110" 
                      : "bg-neutral-50 text-neutral-600 border border-neutral-100"
                  }`}
                >
                  {date.getDate()}
                </div>

                <div className="w-full space-y-1.5 min-h-[60px]">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className={`group relative p-1.5 rounded-lg border-l-4 transition-all hover:brightness-95 cursor-default ${
                        task.status === 'completed' ? 'opacity-40 grayscale' : ''
                      }`}
                      style={{ 
                        backgroundColor: `${task.courseColor}15`, // 15% opacity background
                        borderLeftColor: task.courseColor 
                      }}
                    >
                      <p className="text-[10px] font-bold truncate leading-tight" style={{ color: task.courseColor }}>
                        {task.title}
                      </p>
            
                      <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: task.courseColor }}>
                        {task.courseName}
                      </p>
        
                      {task.status === 'completed' && (
                        <span className="absolute top-1 right-1 text-green-500 text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}

                  {dayTasks.length > 2 && (
                    <div className="text-[9px] bg-neutral-50 text-neutral-400 py-1 rounded-md text-center font-bold border border-neutral-100">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}