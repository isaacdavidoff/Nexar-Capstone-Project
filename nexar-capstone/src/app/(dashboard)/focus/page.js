"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FocusCard from "@/components/focusCard";
import FocusTimer from "@/components/focusTimer";
import useFocusSession from "@/hooks/useFocus"; 
import useAuthUser from "@/hooks/useAuth"; 

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function FocusPage() {
  const router = useRouter();
  const user = useAuthUser();
  
  const { 
    startSession, 
    activeSession, 
    timeLeft, 
    isPaused,      // Added
    togglePause,   // Added
    cancelSession, 
    completeSession 
  } = useFocusSession();

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ONLY current user's tasks
  useEffect(() => {
    if (!user) return;

    const fetchUserTasks = async () => {
      setLoading(true);
      try {
        const actualUid = user.uid || user.id;
        
        // SECURE QUERY: Filter by userId AND non-completed status
        const tasksQuery = query(
          collection(db, "tasks"), 
          where("userId", "==", actualUid),
          where("status", "!=", "completed")
        );

        const snapshot = await getDocs(tasksQuery);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [user]);

  const handleStartFocus = async (task) => {
    await startSession(task, task.estimatedTime);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-32">
      {/* 1. Header & Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Focus Mode</h1>
      </div>

      {/* 2. Start Session Card */}
      <FocusCard
        task={selectedTask}
        onStartFocus={handleStartFocus}
      />

      {/* 3. Task Selector List */}
      <div className="space-y-3 mt-12">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Select an active task
          </h2>
          {loading && <span className="animate-pulse text-[10px] text-indigo-500">Loading...</span>}
        </div>

        <div className="grid gap-2">
          {!loading && tasks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-neutral-200">
              <p className="text-sm text-neutral-400">No active tasks found. Go to dashboard to add one!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                  selectedTask?.id === task.id
                    ? "bg-indigo-50 border-indigo-600 shadow-sm"
                    : "bg-white hover:bg-neutral-50 border-neutral-100"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold text-sm truncate ${selectedTask?.id === task.id ? 'text-indigo-900' : 'text-neutral-800'}`}>
                      {task.title}
                    </p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1">
                      {task.courseName || "General"} • {task.estimatedTime || 25} mins
                    </p>
                  </div>
                  {selectedTask?.id === task.id && (
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-[10px]">🎯</div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* 4. Global Timer HUD */}
      <FocusTimer
        session={activeSession}
        timeLeft={timeLeft}
        isPaused={isPaused}          // Now reactive to global hook
        onTogglePause={togglePause}  // Now reactive to global hook
        onCancel={cancelSession}
        onComplete={() => completeSession(true)}
      />
    </div>
  );
}