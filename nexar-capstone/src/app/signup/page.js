"use client";

import { useEffect, useState } from "react";
import FocusCard from "@/components/focusCard";
import FocusTimer from "@/components/focusTimer";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Focus() {
  const [tasks, setTasks] = useState([]);
  const [bestTask, setBestTask] = useState(null);

  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const getDueDate = (task) => {
    if (!task?.dueDate) return null;
    if (task.dueDate?.toDate) return task.dueDate.toDate();
    if (task.dueDate?.seconds)
      return new Date(task.dueDate.seconds * 1000);
    return new Date(task.dueDate);
  };

  const priorityScore = (priority) => {
    switch (priority) {
      case "High":
        return 3;
      case "Medium":
        return 2;
      case "Low":
        return 1;
      default:
        return 0;
    }
  };

  const pickBestTask = (tasks) => {
    const now = new Date();

    return [...tasks].sort((a, b) => {
      const dueA = getDueDate(a);
      const dueB = getDueDate(b);


      const overdueA = dueA && dueA < now;
      const overdueB = dueB && dueB < now;
      if (overdueA !== overdueB) return overdueB - overdueA;


      if (dueA && dueB) {
        if (dueA.getTime() !== dueB.getTime()) {
          return dueA - dueB;
        }
      }

      const pDiff = priorityScore(b.priority) - priorityScore(a.priority);
      if (pDiff !== 0) return pDiff;


      return (a.estimatedTime || 999) - (b.estimatedTime || 999);
    })[0];
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, "tasks"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(data);
      setBestTask(pickBestTask(data));
    };

    fetchTasks();
  }, []);


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
      <FocusCard task={bestTask} onStartFocus={handleStartFocus} />

      <FocusTimer
        session={session}
        timeLeft={timeLeft}
        onCancel={handleCancel}
      />
    </div>
  );
}