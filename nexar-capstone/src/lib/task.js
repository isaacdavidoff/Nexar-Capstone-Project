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
} from "firebase/firestore";

import { db } from "./firebase";

import { onSnapshot } from "firebase/firestore";

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
    estimatedTime: task.estimatedTime || 60,

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

  const deletions = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, "tasks", docSnap.id))
  );

  await Promise.all(deletions);
};
