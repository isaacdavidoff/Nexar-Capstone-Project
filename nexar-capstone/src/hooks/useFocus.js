"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createSession, updateSession } from "@/lib/focus";
import useAuthUser from "@/hooks/useAuth";

export default function useFocusSession() {
  const user = useAuthUser();

  const [activeSession, setActiveSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Helper to clear timer safely
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  //  Start session
  const startSession = async (task, duration = 25) => {
    
    const actualUid = user?.uid || user?.id || user?.userId;

  if (!actualUid) {
    console.error("User ID not found in user object:", user);
    return;
  }
    
    try {
      const sessionId = await createSession({
        userId: user.id, // Ensure this matches your auth hook's property
        taskId: task.id,
        duration,
      });

      const seconds = duration * 60;
      
      startTimeRef.current = Date.now();
      setTimeLeft(seconds);
      setActiveSession({ id: sessionId, task, duration });
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  };

  //  End Session Logic (Reusable for Complete/Cancel)
  const endSession = useCallback(async (status) => {
    if (!activeSession) return;
  
    const sessionId = activeSession.id;
  
    const elapsedSeconds = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    );
  
    try {
      await updateSession(sessionId, {
        status,
        actualDuration: elapsedSeconds,
        endedAt: new Date(),
      });
    } catch (err) {
      console.error("Failed to update session:", err);
      return;
    }
  
    clearTimer();
    setActiveSession(null);
    setTimeLeft(0);
  
  }, [activeSession]);

  const cancelSession = () => endSession("abandoned");
  const completeSession = useCallback(() => endSession("completed"), [endSession]);

  // Timer Effect
  useEffect(() => {
    if (!activeSession) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // We clear here to stop the ticking immediately
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [activeSession]);

  // Watch for timeLeft reaching 0 to trigger completion
  // This separates the UI tick from the heavy API logic
  const shouldCompleteRef = useRef(false);

  useEffect(() => {
    if (activeSession && timeLeft === 0 && startTimeRef.current) {
      shouldCompleteRef.current = true;
    }
  }, [timeLeft, activeSession]);

  useEffect(() => {
    if (shouldCompleteRef.current) {
      shouldCompleteRef.current = false;
      setTimeout(() => completeSession(), 0); 
    }
  }, [completeSession]);

  return {
    activeSession,
    timeLeft,
    startSession,
    cancelSession,
    completeSession,
  };
}