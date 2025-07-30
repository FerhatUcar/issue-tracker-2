importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDC7GmzKEmhAjwdAdTI1Z9Zb6F02HFdgGM",
  authDomain: "rocket-issues.firebaseapp.com",
  projectId: "rocket-issues",
  storageBucket: "rocket-issues.firebasestorage.app",
  messagingSenderId: "126653822529",
  appId: "1:126653822529:web:eea80269617d462edab8c0",
  measurementId: "G-17YC624M8H"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});
