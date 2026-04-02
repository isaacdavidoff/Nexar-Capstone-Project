import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

const mapSnapshot = (snapshot) => {
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      courseId: doc.id,
      ...data,
   
      createdAt: data.createdAt?.toDate() || null,
      updatedAt: data.updatedAt?.toDate() || null,
    };
  });
};

export const createCourse = async ({ userId, courseName, term, color }) => {
  if (!userId) throw new Error("User ID is required to create a course");

  const newCourse = {
    userId,
    courseName: courseName.trim(),
    term: term?.trim() || "",
    color: color || "#6366f1",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const courseRef = await addDoc(collection(db, "courses"), newCourse);


  return { 
    courseId: courseRef.id, 
    ...newCourse,
    createdAt: newCourse.createdAt.toDate(),
    updatedAt: newCourse.updatedAt.toDate()
  };
};

export const subscribeToCourses = (userId, callback) => {
  if (!userId) return () => {};

  const q = query(
    collection(db, "courses"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc") 
  );

  return onSnapshot(
    q,
    (snapshot) => callback(mapSnapshot(snapshot)),
    (error) => console.error("Real-time subscription error:", error)
  );
};

export const getCoursesByUser = async (userId) => {
  if (!userId) return [];

  const q = query(
    collection(db, "courses"),
    where("userId", "==", userId),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);
  return mapSnapshot(snapshot);
};

export const updateCourse = async (courseId, updates) => {
  if (!courseId) throw new Error("Course ID is required");
  
  const courseRef = doc(db, "courses", courseId);
  const now = Timestamp.now();
  
  await updateDoc(courseRef, {
    ...updates,
    updatedAt: now,
  });

  return { id: courseId, ...updates, updatedAt: now.toDate() };
};

export const deleteCourse = async (courseId) => {
  if (!courseId) throw new Error("Course ID is required for deletion");

  await deleteDoc(doc(db, "courses", courseId));
};