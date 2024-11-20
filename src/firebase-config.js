// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhlJkCj6nq2xR0mb1bU0R3BXMJJtZ88XE",
  authDomain: "demodemo-1f8b4.firebaseapp.com",
  projectId: "demodemo-1f8b4",
  storageBucket: "demodemo-1f8b4.firebasestorage.app",
  messagingSenderId: "92034680299",
  appId: "1:92034680299:web:2cba8d20e3e8407a7385ae"
};
// Initialize Firebase and export services
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);