export default function UpcomingTasksCard({ tasks }) {
    const getColor = (task) => {
      const now = new Date();
      const due = task.dueDate?.toDate?.() || new Date(task.dueDate);
  
      if (due < now) return "text-red-500";
      if ((due - now) / (1000 * 60 * 60 * 24) < 2)
        return "text-orange-500";
  
      return "text-green-600";
    };
  
    return (
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Upcoming Deadlines</h2>
  
        <div className="space-y-3">
          {tasks?.length === 0 && (
            <p className="text-sm text-gray-500">No upcoming tasks</p>
          )}
  
          {tasks?.map((task) => (
            <div
              key={task.taskId}
              className="flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-gray-500">
                  {task.courseName}
                </p>
              </div>
  
              <span className={`text-xs ${getColor(task)}`}>
                {new Date(task.dueDate.seconds * 1000).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }