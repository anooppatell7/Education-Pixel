
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig;

if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    try {
        firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
    } catch (e) {
        console.error("Could not parse NEXT_PUBLIC_FIREBASE_CONFIG. Please check the format.", e);
        throw new Error("Invalid Firebase client configuration provided in environment variables.");
    }
} else {
    // Fallback for local development if the single env var is not set
    firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };
}


if (!firebaseConfig.projectId) {
    throw new Error("Firebase configuration is missing. Ensure environment variables are set correctly.");
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// The provider and hook exports remain for components that use them, 
// but direct imports from here are also possible now.
export * from './provider';
export * from './auth/use-user';
