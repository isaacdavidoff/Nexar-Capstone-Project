
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const createSession = async ({
  userId,
  taskId,
  duration,
}) => {
  const sessionRef = await addDoc(collection(db, "focusSessions"), {
    userId,
    taskId,

    plannedDuration: duration, // what user intended
    actualDuration: 0,         // what they completed

    status: "active", // active | completed | abandoned

    startedAt: new Date(),
    endedAt: null,

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


export const updateSession = async (sessionId, updates) => {
  const ref = doc(db, "focusSessions", sessionId);
  await updateDoc(ref, updates);
};