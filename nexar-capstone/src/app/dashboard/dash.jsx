"use client";

import ProtectedRoute from "@/components/protectedRoute";
import useTasks from "@/utils/useTasks";
import useAuth from "@/hooks/useAuth";

import DashboardLayout from "@/app/dashboard/layout";
import CalendarCard from "@/components/calendarCard";
import UpcomingTasksCard from "@/components/upcomingTaskCard";
import WorkloadCard from "@/components/workloadCard";
import FocusCard from "@/components/focusCard";

import { logout } from "@/services/auth";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const user = useAuth();
  const {
    tasks,
    upcoming,
    workload,
    recommendation,
    loading,
  } = useTasks(user.uid);

  const handleLogout = async () => {
    await logout();
  }

  if (loading) return <p className="p-6">Loading ...</p>;

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
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
          <UpcomingTasksCard tasks={upcoming} />
          <FocusCard task={recommendation} />
        </>
      }
    />
  );
}