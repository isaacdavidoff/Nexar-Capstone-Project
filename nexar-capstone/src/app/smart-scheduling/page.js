"use client";

import {
  prioritizeTasks,
  detectWorkloadClustering,
  suggestStudyBlocks,
  generateWeeklyWorkload,
} from "../../utils/smartScheduling";

export default function SmartSchedulingPage() {
  const tasks = [
    {
      id: 1,
      title: "Math Assignment",
      dueDate: "2026-04-10",
      estimatedHours: 3,
    },
    {
      id: 2,
      title: "Quiz Study",
      dueDate: "2026-04-10",
      estimatedHours: 2,
    },
    {
      id: 3,
      title: "English Essay",
      dueDate: "2026-04-12",
      estimatedHours: 4,
    },
    {
      id: 4,
      title: "Biology Reading",
      dueDate: "2026-04-14",
      estimatedHours: 1,
    },
  ];

  const prioritizedTasks = prioritizeTasks(tasks);
  const clusteredDays = detectWorkloadClustering(tasks);
  const studyBlocks = suggestStudyBlocks(tasks);
  const weeklyWorkload = generateWeeklyWorkload(tasks);

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Smart Scheduling</h1>
      <p style={styles.description}>
        This feature prioritizes tasks by deadline proximity, detects workload
        clustering, suggests study blocks, and generates a weekly workload
        visualization.
      </p>

      <section style={styles.section}>
        <h2>1. Prioritized Tasks</h2>
        <ul>
          {prioritizedTasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> — Due: {task.dueDate} —{" "}
              {task.estimatedHours} hour(s)
            </li>
          ))}
        </ul>
      </section>

      <section style={styles.section}>
        <h2>2. Workload Clustering</h2>
        <ul>
          {clusteredDays.map((day) => (
            <li key={day.date}>
              <strong>{day.date}</strong> — {day.taskCount} task(s),{" "}
              {day.totalHours} hour(s)
              {day.isClustered && " — High workload detected"}
            </li>
          ))}
        </ul>
      </section>

      <section style={styles.section}>
        <h2>3. Suggested Study Blocks</h2>
        <ul>
          {studyBlocks.map((block, index) => (
            <li key={`${block.taskId}-${index}`}>
              <strong>{block.taskTitle}</strong> — {block.date} —{" "}
              {block.duration} hour(s)
            </li>
          ))}
        </ul>
      </section>

      <section style={styles.section}>
        <h2>4. Weekly Workload Visualization</h2>
        <div style={styles.chartContainer}>
          {weeklyWorkload.map((day) => (
            <div key={day.date} style={styles.chartRow}>
              <div style={styles.chartLabel}>{day.date}</div>
              <div style={styles.barWrapper}>
                <div
                  style={{
                    ...styles.bar,
                    width: `${day.hours * 60}px`,
                  }}
                />
              </div>
              <div style={styles.chartValue}>{day.hours} hr</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles = {
  container: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  description: {
    fontSize: "16px",
    marginBottom: "24px",
    lineHeight: "1.5",
  },
  section: {
    marginBottom: "32px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fafafa",
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "16px",
  },
  chartRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  chartLabel: {
    width: "120px",
    fontSize: "14px",
  },
  barWrapper: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    borderRadius: "8px",
    height: "24px",
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: "8px",
  },
  chartValue: {
    width: "60px",
    fontSize: "14px",
  },
};