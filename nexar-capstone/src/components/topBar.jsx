"use client";

import useAuthUser from "@/hooks/useAuth";

export default function TopBar({ onAddTask}) {

  const user = useAuthUser();
  const username = user?.name || "User";

  return (
    <div className="flex flex-col flex-row items-center justify-between gap-3 p-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-lg font-semibold capitalize">
          Welcome, {username}!
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onAddTask}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50"
        >
          + Add Task
        </button>
      </div>
    </div>
  );
}
