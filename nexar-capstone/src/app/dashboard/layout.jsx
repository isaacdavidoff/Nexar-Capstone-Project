"use client";

import Header from "@/components/header";
import TopBar from "@/components/topBar";
import BottomNav from "@/components/bottomNav";
import useAuthUser from "@/hooks/useAuth";
import { useState } from "react";
import useCourses from "@/hooks/useCourses";
import AddTaskModal from "@/components/addTaskModal";

export default function DashboardLayout({ left, right }) {
  const user = useAuthUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { courses, loading, error } = useCourses(user?.id);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <TopBar onAddTask={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24 md:pb-12">
        <div className="grid grid-cols-12 gap-6">
         
          <section className="col-span-12 lg:col-span-8 space-y-6">
            {left}
          </section>

          <aside className="col-span-12 lg:col-span-4 space-y-6">
            {right}
          </aside>
        </div>
      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courses={courses || []}
      />

      <BottomNav />
    </div>
  );
}