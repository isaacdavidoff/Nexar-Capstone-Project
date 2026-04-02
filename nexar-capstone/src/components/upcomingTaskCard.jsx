"use client";

import { useEffect, useState, useMemo } from "react";
import { toDate, sortTasksByPriority } from "@/services/task";

export default function UpcomingTasksCard({
  tasks = [],
  loading,
  onSelectTask,
}) {
  const [now, setNow] = useState(new Date());

  const displayTasks = useMemo(() => {
    return sortTasksByPriority(tasks).slice(0, 5);
  }, [tasks]);

  const typeColor = {
    assignment: "bg-blue-100 text-blue-700",
    lab: "bg-purple-100 text-purple-700",
    quiz: "bg-yellow-100 text-yellow-700",
    exam: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatus = (date) => {
    if (!date) return { label: "No date", color: "text-gray-400" };

    const diff = date - now;
    const days = diff / (1000 * 60 * 60 * 24);

    if (date < now) return { label: "Overdue", color: "text-red-500" };
    if (days < 1) return { label: "Today", color: "text-red-500" };
    if (days < 2) return { label: "Tomorrow", color: "text-orange-500" };

    return {
      label: date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      color: "text-green-600",
    };
  };

  const priorityColor = {
    high: "bg-red-100 text-red-600",
    medium: "bg-yellow-100 text-yellow-600",
    low: "bg-green-100 text-green-600",
  };

  return (
    <section
      className="bg-white p-5 rounded-xl shadow-sm "
      aria-labelledby="upcoming-heading"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 id="upcoming-heading" className="font-semibold">
          Upcoming Deadlines
        </h2>

        {!loading && tasks.length > 0 && (
          <span className="text-xs text-gray-400">
            {tasks.length} task{tasks.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          <div className="h-10 bg-gray-100 rounded animate-pulse" />
          <div className="h-10 bg-gray-100 rounded animate-pulse" />
        </div>
      )}

      {/* Empty */}
      {!loading && tasks.length === 0 && (
        <div className="text-center py-6 text-sm text-gray-500">
          No upcoming tasks 🎉
        </div>
      )}

      {/* List */}
      <ul className="space-y-2">
        {displayTasks.map((task) => {
          const dueDate = toDate(task.dueDate);
          const status = getStatus(dueDate);

          return (
            <li
              onClick={() => onSelectTask?.(task)}
              key={task.id || task.taskId}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border hover:bg-gray-50 transition cursor-pointer"
            >
              {/* Left */}
              <div className="min-w-0 flex flex-col gap-1">
                {/* Top row: priority + title */}
                <div className="flex items-center gap-2">
                  {task.priority && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        priorityColor[task.priority] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {task.priority}
                    </span>
                  )}

                  <p className="text-sm font-medium truncate">{task.title}</p>
                  {task.type && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        typeColor[task.type]
                      }`}
                    >
                      {task.type}
                    </span>
                  )}
                </div>

                {/* Course */}
                <p className="text-xs text-gray-500 truncate">
                  {task.courseName || "No course"}
                </p>
              </div>

              {/* Right */}
              <div className="text-right flex-shrink-0">
                <p className={`text-xs font-medium ${status.color}`}>
                  {status.label}
                </p>

                {dueDate && status.label !== "Overdue" && (
                  <p className="text-[11px] text-gray-400">
                    {dueDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
