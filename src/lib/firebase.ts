// TODO: Replace with your actual Firebase configuration
// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { app, auth, db };

// Placeholder exports for now
export const app = {};
export const auth = {
  // Mock onAuthStateChanged for useAuthListener
  onAuthStateChanged: (callback: (user: any) => void) => {
    console.warn("Firebase Auth not initialized. Using mock onAuthStateChanged.");
    // Simulate an unauthenticated user initially
    // setTimeout(() => callback(null), 100); 
    // To test authenticated routes:
    // setTimeout(() => callback({ uid: 'mock-user-id', email: 'user@example.com', displayName: 'Mock User' }), 100);
    // To test admin routes:
    // setTimeout(() => callback({ uid: 'mock-admin-id', email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com', displayName: 'Mock Admin' }), 100);
    return () => {}; // Unsubscribe function
  },
  // Add other mock auth functions as needed
  signInWithEmailAndPassword: async (email?: string, password?: string) => {
    console.warn("Firebase Auth not initialized. Mocking signInWithEmailAndPassword.");
    if (email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com') && password === 'adminpass') {
      return { user: { uid: 'mock-admin-id', email, displayName: 'Mock Admin' } };
    }
    if (email && password) {
      return { user: { uid: 'mock-user-id', email, displayName: 'Mock User' } };
    }
    throw new Error('Mock auth error');
  },
  createUserWithEmailAndPassword: async (email?: string, password?: string) => {
    console.warn("Firebase Auth not initialized. Mocking createUserWithEmailAndPassword.");
     if (email && password) {
      return { user: { uid: 'mock-new-user-id', email, displayName: 'New Mock User' } };
    }
    throw new Error('Mock auth error');
  },
  signOut: async () => {
    console.warn("Firebase Auth not initialized. Mocking signOut.");
    // Simulate state change after sign out
     const event = new CustomEvent('mockAuthSignOut');
     window.dispatchEvent(event);
  }
};
export const db = {}; // Placeholder Firestore instance

// Ensure NEXT_PUBLIC_ADMIN_EMAIL is available client-side for mock logic
if (typeof window !== 'undefined') {
  // console.log('NEXT_PUBLIC_ADMIN_EMAIL:', process.env.NEXT_PUBLIC_ADMIN_EMAIL);
}
