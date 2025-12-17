
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBV93D7BjDtsJHqVWEPmBVxMQkfvHS8MPM",
  authDomain: "education-pixel.firebaseapp.com",
  projectId: "education-pixel",
  storageBucket: "education-pixel.appspot.com",
  messagingSenderId: "389938895404",
  appId: "1:389938895404:web:87468900a9e9f360d88f89",
  measurementId: "G-XXCS05XYVS"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// The provider and hook exports remain for components that use them, 
// but direct imports from here are also possible now.
export * from './provider';
export * from './auth/use-user';
