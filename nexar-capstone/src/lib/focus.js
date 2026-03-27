import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export const createSession = async ({ userId, taskId, duration }) => {
  const sessionRef = await addDoc(collection(db, "focusSessions"), {
    userId,
    taskId,
    duration,
    createdAt: new Date(),
  });

  return sessionRef.id;
};

export const getSessionsByUser = async (userId) => {
  const q = query(
    collection(db, "focusSessions"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    sessionId: doc.id,
    ...doc.data(),
  }));
};