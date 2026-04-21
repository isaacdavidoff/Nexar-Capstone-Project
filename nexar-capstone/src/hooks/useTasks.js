"use client";

import { useEffect, useState, useMemo } from "react";
import { subscribeToTasks } from "@/lib/task";
import { 
  getUpcomingTasks, 
  calculateWorkload, 
  getFocusRecommendation, 
  sortTasksBySmartPriority
} from "@/services/task";

export default function useTasks(userId) {
  const [tasks, setTasks] = useState(() => (userId ? null : []));

  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribe = subscribeToTasks(userId, (data) => {
      setTasks(data || []);
    });

    return () => unsubscribe();
  }, [userId]);

  const results = useMemo(() => {
    const rawTasks = tasks || [];
    
    return {
      // 1. Full Task List (Sorted by Priority)
      tasks: sortTasksBySmartPriority(rawTasks),
      
      // 2. Computed Views
      upcoming: getUpcomingTasks(rawTasks),
      workload: calculateWorkload(rawTasks),
      recommendation: getFocusRecommendation(rawTasks),
      
      // 3. UI States
      loading: tasks === null,
      isEmpty: tasks !== null && tasks.length === 0,
      count: rawTasks.length
    };
  }, [tasks]);

  return results;
}