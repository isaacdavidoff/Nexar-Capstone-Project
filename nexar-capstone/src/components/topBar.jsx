"use client";

import useAuthUser from "@/hooks/useAuth";
import { formatDate } from "@/lib/dateFormat";

export default function TopBar({ onAddTask}) {

  const user = useAuthUser();
  const username = user?.name?.split(" ")[0] || "User";

  return (
    <div className="flex flex-col flex-row items-center justify-between gap-3 p-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-lg font-semibold capitalize">
          Hi, {username}! 👋
        </h2>
        <p className="text-xs text-gray-500 font-medium">
                {formatDate(new Date())}
              </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onAddTask}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          + Add Task
        </button>
      </div>
    </div>
  );
}
