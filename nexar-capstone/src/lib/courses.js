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
  return snapshot.docs.map((doc) => ({
    courseId: doc.id,
    ...doc.data(),
  }));
};

export const createCourse = async ({
  userId,
  courseName,
  term,
  color,
}) => {
  const newCourse = {
    userId,
    courseName,
    term,
    color: color || "#6366f1",

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const courseRef = await addDoc(collection(db, "courses"), newCourse);

  return { courseId: courseRef.id, ...newCourse };
};

export const subscribeToCourses = (userId, callback) => {
  if (!userId) return () => {};

  const q = query(
    collection(db, "courses"),
    where("userId", "==", userId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      callback(mapSnapshot(snapshot));
    },
    (error) => {
      console.error("subscribeToCourses error:", error);
    }
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
  const courseRef = doc(db, "courses", courseId);

  await updateDoc(courseRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteCourse = async (courseId) => {
  if (!courseId) throw new Error("Course ID is required for deletion");

  await deleteDoc(doc(db, "courses", courseId));
};