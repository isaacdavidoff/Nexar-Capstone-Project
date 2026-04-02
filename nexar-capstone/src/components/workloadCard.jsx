"use client";

export default function WorkloadCard({ workload = {}, loading }) {
  const {
    percent = 0,
    dueToday = 0,
    dueThisWeek = 0,
    upcoming = 0,
  } = workload;

  return (
    <section className="bg-white p-5 rounded-xl shadow-sm " aria-labelledby="workload-heading">
      

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Weekly Workload</h2>
        {!loading && (
          <span className="text-xs text-gray-400">
            {percent}% capacity
          </span>
        )}
      </div>

  
      {loading && (
        <div className="space-y-3">
          <div className="h-3 bg-gray-100 rounded animate-pulse" />
          <div className="h-16 bg-gray-100 rounded animate-pulse" />
        </div>
      )}

      {!loading && (
        <>
   
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all ${
                percent > 80
                  ? "bg-red-500"
                  : percent > 50
                  ? "bg-orange-500"
                  : "bg-blue-600"
              }`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>

      
          <p className="text-sm text-gray-600 mb-4">
  {percent === 0
    ? "You're free this week 🎉 "
    : percent > 80
    ? "You're overloaded ⚠️"
    : "You're on track 👍 "}
</p>

        
          <hr className="my-3 border-neutral-200" />

          <div className="grid grid-cols-3 text-center text-sm">
            
            <div>
              <p className="text-gray-400 text-xs">Today</p>
              <p className="font-semibold text-neutral-800">
                {dueToday}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs">This Week</p>
              <p className="font-semibold text-neutral-800">
                {dueThisWeek}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs">Upcoming</p>
              <p className="font-semibold text-neutral-800">
                {upcoming}
              </p>
            </div>

          </div>
        </>
      )}
    </section>
  );
}