"use client";

import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [permission, setPermission] = useState(() =>
    "Notification" in window ? Notification.permission : "default"
  );

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const res = await Notification.requestPermission();
    setPermission(res);
  };

  const sendNotification = (title, options) => {
    if (permission === "granted") {
      new Notification(title, {
        icon: "/nexar-logo.png", // Path to your logo
        ...options,
      });
    }
  };

  return (
    <NotificationContext.Provider value={{ permission, requestPermission, sendNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNexarNotifications = () => useContext(NotificationContext);