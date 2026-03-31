"use client";

import ProtectedRoute from "@/components/protectedRoute";
import useTasks from "@/utils/useTasks";
import useAuth from "@/hooks/useAuth";

export default function DashboardPage() {
  const user = useAuth();
  const { upcoming, workload, recommendation } = useTasks(user?.uid);

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <p>Upcoming tasks: {upcoming?.length}</p>
        <p>Workload: {workload?.percent}%</p>

        {recommendation && (
          <p>Focus next: {recommendation.title}</p>
        )}
      </div>
    </ProtectedRoute>
  );
}