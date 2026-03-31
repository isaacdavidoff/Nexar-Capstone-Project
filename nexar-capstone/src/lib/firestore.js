import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Create a new user document in Firestore
 * @param {Object} user - { userId, name, email, role }
 */
export const createUser = async (user) => {
  try {
    await setDoc(doc(db, "users", user.userId), {
      name: user.name,
      email: user.email,
      role: user.role || "user",
      createdAt: new Date(),
    });
    console.log("User created in Firestore:", user.userId);
  } catch (error) {
    console.error("Error creating user in Firestore:", error);
    throw error;
  }
};

/**
 * Delete a user document in Firestore
 * @param {string} userId
 */
export const deleteUserDoc = async (userId) => {
  try {
    await deleteDoc(doc(db, "users", userId));
    console.log("User document deleted:", userId);
  } catch (error) {
    console.error("Error deleting user document:", error);
    throw error;
  }
};

/**
 * Optional: delete all other user-related data
 * @param {string} userId
 */
export const deleteUserData = async (userId) => {
  const collections = ["tasks", "courses", "sessions"];

  for (const col of collections) {
    const q = query(collection(db, col), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, col, docSnap.id));
      console.log(`Deleted ${col} doc: ${docSnap.id}`);
    });
  }
};