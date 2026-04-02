"use client";

import { useMemo } from "react";
import { groupTasksByDate } from "@/services/task";


export default function CalendarCard({ tasks = [] }) {
  const now = new Date();

  const days = useMemo(() => {
    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0); 
  
    return [...Array(7)].map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, []);

  const tasksByDay = useMemo(() => groupTasksByDate(tasks), [tasks]);

  const isToday = (date) => date.toDateString() === now.toDateString();

  return (
    <section className="bg-white p-5 rounded-xl shadow border border-neutral-100">
      <h2 className="font-semibold mb-4 text-neutral-800">Weekly Schedule</h2>

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No tasks scheduled for this week.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {days.map((date, i) => {
            const dateKey = date.toDateString();
            const dayTasks = tasksByDay[dateKey] || [];
            const active = isToday(date);

            return (
              <div key={i} className="flex flex-col items-center group">
           
                <span className="text-[10px] uppercase font-bold text-neutral-400 mb-2">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 text-sm transition-colors ${
                    active 
                      ? "bg-violet-500 text-white shadow-md shadow-violet-200" 
                      : "bg-neutral-50 text-neutral-600 group-hover:bg-neutral-100"
                  }`}
                >
                  {date.getDate()}
                </div>

             
                <div className="w-full flex flex-col gap-1 min-h-[40px]">
                  {dayTasks.slice(0, 2).map((task) => {
                 
                    return (
                      <div
                        key={task.id || task.taskId}
                        title={task.title}
                        className="text-[9px] leading-tight px-1.5 py-1 rounded-md truncate font-medium shadow-sm"
                        style={{
                          backgroundColor: task.courseColor || "#6366f1",
                          color: "#fff",
                        }}
                      >
                        <p>{task.title || "Untitled Task"}</p>
                        <p className="text-[7px] opacity-80 mt-0.5">
                          {task.courseName || "No Course"}
                        </p>
                      </div>
                      
                    );
                  })}



                  {dayTasks.length > 2 && (
                    <span className="text-[9px] text-neutral-400 text-center font-medium mt-1">
                      +{dayTasks.length - 2} more
                    </span>
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