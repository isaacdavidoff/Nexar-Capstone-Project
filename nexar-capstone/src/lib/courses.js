import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const createCourse = async ({ userId, courseName, term, color }) => {
  const courseRef = await addDoc(collection(db, "courses"), {
    userId,
    courseName,
    term,
    color,
    createdAt: new Date(),
  });

  return courseRef.id;
};

export const getCoursesByUser = async (userId) => {
  const q = query(collection(db, "courses"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    courseId: doc.id,
    ...doc.data(),
  }));
};

export const deleteCourse = async (courseId) => {
  await deleteDoc(doc(db, "courses", courseId));
};