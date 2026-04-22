"use client";

import TopBar from "@/components/topBar";
import useAuthUser from "@/hooks/useAuth";
import useCourses from "@/hooks/useCourses";
import AddTaskModal from "@/components/addTaskModal";
import { useTaskUI } from "@/context/TaskContext";
import NotificationManager from "@/components/notificationManager";

export default function DashboardLayout({ children }) {
  const user = useAuthUser();
  
  // 1. Pull everything from Context
  const { taskToEdit, isAddModalOpen, closeModal, openAddModal } = useTaskUI();

  const { courses } = useCourses(user?.uid || user?.id);

  // 2. The single source of truth for visibility
  const isModalOpen = isAddModalOpen || !!taskToEdit;

  return (
    <div className="w-full">
      {/* 3. Use openAddModal from context */}
      <TopBar onAddTask={openAddModal} />
      <NotificationManager />

      <div className="mt-6">
        {children}
      </div>

      {/* 4. Use closeModal from context */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={closeModal} 
        courses={courses || []}
        existingTask={taskToEdit}
      />
    </div>
  );
}