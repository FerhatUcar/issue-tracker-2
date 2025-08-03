"use client";

import { useEffect } from "react";
import { getToken, messaging } from "@/app/lib/firebase";

const PushNotificationInitializer = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const setupPush = async () => {
      try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          console.log("Notificaties geweigerd");
          return;
        }

        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (!token) {
          console.warn("Geen push-token beschikbaar");
          return;
        }

        await fetch("/api/save-push-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
      } catch (err) {
        console.error("Push setup faalde:", err);
      }
    };

    setupPush();
  }, []);

  return null;
};

export default PushNotificationInitializer;
