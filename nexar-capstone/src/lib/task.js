import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  onSnapshot
} from "firebase/firestore";

import { db } from "./firebase";


export const subscribeToTasks = (userId, callback) => {
  if (!userId) return () => {};

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    orderBy("dueDate", "asc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      callback(mapSnapshot(snapshot));
    },
    (error) => {
      console.error("subscribeToTasks error:", error);
    }
  );
};

export const subscribeToUpcomingTasks = (userId, callback) => {
  if (!userId) return () => {};

  const now = Timestamp.now();

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    where("dueDate", ">=", now),
    orderBy("dueDate", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(mapSnapshot(snapshot));
  });
};

export const subscribeToOverdueTasks = (userId, callback) => {
  if (!userId) return () => {};

  const now = Timestamp.now();

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    where("dueDate", "<", now),
    orderBy("dueDate", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(mapSnapshot(snapshot));
  });
};

const mapSnapshot = (snapshot) => {
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
   
      dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : data.dueDate,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    };
  });
};

export const addTask = async (task) => {
  const safeDate = (value) => {
    if (!value) return new Date();

    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const date = safeDate(task.dueDate);

  const newTask = {
    userId: task.userId,

    courseId: task.courseId,
    courseName: task.courseName,
    courseColor: task.courseColor,

    title: task.title,
    type: task.type,
    status: "pending",

    dueDate: Timestamp.fromDate(date),
    dueDateDay: date.toISOString().split("T")[0],

    priority: task.priority || "medium",
  priorityWeight: task.priority === "high" ? 3 : task.priority === "low" ? 1 : 2,
    estimatedTime: task.estimatedTime || 60,
    estimatedMinutes: Number(task.estimatedTime) || 60,

    notes: task.notes || "",

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, "tasks"), newTask);

  return { id: docRef.id, ...newTask };
};

export const getTasks = async (userId) => {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    orderBy("dueDate", "asc")
  );

  const snapshot = await getDocs(q);
  return mapSnapshot(snapshot);
};

export const getTasksByDay = async (userId, day) => {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    where("dueDateDay", "==", day)
  );

  const snapshot = await getDocs(q);
  return mapSnapshot(snapshot);
};

export const getTasksByCourse = async (courseId) => {
  const q = query(
    collection(db, "tasks"),
    where("courseId", "==", courseId),
    orderBy("dueDate", "asc")
  );

  const snapshot = await getDocs(q);
  return mapSnapshot(snapshot);
};

export const getUpcomingTasks = async (userId) => {
  const now = Timestamp.now();

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    where("dueDate", ">=", now),
    orderBy("dueDate", "asc")
  );

  const snapshot = await getDocs(q);
  return mapSnapshot(snapshot);
};

export const getOverdueTasks = async (userId) => {
  const now = Timestamp.now();

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    where("dueDate", "<", now),
    orderBy("dueDate", "asc")
  );

  const snapshot = await getDocs(q);
  return mapSnapshot(snapshot);
};

export const getTasksByStatus = async (userId, status) => {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    where("status", "==", status),
    orderBy("dueDate", "asc")
  );

  const snapshot = await getDocs(q);
  return mapSnapshot(snapshot);
};

export const updateTask = async (taskId, updates) => {
  const docRef = doc(db, "tasks", taskId);
  
  const finalUpdates = { ...updates, updatedAt: Timestamp.now() };

  // Sync dueDateDay if the dueDate is being changed
  if (updates.dueDate) {
    const d = new Date(updates.dueDate);
    if (!isNaN(d.getTime())) {
      finalUpdates.dueDate = Timestamp.fromDate(d);
      finalUpdates.dueDateDay = d.toISOString().split("T")[0];
    }
  }

  return await updateDoc(docRef, finalUpdates);
};

export const deleteTask = async (taskId) => {
  return await deleteDoc(doc(db, "tasks", taskId));
};


export const deleteTasksByUser = async (userId) => {
  const q = query(collection(db, "tasks"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);

  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  await batch.commit();
};

/**
 * Deletes all tasks associated with a specific course.
 * Useful for cascading deletes when a course is removed.
 */
export const deleteTasksByCourse = async (courseId) => {
  if (!courseId) return;

  const q = query(
    collection(db, "tasks"), 
    where("courseId", "==", courseId)
  );
  
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);

  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  await batch.commit();
  console.log(`Successfully deleted ${snapshot.size} tasks for course: ${courseId}`);
};

export const syncAutoReminders = async (taskId, dueDate) => {
  const now = new Date();
  const due = dueDate instanceof Date ? dueDate : dueDate.toDate();
  const totalLeadTimeMs = due.getTime() - now.getTime();

  // 1. Cleanup: Remove existing reminders
  const remindersRef = collection(db, "tasks", taskId, "reminders");
  const existing = await getDocs(remindersRef);
  
  // Use a batch or Promise.all to clear old data
  await Promise.all(existing.docs.map(doc => deleteDoc(doc.ref)));

  // 2. Define milestones
  const thirtyMinsMs = 30 * 60 * 1000;
  const midPointMs = totalLeadTimeMs * 0.5;
  const milestones = [midPointMs, thirtyMinsMs];

  // 3. Create reminders, filtering out past times
  const reminderPromises = milestones
    .map((msFromDue) => {
      const reminderTime = new Date(due.getTime() - msFromDue);

      if (reminderTime > now) {
        const remindersRef = collection(db, "tasks", taskId, "reminders");
  
        // Create a reference first to get the ID
        const newReminderRef = doc(remindersRef); 
        
        return setDoc(newReminderRef, {
          reminderId: newReminderRef.id, // 👈 Store the ID explicitly
          reminderTime: Timestamp.fromDate(reminderTime),
          type: "push",
          sent: false,
          label: msFromDue === thirtyMinsMs ? "Final Warning" : "Checkpoint",
          createdAt: Timestamp.now(),
        });
      }
      return null;
    })
    .filter(p => p !== null); // 👈 Only attempt to resolve actual database writes

  await Promise.all(reminderPromises);
};