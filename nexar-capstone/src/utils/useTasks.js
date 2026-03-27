"use client";

import { useEffect, useState } from "react";
import { getTasks } from "@/lib/task";

import {
  getOverdueTasks,
  getUpcomingTasks,
  getTodayTasks,
  calculateWorkload,
  getFocusRecommendation,
} from "@/services/task";

export default function useTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [overdue, setOverdue] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [today, setToday] = useState([]);
  const [workload, setWorkload] = useState({ percent: 0, totalMinutes: 0 });
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);

        const data = await getTasks(userId);
        setTasks(data);

    
        setOverdue(getOverdueTasks(data));
        setUpcoming(getUpcomingTasks(data));
        setToday(getTodayTasks(data));
        setWorkload(calculateWorkload(data));
        setRecommendation(getFocusRecommendation(data));

      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  return {
    tasks,
    overdue,
    upcoming,
    today,
    workload,
    recommendation,
    loading,
    error,
  };
}