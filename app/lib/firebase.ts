// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC7GmzKEmhAjwdAdTI1Z9Zb6F02HFdgGM",
  authDomain: "rocket-issues.firebaseapp.com",
  projectId: "rocket-issues",
  storageBucket: "rocket-issues.firebasestorage.app",
  messagingSenderId: "126653822529",
  appId: "1:126653822529:web:eea80269617d462edab8c0",
  measurementId: "G-17YC624M8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };