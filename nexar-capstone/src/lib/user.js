import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const createUser = async ({ userId, name, email, role }) => {
  const userRef = doc(db, "users", userId);

  const userData = {
    userId,
    name,
    email,
    role: role || "user",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await setDoc(userRef, userData);

  return userData;
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
  if (!userId) return;

  const userRef = doc(db, "users", userId);

  const unsubscribe = onSnapshot(
    userRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snapshot.id,
        ...snapshot.data(),
      });
    },
    (error) => {
      console.error("Error subscribing to user:", error);
    }
  );

  return unsubscribe;
};

export const deleteUserDoc = async (userId) => {
  if (!userId) return;

  const userRef = doc(db, "users", userId);
  await deleteDoc(userRef);
};