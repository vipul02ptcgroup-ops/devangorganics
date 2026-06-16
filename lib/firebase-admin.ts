import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

type FirebaseAdminConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

export class FirebaseAdminConfigError extends Error {
  constructor() {
    super("Authentication service is temporarily unavailable.");
    this.name = "FirebaseAdminConfigError";
  }
}

const firebaseAdminEnv = {
  projectId:
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "",
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "",
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n"
  ),
};

export const isFirebaseAdminConfigured = Boolean(
  firebaseAdminEnv.projectId &&
    firebaseAdminEnv.clientEmail &&
    firebaseAdminEnv.privateKey
);

function readFirebaseAdminConfig(): FirebaseAdminConfig {
  if (!isFirebaseAdminConfigured) {
    throw new FirebaseAdminConfigError();
  }

  return firebaseAdminEnv as FirebaseAdminConfig;
}

function getFirebaseAdminApp() {
  const config = readFirebaseAdminConfig();

  return (
    getApps()[0] ||
    initializeApp({
      credential: cert(config),
    })
  );
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}
