export default function FocusCard({ task }) {
    if (!task) {
      return (
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Focus Recommendation</h2>
          <p className="text-sm text-gray-500">
            Youre all caught up 🎉
          </p>
        </div>
      );
    }
  
    return (
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Focus Recommendation</h2>
  
        <p className="text-sm font-medium mb-1">{task.title}</p>
        <p className="text-xs text-gray-500 mb-4">
          {task.estimatedTime} mins • {task.courseName}
        </p>
  
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Start Focus Session
        </button>
      </div>
    );
  }