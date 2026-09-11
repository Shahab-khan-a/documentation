// Firebase configuration options
// Can be customized via environment variables in .env.local or production hosting

export const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyB_BiM0se_s0dKJOYvGYvqDvr2SfIuf4i8",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "eservice-website-6af4e.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "eservice-website-6af4e",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "eservice-website-6af4e.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "1040866210192",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:1040866210192:web:06df04b2e0bc093568c315",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    "G-5NHJ5V0WYS",
};
