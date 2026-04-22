"use client";

export default function Notifications() {
  const tasks = [
    { name: "Assignment 1", due: "2026-04-01" },
    { name: "Quiz", due: "2026-04-10" },
  ];

  const today = new Date();

  const overdueTasks = tasks.filter(task => new Date(task.due) < today);

  return (
    <div>
      <h1>Notifications</h1>

      <h2>Overdue Tasks</h2>
      {overdueTasks.length === 0 ? (
        <p>No overdue tasks</p>
      ) : (
        <ul>
          {overdueTasks.map((task, index) => (
            <li key={index}>{task.name} is overdue!</li>
          ))}
        </ul>
      )}
    </div>
  );
}
