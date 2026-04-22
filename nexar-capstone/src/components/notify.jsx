"use client";

import { useEffect } from "react";
import { useNexarNotifications } from "@/context/Notification";
import useTasks from "@/hooks/useTasks";
import useAuth from "@/hooks/useAuth";
import { toDate } from "@/services/task";

export default function NotificationBell() {
  const user = useAuth();
  const { tasks, loading } = useTasks(user?.uid || user?.id);
  const { permission, requestPermission, sendNotification } = useNexarNotifications();

  useEffect(() => {
    if (loading || !tasks) return;

    const now = new Date();
    
    // Logic: Find tasks due in the next hour that haven't been notified yet
    const urgentTasks = tasks.filter(task => {
      const due = toDate(task.dueDate);
      if (!due || task.status === "completed") return false;
      
      const diffInMinutes = (due - now) / (1000 * 60);
      return diffInMinutes > 0 && diffInMinutes < 60;
    });

    if (urgentTasks.length > 0) {
      sendNotification("Upcoming Deadline!", {
        body: `${urgentTasks[0].title} is due in less than an hour!`,
      });
    }
  }, [tasks, loading, sendNotification]);

  return (
    <div className="relative">
      {permission !== "granted" ? (
        <button 
          onClick={requestPermission}
          className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition"
        >
          Enable Alerts 🔔
        </button>
      ) : (
        <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            System Active
          </p>
        </div>
      )}
    </div>
  );
}