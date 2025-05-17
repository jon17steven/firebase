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
    // Simulate an unauthenticated user initially after a short delay
    const timeoutId = setTimeout(() => callback(null), 100); 
    
    // To test authenticated routes:
    // const timeoutId = setTimeout(() => callback({ uid: 'mock-user-id', email: 'user@example.com', displayName: 'Mock User' }), 100);
    // To test admin routes:
    // const timeoutId = setTimeout(() => callback({ uid: 'mock-admin-id', email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com', displayName: 'Mock Admin' }), 100);
    
    return () => clearTimeout(timeoutId); // Unsubscribe function clears the timeout
  },
  // Add other mock auth functions as needed
  signInWithEmailAndPassword: async (email?: string, password?: string) => {
    console.warn("Firebase Auth not initialized. Mocking signInWithEmailAndPassword.");
    if (email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com') && password === 'adminpass') {
      // Simulate admin login, then trigger onAuthStateChanged
      const adminUser = { uid: 'mock-admin-id', email, displayName: 'Mock Admin' };
      // This direct call is a simplification for the mock. Real Firebase handles this.
      // auth.onAuthStateChanged_listeners?.forEach(listener => listener(adminUser));
      return { user: adminUser };
    }
    if (email && password) {
      // Simulate regular user login
      const regularUser = { uid: 'mock-user-id', email, displayName: 'Mock User' };
      // auth.onAuthStateChanged_listeners?.forEach(listener => listener(regularUser));
      return { user: regularUser };
    }
    throw new Error('Mock auth error: Invalid credentials or missing email/password.');
  },
  createUserWithEmailAndPassword: async (email?: string, password?: string) => {
    console.warn("Firebase Auth not initialized. Mocking createUserWithEmailAndPassword.");
     if (email && password) {
      const newUser = { user: { uid: 'mock-new-user-id', email, displayName: 'New Mock User' } };
      // auth.onAuthStateChanged_listeners?.forEach(listener => listener(newUser.user));
      return newUser;
    }
    throw new Error('Mock auth error: Missing email/password for signup.');
  },
  signOut: async () => {
    console.warn("Firebase Auth not initialized. Mocking signOut.");
    // Simulate state change after sign out
     const event = new CustomEvent('mockAuthSignOut'); // useAuthListener listens to this
     window.dispatchEvent(event);
     // auth.onAuthStateChanged_listeners?.forEach(listener => listener(null));
  }
};
export const db = {}; // Placeholder Firestore instance

// Ensure NEXT_PUBLIC_ADMIN_EMAIL is available client-side for mock logic
if (typeof window !== 'undefined') {
  // console.log('NEXT_PUBLIC_ADMIN_EMAIL:', process.env.NEXT_PUBLIC_ADMIN_EMAIL);
}
