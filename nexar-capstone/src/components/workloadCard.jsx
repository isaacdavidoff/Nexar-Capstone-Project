"use client";

export default function WorkloadCard({ workload = {}, loading }) {
  const {
    percent = 0,
    dueToday = 0,
    dueThisWeek = 0,
    upcoming = 0,
  } = workload;

  // Determine status color for text and bars
  const getStatusColor = () => {
    if (percent > 80) return "text-red-600 bg-red-500";
    if (percent > 50) return "text-orange-600 bg-orange-500";
    return "text-indigo-600 bg-indigo-600";
  };

  const [textColor, barColor] = getStatusColor().split(" ");

  return (
    <section 
      className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 h-full" 
      aria-labelledby="workload-heading"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 id="workload-heading" className="font-bold text-neutral-900 tracking-tight">
          Workload Analysis
        </h2>
        {!loading && (
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-neutral-50 ${textColor}`}>
            {percent}% Cap
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4 py-2">
          <div className="h-4 bg-neutral-100 rounded-full animate-pulse w-full" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-10 bg-neutral-50 rounded-lg animate-pulse" />
            <div className="h-10 bg-neutral-50 rounded-lg animate-pulse" />
            <div className="h-10 bg-neutral-50 rounded-lg animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-neutral-500 mb-4 font-medium">
            {percent === 0
              ? "Your schedule is clear for now. Enjoy the break! ✨"
              : percent > 80
              ? "High workload detected. Prioritize urgent tasks. ⚠️"
              : "Your schedule looks manageable. Stay focused! 🚀"}
          </p>

          <div className="w-full bg-neutral-100 rounded-full h-2.5 mb-6 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100/50 text-center">
              <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1">Today</p>
              <p className={`text-lg font-black ${dueToday > 0 ? 'text-neutral-900' : 'text-neutral-300'}`}>
                {dueToday}
              </p>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100/50 text-center">
              <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1">Week</p>
              <p className="text-lg font-black text-neutral-900">
                {dueThisWeek}
              </p>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100/50 text-center">
              <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1">Next</p>
              <p className="text-lg font-black text-neutral-900">
                {upcoming}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}