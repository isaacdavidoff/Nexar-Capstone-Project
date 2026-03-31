export default function CalendarCard({ tasks }) {
    return (
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Weekly Calendar</h2>
  
        <div className="grid grid-cols-7 gap-2 text-sm">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
  
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="h-20 border rounded-lg p-1 flex flex-col gap-1"
            >
              {tasks?.slice(i, i + 2).map((task) => (
                <span
                  key={task.taskId}
                  className="text-xs px-1 py-0.5 rounded bg-blue-100 truncate"
                >
                  {task.title}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }