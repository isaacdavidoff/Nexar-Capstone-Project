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

export const addTask = async (task) => {
  const date = new Date(task.dueDate);

  const docRef = await addDoc(collection(db, "tasks"), {
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
  });

  return docRef.id;
};


  export const getTasks = async (userId) => {
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      orderBy("dueDate", "asc")
    );
  
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  export const getTasksByCourse = async (courseId) => {
    const q = query(
      collection(db, "tasks"),
      where("courseId", "==", courseId),
      orderBy("dueDate", "asc")
    );
  
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
  
    return snapshot.docs.map((doc) => ({
      taskId: doc.id,
      ...doc.data(),
    }));
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
  
    return snapshot.docs.map((doc) => ({
      taskId: doc.id,
      ...doc.data(),
    }));
  };

  export const updateTask = async (taskId, updates) => {
    const docRef = doc(db, "tasks", taskId);
  
    return await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  };

  export const deleteTask = async (taskId) => {
    return await deleteDoc(doc(db, "tasks", taskId));
  };