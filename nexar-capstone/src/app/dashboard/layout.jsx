"use client";

import Header from "@/components/header";
import TopBar from "@/components/topBar";
import BottomNav from "@/components/bottomNav";
import useAuthUser from "@/hooks/useAuth";
import { useState, cloneElement } from "react";
import useCourses from "@/hooks/useCourses";
import AddTaskModal from "@/components/addTaskModal";

export default function DashboardLayout({ left, right, selectedTask, clearSelectedTask }) {
  const user = useAuthUser();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { courses } = useCourses(user?.id);

  
  const isModalOpen = isAddModalOpen || !!selectedTask;

  const handleClose = () => {
    setIsAddModalOpen(false);
    clearSelectedTask(); 
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      <TopBar onAddTask={() => setIsAddModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24 md:pb-12">
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-8 space-y-6">{left}</section>
          <aside className="col-span-12 lg:col-span-4 space-y-6">{right}</aside>
        </div>
      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleClose}
        courses={courses || []}
        existingTask={selectedTask}
      />

      <BottomNav />
    </div>
  );
}