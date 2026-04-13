"use client";

import { useEffect, useState } from "react";
import { subscribeToCourses } from "@/lib/courses";

export default function useCourses(userId) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToCourses(userId, (data) => {
      setCourses(data || []);
    });

    return () => unsubscribe();
  }, [userId]);

  const loading = userId ? courses === null : false;
  const safeCourses = userId ? courses || [] : [];
  const error = userId && courses === null ? "Failed to load courses." : null;

  return { courses: safeCourses, loading, error };
}
