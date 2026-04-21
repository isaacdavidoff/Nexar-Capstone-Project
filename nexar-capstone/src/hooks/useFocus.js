"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createSession, completeSession as finalizeSession } from "@/lib/focus"; 
import { updateTask } from "@/lib/task";
import useAuthUser from "@/hooks/useAuth";

export default function useFocusSession() {
  const user = useAuthUser();
  const [activeSession, setActiveSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const expectedEndRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

 
  const startSession = async (task, duration = 25) => {
    // Standardize the UID lookup based on your useAuthUser hook
    const actualUid = user?.uid || user?.id;

    if (!actualUid) {
      console.error("User not authenticated.");
      return;
    }
    
    try {
      const customDuration = Number(duration);
      const finalDuration = Number(customDuration || task.estimatedTime || 25);
      const sessionId = await createSession({
        userId: actualUid,
        taskId: task.id,
        duration: finalDuration,
      });

      const seconds = finalDuration * 60;
      startTimeRef.current = Date.now();
      expectedEndRef.current = Date.now() + seconds * 1000;
      
      setIsPaused(false); // Ensure we start in an unpaused state
      setTimeLeft(seconds);
      setActiveSession({ id: sessionId, task, duration: finalDuration });
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  };

  /**
   * Pause/Resume Logic
   */
  const togglePause = useCallback(() => {
    if (!activeSession) return;

    if (!isPaused) {
      // PAUSING: Just stop the interval and flip the state.
      // timeLeft remains what it was at the last tick.
      setIsPaused(true);
      clearTimer();
    } else {
      // RESUMING: Recalculate the expected end time from THIS moment.
      const newEndTime = Date.now() + timeLeft * 1000;
      expectedEndRef.current = newEndTime;
      setIsPaused(false);
    }
  }, [activeSession, isPaused, timeLeft]);

  const endSession = useCallback(async (status) => {
    if (!activeSession || !user) return;
  
    const sessionId = activeSession.id;
    const actualUid = user.uid || user.id;
    const taskId = activeSession.task?.id;

    // Calculate actual minutes for the aggregate stats
    const elapsedMinutes = Math.floor(
      ((Date.now() - startTimeRef.current) / 1000) / 60
    );
  
    try {
      // 1. Always finalize the session log so the user gets credit for their time
      await finalizeSession(actualUid, sessionId, elapsedMinutes);
  const taskFinished = status === "completed";
      // 2. Only update the actual Task status if the user says they are done
      if (taskFinished && taskId) {
        await updateTask(taskId, { status: 'completed', isCompleted: true });
      }
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  
    clearTimer();
    setActiveSession(null);
    setTimeLeft(0);
    setIsPaused(false);
    startTimeRef.current = null;
    expectedEndRef.current = null;
  }, [activeSession, user]);

  const cancelSession = () => endSession("abandoned");
  const completeSession = useCallback((taskFinished = false) => 
    endSession("completed", taskFinished), [endSession]);

  // Timer Ticking with Drift Correction
  useEffect(() => {
    if (!activeSession || isPaused) return;

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.round((expectedEndRef.current - now) / 1000));
      
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearTimer();
      }
    }, 1000);

    return () => clearTimer();
  }, [activeSession, isPaused]);


  useEffect(() => {
    if (activeSession && timeLeft === 0 && startTimeRef.current && !isPaused) { 
      // We auto-complete the SESSION, but pass 'false' for taskFinished.
      // The UI can then prompt the user if they want to close the task too.
      setTimeout(() => completeSession(false), 0); 
    }
  }, [timeLeft, activeSession, completeSession, isPaused]);

  return {
    activeSession,
    timeLeft,
    isPaused,
    togglePause,
    startSession,
    cancelSession,
    completeSession,
  };
}