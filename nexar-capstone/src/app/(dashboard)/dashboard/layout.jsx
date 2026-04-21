"use client";

import { useState } from "react";
import TopBar from "@/components/topBar";
import useAuthUser from "@/hooks/useAuth";
import useCourses from "@/hooks/useCourses";
import AddTaskModal from "@/components/addTaskModal";

export default function DashboardLayout({ children }) {
  const user = useAuthUser();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { courses } = useCourses(user?.uid || user?.id);

  const isModalOpen = isAddModalOpen || !!selectedTask;

  const handleClose = () => {
    setIsAddModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="w-full">
      {/* Top Action Bar */}
      <TopBar onAddTask={() => setIsAddModalOpen(true)} />

      {/* Page Content */}
      <div className="mt-6">
        {children}
      </div>

      {/* Global Modal */}
      {isModalOpen && (
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={handleClose}
          courses={courses || []}
          existingTask={selectedTask}
        />
      )}
    </div>
  );
}