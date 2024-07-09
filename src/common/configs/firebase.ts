import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

export function initializeFirebase() {
  const adminConfig: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  return admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });
}
