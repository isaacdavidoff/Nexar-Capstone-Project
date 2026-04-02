"use client";

export default function FocusTimer({
  session,
  timeLeft,
  onCancel,
}) {
  if (!session) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const totalSeconds = session.duration * 60;
  const progress = (timeLeft / totalSeconds) * 100;

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-neutral-900 border border-neutral-800 text-white p-5 rounded-2xl shadow-2xl w-64 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col gap-1 mb-3">
        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
          Focus Session
        </span>
        <p className="font-medium truncate text-sm italic text-neutral-200">
          {session.task.title}
        </p>
      </div>

      <div className="text-4xl font-black text-center my-4 tabular-nums tracking-tight">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <div className="w-full bg-neutral-800 h-1.5 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-red-500 h-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        onClick={onCancel}
        className="w-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 py-2.5 rounded-xl text-xs font-semibold transition-colors border border-white/5"
      >
        Cancel Session
      </button>
    </div>
  );
}