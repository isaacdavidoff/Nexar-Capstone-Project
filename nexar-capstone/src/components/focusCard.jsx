"use client";

export default function FocusCard({ task, onStartFocus }) {
  const getDueDate = (task) => {
    if (!task?.dueDate) return null;
    if (task.dueDate?.toDate) return task.dueDate.toDate();
    if (task.dueDate?.seconds)
      return new Date(task.dueDate.seconds * 1000);
    return new Date(task.dueDate);
  };

  const getUrgency = (task) => {
    const due = getDueDate(task);
    if (!due) return { label: "No deadline", color: "text-gray-400" };

    const now = new Date();
    const diff = due - now;
    const days = diff / (1000 * 60 * 60 * 24);

    if (due < now) return { label: "Overdue", color: "text-red-600" };
    if (days < 1) return { label: "Due Today", color: "text-red-500" };
    if (days < 2) return { label: "Due Tomorrow", color: "text-orange-500" };

    return { label: due.toLocaleDateString(), color: "text-gray-500" };
  };

  if (!task) {
    return (
      <section className="bg-white p-5 rounded-xl shadow border border-neutral-100">
        <h2 className="font-semibold mb-2 text-neutral-800">
          Focus Recommendation
        </h2>
        <p className="text-sm text-gray-500">
          You’re all caught up 🎉
        </p>
      </section>
    );
  }

  const urgency = getUrgency(task);

  return (
    <section className="bg-gradient-to-br from-violet-600 to-purple-600 text-white p-5 rounded-xl shadow-lg">
      <h2 className="font-semibold mb-3">🎯 Focus Now</h2>

      <div className="mb-4">
        <p className="text-sm font-semibold">{task.title}</p>

        <p className="text-xs opacity-90">
          {task.estimatedTime} mins • {task.courseName}
        </p>

        <p className={`text-xs font-medium mt-1 ${urgency.color}`}>
          {urgency.label}
        </p>
        <span className="text-[10px] px-2 py-0.5 rounded bg-white/20">
  {task.priority}
</span>
      </div>

      <button
  onClick={() => onStartFocus(task)}
  className="w-full bg-white text-purple-700 py-2 rounded-lg text-sm font-semibold"
>
  Start Focus Session
</button>
    </section>
  );
}