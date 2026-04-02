"use client";

import { useEffect, useState, useMemo } from "react";
import { subscribeToTasks } from "@/lib/task";

export default function useTasks(userId) {
  const [tasks, setTasks] = useState(null); 

  useEffect(() => {
    if (!userId) return;


    const unsubscribe = subscribeToTasks(userId, (data) => {
      setTasks(data || []);
    });

    return () => unsubscribe();
  }, [userId]);

  const safeTasks = userId ? tasks || [] : [];
  const loading = userId ? tasks === null : false;
  const error = userId && tasks === null ? "Failed to load tasks." : null;

  return {
    tasks: safeTasks,
    loading,
    error,
  };
}