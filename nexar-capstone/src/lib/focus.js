import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc // <--- Added this import
} from "firebase/firestore";

export const createSession = async ({
  userId,
  taskId,
  duration,
}) => {
  // Guard against undefined values
  if (!userId || !taskId) {
    throw new Error("Missing required fields: userId and taskId are mandatory.");
  }

  const sessionRef = await addDoc(collection(db, "focusSessions"), {
    userId,
    taskId,
    plannedDuration: duration ?? 0, // Fallback to 0 if duration is undefined
    actualDuration: 0,
    status: "active",
    startedAt: new Date(),
    endedAt: null,
    createdAt: new Date(),
  });

  return sessionRef.id;
};

export const updateSession = async (sessionId, updates) => {
  const ref = doc(db, "focusSessions", sessionId);
  await updateDoc(ref, updates);
};