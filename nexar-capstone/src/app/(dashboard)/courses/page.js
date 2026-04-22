"use client";

import { useState } from "react";
import useAuthUser from "@/hooks/useAuth";
import useCourses from "@/hooks/useCourses"; 
import CreateCourseModal from "@/components/courseModal";


export default function CoursesPage() {
  const [open, setOpen] = useState(false);
  const user = useAuthUser();
  
  // Normalized user ID access
  const { courses, loading, error } = useCourses(user?.uid || user?.id);

  return (
    
  
        <main className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-black text-neutral-900 tracking-tight">My Courses</h1>
              <p className="text-neutral-500 font-medium mt-1">
                Organize your semester and track your progress.
              </p>
            </div>
            
            {courses?.length > 0 && (
              <button
                onClick={() => setOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="text-xl leading-none">+</span> Add Course
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-neutral-200 border-t-indigo-600"></div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading Catalog</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-2xl text-center font-medium">
              ⚠️ {error}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-neutral-200 rounded-[2rem] bg-white flex flex-col items-center gap-6 shadow-sm">
               <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center text-3xl">📚</div>
               <div className="space-y-1">
                 <p className="text-neutral-900 font-bold text-lg">Your catalog is empty</p>
                 <p className="text-neutral-400 text-sm">Add your courses to start tracking assignments.</p>
               </div>
               <button
                  onClick={() => setOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center gap-2"
                >
                  Create Your First Course
                </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div 
                  key={course.id || course.courseId} 
                  className="group relative overflow-hidden p-8 bg-white rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  {/* Color Accent Bar */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-2" 
                    style={{ backgroundColor: course.color || '#6366f1' }}
                  />

                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <span 
                        className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-3 inline-block"
                        style={{ backgroundColor: `${course.color}20`, color: course.color }}
                      >
                        {course.term || "Active Term"}
                      </span>
                      <h3 className="font-black text-2xl text-neutral-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {course.courseName}
                      </h3>
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-neutral-50">
                       <p className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">
                         View Materials →
                       </p>
                       <div 
                        className="w-3 h-3 rounded-full shadow-inner"
                        style={{ backgroundColor: course.color }}
                       />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <CreateCourseModal isOpen={open} onClose={() => setOpen(false)} />
        </main>
    
  );
}