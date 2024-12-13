// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4PAEdEISWMvQgsDOf4gol3zPt6rjVC7o",
  authDomain: "demodemo-cef3f.firebaseapp.com",
  projectId: "demodemo-cef3f",
  storageBucket: "demodemo-cef3f.firebasestorage.app",
  messagingSenderId: "375924927725",
  appId: "1:375924927725:web:e9b0f9aaed1bb74027b0e4",
  measurementId: "G-L51MQPF3HR"
};

// Initialize Firebase and export services
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);