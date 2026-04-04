"use client";

import { useState } from "react"; // Added useState
import useTasks from "@/hooks/useTasks";
import useAuth from "@/hooks/useAuth";

import DashboardLayout from "@/app/dashboard/layout";
import CalendarCard from "@/components/calendarCard";
import UpcomingTasksCard from "@/components/upcomingTaskCard";
import WorkloadCard from "@/components/workloadCard";
import FocusCard from "@/components/focusCard";
import { logout } from "@/services/auth";
import useFocus from "@/hooks/useFocus";
import FocusTimer from "@/components/focusTimer";
import ProtectedRoute from "@/components/protectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const user = useAuth();
  const { tasks, upcoming, workload, recommendation, loading } = useTasks(user?.id);
  const { activeSession, timeLeft, startSession, cancelSession } = useFocus();

  // State to track which task is being edited
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleLogout = () => logout();

  if (loading || user === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg italic">Preparing your workspace...</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      selectedTask={taskToEdit} 
      clearSelectedTask={() => setTaskToEdit(null)}
      left={
        <>
          <CalendarCard 
            tasks={tasks || []} 
          />
          <WorkloadCard workload={workload} />
        </>
      }
      right={
        <>
          <UpcomingTasksCard 
            tasks={upcoming} 
            onEditTask={setTaskToEdit} 
          />
          <FocusCard task={recommendation} onStartFocus={startSession} />
          <FocusTimer
            session={activeSession}
            timeLeft={timeLeft}
            onCancel={cancelSession}
          />
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-4 py-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition font-medium"
          >
            Logout
          </button>
        </>
      }
    />
  );
}