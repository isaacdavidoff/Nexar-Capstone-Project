import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";



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

  await Promise.all(
    collections.map(async (col) => {
      const q = query(collection(db, col), where("userId", "==", userId));
      const snapshot = await getDocs(q);

      const deletions = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, col, docSnap.id))
      );

      await Promise.all(deletions);

      console.log(`Deleted ${col}`);
    })
  );
};

export const deleteAllUserData = async (userId) => {
  const batch = writeBatch(db);
  // Matches your latest schema additions
  const collections = ["tasks", "courses", "focusSession", "dailySummary"]; 

  for (const col of collections) {
    const q = query(collection(db, col), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    snapshot.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref); // Cleaner: uses the reference directly
    });
  }
  return await batch.commit();
};
/**
 * Subscribe to real-time task updates for a user
 * @param {string} userId
 * @param {function} callback - receives updated tasks array
 * @returns unsubscribe function
 */
export const subscribeToTasks = (userId, callback) => {
  if (!userId) return;

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    orderBy("dueDate", "asc")
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id, // ✅ consistent naming
        ...doc.data(),
      }));

      callback(tasks);
    },
    (error) => {
      console.error("Error subscribing to tasks:", error);
    }
  );

  return unsubscribe;
};

export const subscribeToUpcomingTasks = (userId, callback) => {
  if (!userId) return;

  const now = new Date();

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    where("dueDate", ">=", now),
    orderBy("dueDate", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(tasks);
  });
};

export const subscribeToOverdueTasks = (userId, callback) => {
  if (!userId) return;

  const now = new Date();

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    where("dueDate", "<", now),
    where("isCompleted", "==", false),
    orderBy("dueDate", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(tasks);
  });
};

export const subscribeToWeeklyTasks = (userId, startDate, endDate, callback) => {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    where("dueDate", ">=", startDate),
    where("dueDate", "<=", endDate),
    orderBy("dueDate", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(tasks);
  });
};