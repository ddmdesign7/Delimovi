import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// User's specified Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDxeraU8_RHQ9S8ul0eJPOPtbX7T6N22h0",
  authDomain: "delimovi.firebaseapp.com",
  projectId: "delimovi",
  storageBucket: "delimovi.firebasestorage.app",
  messagingSenderId: "704811880534",
  appId: "1:704811880534:web:0d2243d84c0c17d71e6bf7"
};

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Authentication instance
export const auth = getAuth(app);

export default app;
