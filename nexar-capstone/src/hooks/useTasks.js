"use client";

import { useEffect, useState, useMemo } from "react";
import { subscribeToTasks } from "@/lib/task";
import { 
  getUpcomingTasks, 
  calculateWorkload, 
  getFocusRecommendation, 
  sortTasksByPriority 
} from "@/services/task";

export default function useTasks(userId) {
  const [tasks, setTasks] = useState(null); 

  useEffect(() => {
    if (!userId) return;


    const unsubscribe = subscribeToTasks(userId, (data) => {
      setTasks(data || []);
    });

    return () => unsubscribe();
  }, [userId]);

  const results = useMemo(() => {
    const rawTasks = tasks || [];
    
    return {
      tasks: sortTasksByPriority(rawTasks),
      upcoming: getUpcomingTasks(rawTasks),
      workload: calculateWorkload(rawTasks),
      recommendation: getFocusRecommendation(rawTasks),
      loading: tasks === null,
      isEmpty: tasks !== null && tasks.length === 0
    };
  }, [tasks]);

  return results;
}