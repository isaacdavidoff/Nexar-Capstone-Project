"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { subscribeToUser } from "@/lib/user";

export default function useAuthUser() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let unsubscribeUser = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      // 1. Cleanup previous Firestore subscription
      if (unsubscribeUser) {
        unsubscribeUser();
        unsubscribeUser = null;
      }

      if (currentUser) {
        // 2. IMMEDIATE UPDATE: Set basic auth data so ProtectedRoute lets us in
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          loadingDoc: true // Flag to show we are still fetching Firestore data
        });

        // 3. AUGMENT: Fetch the full profile from Firestore
        unsubscribeUser = subscribeToUser(currentUser.uid, (userDoc) => {
          setUser((prev) => ({
            ...prev,
            ...userDoc,
            uid: currentUser.uid,
            loadingDoc: false
          }));
        });
      } else {
        // 4. LOGGED OUT: Explicitly set to null
        setUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

  return user;
}