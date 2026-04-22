"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => console.log("Nexar PWA: Service Worker Registered"))
          .catch((err) => console.error("Nexar PWA: Registration Failed", err));
      });
    }
  }, []);

  return null; // This component doesn't render anything UI-wise
}