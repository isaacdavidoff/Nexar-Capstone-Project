"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FocusCard from "@/components/focusCard";
import FocusTimer from "@/components/focusTimer";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Focus() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, "tasks"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(data);
    };
    

    fetchTasks();
  }, []);
  const router = useRouter();
  const handleStartFocus = (task) => {
    const duration = task.estimatedTime || 25;

    setSession({
      task,
      duration,
    });

    setTimeLeft(duration * 60);
  };

  const handleCancel = () => {
    setSession(null);
    setTimeLeft(0);
  };

  return (
    
    <div className="p-4 space-y-4">
    <FocusCard
        task={selectedTask}
        onStartFocus={handleStartFocus}
      />

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-neutral-600">
          Select a task
        </h2>

        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className={`w-full text-left p-3 rounded-lg border transition ${
              selectedTask?.id === task.id
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white hover:bg-neutral-50 border-neutral-200"
            }`}
          >
            <p className="font-medium text-sm">{task.title}</p>
            <p className="text-xs opacity-70">
              {task.estimatedTime} mins • {task.courseName}
            </p>
          </button>
        ))}
      </div>




      <FocusTimer
        setTimeLeft={setTimeLeft} 
        session={session}
        timeLeft={timeLeft}
        onCancel={handleCancel}
      />
       <button
            onClick={() => router.back()}
            className="mt-4 mb-6 inline-flex items-center gap-3 px-6 py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-violet-700 hover:shadow-lg transition"
            >
            <span className="text-lg">←</span>
            Back
        </button>
    </div>
  );
}