import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { updateUser } from "./user";

/**
 * Starts a new focus session in Firestore.
 * @param {Object} params - { userId, taskId, duration }
 * @returns {Promise<string>} The new session ID
 */
export const createSession = async ({ userId, taskId, duration, title }) => {
  if (!userId) {
    throw new Error("User ID is required to start a session.");
  }

  const sessionData = {
    userId,
    taskId: taskId || null,
    title: title || "Focus Session",

    plannedDuration: Number(duration) || 0,
    actualDuration: 0,

    status: "active",

    startedAt: Timestamp.now(),
    endedAt: null,
    createdAt: Timestamp.now(),
  };

  const sessionRef = await addDoc(collection(db, "focusSessions"), sessionData);
  return sessionRef.id;
};

/**
 * Finalizes a focus session and updates the user's aggregate statistics.
 * @param {string} userId - Current user ID
 * @param {string} sessionId - ID of the session to close
 * @param {number} actualMinutes - Final time elapsed
 */
export const completeSession = async (userId, sessionId, updates) => {
  if (!userId || !sessionId) return;

  const sessionRef = doc(db, "focusSessions", sessionId);

  const minutes = Number(updates.actualDuration || 0);

  await updateDoc(sessionRef, {
    actualDuration: minutes,
    status: updates.status || "completed",
    endedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  await updateUser(userId, {
    "stats.totalFocusMinutes": increment(minutes),
    "stats.lastActiveDate": Timestamp.now(),
  });
};

/**
 * Simple update for session metadata (e.g., pausing or status changes).
 */
export const updateSession = async (sessionId, updates) => {
  const ref = doc(db, "focusSessions", sessionId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

/**
 * Real-time subscription to a user's recent focus history.
 */
export const subscribeToRecentSessions = (userId, callback, maxResults = 10) => {
  if (!userId) return () => {};

  const q = query(
    collection(db, "focusSessions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );

  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      startedAt: doc.data().startedAt?.toDate(),
      endedAt: doc.data().endedAt?.toDate(),
    }));
    callback(sessions);
  });
};