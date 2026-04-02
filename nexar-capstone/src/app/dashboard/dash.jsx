"use client";

import ProtectedRoute from "@/components/protectedRoute";
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

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const user = useAuth();
  const { tasks, upcoming, workload, recommendation, loading } = useTasks(
    user?.uid
  );

  const { activeSession, timeLeft, startSession, cancelSession } = useFocus();

  const handleLogout = () => {
    logout();
  };

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Checking authentication...</p>
      </div>
    );
  }

  if (user === null) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      left={
        <>
          <CalendarCard tasks={tasks} />
          <WorkloadCard workload={workload} />
        </>
      }
      right={
        <>
          <UpcomingTasksCard tasks={upcoming} />
          <FocusCard task={recommendation} onStartFocus={startSession} />
          <FocusTimer
            session={activeSession}
            timeLeft={timeLeft}
            onCancel={cancelSession}
          />
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </>
      }
    />
  );
}
