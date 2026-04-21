import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  Timestamp,
  increment
} from "firebase/firestore";
import { db } from "./firebase";

export const createUser = async (user) => {
  try {
    await setDoc(doc(db, "users", user.userId), {
      name: user.name,
      email: user.email,
      role: user.role || "user",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),

      stats: {
        totalFocusMinutes: 0,
        completedTasksCount: 0,
        currentStreak: 0,
        lastActiveDate: null
      }
    });
    console.log("User created in Firestore:", user.userId);
  } catch (error) {
    console.error("Error creating user in Firestore:", error);
    throw error;
  }
};

export const getUser = async (userId) => {
  if (!userId) return null;

  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const subscribeToUser = (userId, callback) => {
  if (!userId) return () => {}; 

  const userRef = doc(db, "users", userId);
  return onSnapshot(userRef, (snapshot) => {
    callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
  }, (error) => {
    console.error("User subscription error:", error);
  });
};


export const updateUser = async (userId, updates) => {
  const userRef = doc(db, "users", userId);
  
  const dataWithTimestamp = {
    ...updates,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(userRef, dataWithTimestamp);
  return dataWithTimestamp;
};

export const recordCompletedSession = async (userId, minutes) => {
  return await updateUser(userId, {
    "stats.totalFocusMinutes": increment(minutes),
    "stats.sessionsCompleted": increment(1),
    "stats.lastActiveDate": Timestamp.now()
  });
};