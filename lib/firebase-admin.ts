import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let isInitialized = false;

export function getFirebaseAdmin() {
  if (!isInitialized) {
    let configProjectId: string | undefined;
    try {
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        configProjectId = config.projectId;
      }
    } catch (e) {
      console.warn('Could not read firebase-applet-config.json during admin setup:', e);
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || configProjectId;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = rawPrivateKey?.replace(/\\n/g, '\n');

    try {
      if (getApps().length === 0) {
        if (projectId && clientEmail && privateKey) {
          console.log('Initializing Firebase Admin using explicit environment secrets.');
          initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey,
            }),
          });
        } else {
          console.log('Initializing Firebase Admin utilizing Platform Default Credentials.');
          // Automatically pick up default service account in Cloud Run container runtime
          initializeApp({
            projectId: projectId || undefined,
          });
        }
      }
      isInitialized = true;
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
      throw error;
    }
  }
}

export function getFirestoreAdmin() {
  getFirebaseAdmin();
  return getFirestore();
}
