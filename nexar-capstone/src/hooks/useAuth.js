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
  
      if (unsubscribeUser) {
        unsubscribeUser();
        unsubscribeUser = null;
      }

      // src/hooks/useAuth.js
if (currentUser?.uid) {
  unsubscribeUser = subscribeToUser(currentUser.uid, (userDoc) => {
    // Merge the Auth UID with the Firestore document data
    setUser({
      ...userDoc,
      uid: currentUser.uid // Force the UID into the object
    });
  });
} else {
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