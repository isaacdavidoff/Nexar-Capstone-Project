"use client";

import { useEffect } from "react";

export default function FocusTimer({
  session,
  timeLeft,
  isPaused,        // New prop from useFocusSession
  onTogglePause,   // New prop from useFocusSession
  onCancel,
  onComplete,
}) {
  const activeSession = !!session;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Sync Timer to Browser Tab Title
  useEffect(() => {
    if (activeSession) {
      const status = isPaused ? "Paused" : "Focusing";
      document.title = `${minutes}:${seconds.toString().padStart(2, "0")} (${status})`;
    } else {
      document.title = "Nexar";
    }
  }, [minutes, seconds, activeSession, isPaused]);

  if (!session || timeLeft == null) return null;

  const totalSeconds = session.duration * 60;
  const progress = (timeLeft / totalSeconds) * 100;

  return (
    <div className="fixed bottom-24 right-4 left-4 md:left-auto md:w-80 z-50 bg-neutral-900/95 backdrop-blur-xl border border-white/10 text-white p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">
            {isPaused ? "Session Paused" : "Focusing Now"}
          </p>
          <h3 className="text-sm font-bold truncate pr-2">
            {session.task?.title || "Focus Session"}
          </h3>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => onComplete?.(false)} 
            className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md font-bold hover:bg-emerald-500/30 transition"
           >
            FINISH
           </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-5">
        {/* Timer Display with Pause State Styling */}
        <div className={`text-4xl font-black tabular-nums tracking-tight transition-opacity duration-300 ${isPaused ? "opacity-40" : "opacity-100"}`}>
          {minutes}<span className={`${isPaused ? "" : "animate-pulse"} text-white/30`}>:</span>{seconds.toString().padStart(2, "0")}
        </div>

        {/* Play/Pause Toggle Button */}
        <button
          onClick={onTogglePause}
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            isPaused 
              ? "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20" 
              : "bg-white/10 hover:bg-white/20"
          }`}
          aria-label={isPaused ? "Resume Session" : "Pause Session"}
        >
          {isPaused ? (
            <span className="text-xs">▶️</span>
          ) : (
            <span className="text-xs">⏸️</span>
          )}
        </button>
      </div>

      {/* Progress Bar Container */}
      <div className="mb-5">
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              isPaused ? "bg-neutral-500" : timeLeft < 60 ? "bg-rose-500" : "bg-indigo-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={onCancel}
        className="w-full bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 py-2.5 rounded-xl text-xs font-bold text-white/60 transition-all active:scale-[0.98]"
      >
        CANCEL SESSION
      </button>
    </div>
  );
}