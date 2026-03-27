import { db } from "../firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

export const createUser = async ({ userId, name, email, role }) => {
  const userRef = doc(db, "users", userId);

  await setDoc(userRef, {
    userId,
    name,
    email,
    role,
    createdAt: new Date(),
  });
};

export const getUser = async (userId) => {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  return snapshot.data();
};

export const deleteUserDoc = async (userId) => {
  const userRef = doc(db, "users", userId);
  await deleteDoc(userRef);
};