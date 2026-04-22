"use client";

import { useParams } from "next/navigation";
import useTasks from "@/hooks/useTasks";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// Components
import TaskList from "@/components/TaskList"; 
import MaterialsSection from "@/components/MaterialsSection";

export default function CourseDetailPage() {
  const { id } = useParams();
  const user = useAuth();
  const { tasks, loading: tasksLoading } = useTasks(user?.uid);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCourse() {
      const docRef = doc(db, "courses", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setCourse({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    }
    if (id) fetchCourse();
  }, [id]);

  if (loading) return <div className="p-10 animate-pulse text-neutral-400">Loading Hub...</div>;

  const courseTasks = tasks?.filter(t => t.courseId === id) || [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* --- HEADER SECTION --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[3rem] border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-6">
        <button 
            onClick={() => router.back()}   
            className="text-sm font-bold text-neutral-500 hover:text-neutral-600 transition-colors"
        >
            ← Back
        </button>
          <div 
            className="w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-black shadow-inner"
            style={{ backgroundColor: `${course?.color}50`, color: course?.color }}
          >

          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-neutral-900">{course?.courseName}</h1>
    
          </div>
        </div>
        
        <div className="flex flex-col text-right gap-2">
        <p className="text-[10px] font-black uppercase text-neutral-400">Current Term</p>
           <div className="px-4 py-2 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
             
              <p className="text-xl font-black text-indigo-600">{course?.term || "N/A"}</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN: TASKS & DEADLINES --- */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-neutral-100 shadow-sm">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              Upcoming Deadlines
              <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-lg">
                {courseTasks.filter(t => t.status !== 'completed').length}
              </span>
            </h2>
            <TaskList tasks={courseTasks} />
          </div>
        </section>

        {/* --- RIGHT COLUMN: MATERIALS & SYLLABUS --- */}
        <aside className="space-y-6">
          <MaterialsSection courseId={id} />
          
          <div className="bg-neutral-900 text-white p-8 rounded-[3rem] shadow-xl">
             <h3 className="font-black text-lg mb-4">Quick Links</h3>
             <ul className="space-y-3">
               {course?.links?.map((link, idx) => (
                 <li key={idx}>
                   <a href={link.url} target="_blank" className="flex items-center justify-between group">
                     <span className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors">{link.label}</span>
                     <span className="text-neutral-600 group-hover:text-indigo-400 transition-colors">↗</span>
                   </a>
                 </li>
               ))}
             </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}