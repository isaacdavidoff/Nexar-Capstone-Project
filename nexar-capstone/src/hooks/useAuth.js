"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * Returns:
 * - undefined -> loading
 * - null -> not logged in
 * - user object -> logged in
 */
export default function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
 
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ?? null);
    });

 
    return () => unsubscribe();
  }, []);

  return user;
}