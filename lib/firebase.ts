import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const firebaseConfigFromEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function readFirebaseConfig(): FirebaseConfig {
  const missing = [
    !firebaseConfigFromEnv.apiKey && "NEXT_PUBLIC_FIREBASE_API_KEY",
    !firebaseConfigFromEnv.authDomain && "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    !firebaseConfigFromEnv.projectId && "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    !firebaseConfigFromEnv.storageBucket && "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    !firebaseConfigFromEnv.messagingSenderId &&
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    !firebaseConfigFromEnv.appId && "NEXT_PUBLIC_FIREBASE_APP_ID",
  ].filter(Boolean) as string[];

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missing.join(", ")}`
    );
  }

  return firebaseConfigFromEnv as FirebaseConfig;
}

export const isFirebaseConfigured = Boolean(
  firebaseConfigFromEnv.apiKey &&
    firebaseConfigFromEnv.authDomain &&
    firebaseConfigFromEnv.projectId &&
    firebaseConfigFromEnv.storageBucket &&
    firebaseConfigFromEnv.messagingSenderId &&
    firebaseConfigFromEnv.appId
);

const firebaseApp = isFirebaseConfigured
  ? getApps()[0] ?? initializeApp(readFirebaseConfig())
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;
export { firebaseApp };
