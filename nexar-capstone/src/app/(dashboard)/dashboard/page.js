"use client";

import { useState } from "react";
import useTasks from "@/hooks/useTasks";
import useAuth from "@/hooks/useAuth";
import useFocus from "@/hooks/useFocus";

import CalendarCard from "@/components/calendarCard";
import UpcomingTasksCard from "@/components/upcomingTaskCard";
import WorkloadCard from "@/components/workloadCard";
import FocusCard from "@/components/focusCard";
import FocusTimer from "@/components/focusTimer";
import { logout } from "@/services/auth";

export default function DashboardPage() {
  const user = useAuth();

  const { tasks, upcoming, workload, recommendation, loading } =
    useTasks(user?.uid || user?.id);

  const {
    activeSession,
    timeLeft,
    isPaused,
    togglePause,
    startSession,
    cancelSession,
    completeSession,
  } = useFocus();

  const [taskToEdit, setTaskToEdit] = useState(null);

  if (loading || user === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 animate-pulse">
          Syncing your semester...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 items-start">
      
      {/* LEFT */}
      <section className="col-span-12 lg:col-span-8 space-y-6">
        <CalendarCard tasks={tasks || []} />
        <WorkloadCard workload={workload} />
      </section>

      {/* RIGHT */}
      <aside className="col-span-12 lg:col-span-4 space-y-6">
        
        <UpcomingTasksCard 
          tasks={upcoming} 
          onEditTask={setTaskToEdit} 
        />

        {/* Focus Section */}
        <div className="space-y-4 pt-4 border-t border-neutral-100 lg:border-none">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-1">
            Active Focus
          </h3>

          <FocusCard 
            task={recommendation} 
            onStartFocus={startSession} 
          />

          <FocusTimer
            session={activeSession}
            timeLeft={timeLeft}
            isPaused={isPaused}
            onTogglePause={togglePause}
            onCancel={cancelSession}
            onComplete={() => completeSession(true)}
          />
        </div>

        {/* Logout */}
        <div className="pt-6 mt-6 border-t border-neutral-100">
          <button
            onClick={() => logout()}
            className="w-full px-4 py-3 border-2 border-neutral-100 text-neutral-400 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all font-bold text-[10px] uppercase tracking-widest"
          >
            Sign Out of Nexar
          </button>
        </div>
      </aside>
    </div>
  );
}