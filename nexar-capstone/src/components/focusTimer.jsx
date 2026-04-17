"use client";

import { useEffect } from "react";

export default function FocusTimer({
  session,
  timeLeft,
  setTimeLeft,
  onCancel,
}) {
  if (!session || timeLeft == null) return null;


  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session, setTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const totalSeconds = session.duration * 60;
  const progress = (timeLeft / totalSeconds) * 100;

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-neutral-900 border border-neutral-800 text-white p-5 rounded-2xl shadow-2xl w-64">
      <p className="text-sm">{session.task.title}</p>

      <div className="text-3xl font-bold text-center my-3">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <div className="w-full bg-neutral-800 h-1.5 rounded-full mb-4">
        <div
          className="bg-red-500 h-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        onClick={onCancel}
        className="w-full bg-white/10 py-2 rounded"
      >
        Cancel
      </button>
    </div>
  );
}