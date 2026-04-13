"use client";

import { useState } from "react";
import useAuthUser from "@/hooks/useAuth";
import useCourses from "@/hooks/useCourses"; 
import CreateCourseModal from "@/components/courseModal";
import ProtectedRoute from "@/components/protectedRoute";
import Header from "@/components/header";
import BottomNav from "@/components/bottomNav";

export default function CoursesPage() {
  const [open, setOpen] = useState(false);
  const user = useAuthUser();
  
  // FIX: Change user?.userId to user?.id
  const { courses, loading, error } = useCourses(user?.id);

  return (
    <ProtectedRoute>
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-500 mt-1">Manage your academic schedule and materials.</p>
          </div>
          
          {/* Show this button at the top if there are already courses */}
          {courses?.length > 0 && (
            <button
              onClick={() => setOpen(true)}
              className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <span className="text-xl">+</span> Add Course
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-neutral-50 flex flex-col items-center gap-4">
             <p className="text-gray-500 font-medium">No courses yet. Click below to get started!</p>
             <button
                onClick={() => setOpen(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span className="text-xl">+</span> Create Your First Course
              </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.courseId} 
                className="group p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all bg-white cursor-pointer"
                style={{ borderTop: `6px solid ${course.color || '#6366f1'}` }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xl text-gray-800 group-hover:text-violet-600 transition-colors">
                    {course.courseName}
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  {course.term || "No term specified"}
                </p>
              </div>
            ))}
          </div>
        )}

        <CreateCourseModal isOpen={open} onClose={() => setOpen(false)} />
      </div>
        <BottomNav />
    </ProtectedRoute>
  );
}