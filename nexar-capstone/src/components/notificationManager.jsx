"use client";

import { useEffect, useRef } from "react";
import { useNexarNotifications } from "@/context/Notification";
import useTasks from "@/hooks/useTasks";
import useAuth from "@/hooks/useAuth";
import { toDate } from "@/services/task";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NotificationManager() {
  const user = useAuth();
  const { tasks } = useTasks(user?.uid || user?.id);
  const { sendNotification } = useNexarNotifications();
  
  const notifiedTasks = useRef(new Set());

  useEffect(() => {
    if (!tasks) return;

    const now = new Date();

    tasks.forEach(async (task) => {
      const due = toDate(task.dueDate);
      
      
      // Skip if: no date, already completed, or already notified in this session
      if (!due || task.status === "completed" || notifiedTasks.current.has(task.id)) return;

      const diffInMinutes = (due.getTime() - now.getTime()) / (1000 * 60);

      // 1. Define the alert conditions
      const isUpcoming = diffInMinutes > 0 && diffInMinutes < 30; // Due in next 30m
      const isRecentOverdue = diffInMinutes < 0 && diffInMinutes > -10; // Missed in last 10m

      // 2. Trigger if either condition is met
      if (isUpcoming || isRecentOverdue) {
        const title = isUpcoming ? "Upcoming Deadline" : "Task Overdue!";
        const message = isUpcoming 
          ? `"${task.title}" is due soon! Time to focus.` 
          : `"${task.title}" was due recently. Check your schedule!`;

        sendNotification(title, {
          body: message,
          tag: task.id, // Ensures one notification per task across tabs
        });

        // 3. Mark as notified so we don't spam the user
        notifiedTasks.current.add(task.id);
      }
// Inside your NotificationManager loop
const remindersSnapshot = await getDocs(collection(db, `tasks/${task.id}/reminders`));
const pendingReminders = remindersSnapshot.docs.map(doc => doc.data());

pendingReminders.forEach(async (reminder) => {
  const isTime = reminder.reminderTime.toDate() <= new Date();
  
  if (isTime && !reminder.sent && reminder.type === 'push') {
    sendNotification("Nexar Reminder", { body: task.title });
    
    // IMMEDIATELY update Firestore so other tabs don't send it too
    await updateDoc(doc(db, `tasks/${task.id}/reminders`, reminder.reminderId), {
      sent: true
    });
  }
});

    });
  }, [tasks, sendNotification]);

  return null; 
}