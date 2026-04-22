import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const scheduleAutoReminders = async (taskId, dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const totalLeadTimeMs = due - now;
  const thirtyMinsMs = 30 * 60 * 1000;

  // 1. Define your milestones (e.g., 1 day before, 6 hours before, 30 mins before)
  // Or use percentages of the total time remaining
  const intervals = [
    totalLeadTimeMs * 0.5,  // Halfway point
    totalLeadTimeMs * 0.2,  // 80% through the wait
    thirtyMinsMs            // The 30-minute hard limit
  ];

  const reminderPromises = intervals.map((msFromDue) => {
    const reminderTime = new Date(due.getTime() - msFromDue);

    // Only schedule if the reminder time is in the future
    if (reminderTime > now) {
      return addDoc(collection(db, `tasks/${taskId}/reminders`), {
        reminderTime: Timestamp.fromDate(reminderTime),
        type: "push",
        sent: false,
        createdAt: Timestamp.now(),
        label: msFromDue === thirtyMinsMs ? "Final Call" : "Checkpoint"
      });
    }
  });

  await Promise.all(reminderPromises);
};