
'use client';

import React from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { auth, db, app } from '@/firebase'; // Corrected import

export const FirebaseClientProvider = ({ children }: { children: React.ReactNode }) => {
  // The Firebase services are now directly imported and passed to the provider.
  const firebaseServices = { app, auth, db };

  return <FirebaseProvider value={firebaseServices}>{children}</FirebaseProvider>;
};
