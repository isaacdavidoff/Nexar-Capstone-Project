"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/login"); 
    }
  }, [user, router]);

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (user === null) return null;

  return children;
}