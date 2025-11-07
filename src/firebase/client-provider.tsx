
'use client';

import React from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';

export const FirebaseClientProvider = ({ children }: { children: React.ReactNode }) => {
  const firebaseServices = initializeFirebase();

  return <FirebaseProvider value={firebaseServices}>{children}</FirebaseProvider>;
};
