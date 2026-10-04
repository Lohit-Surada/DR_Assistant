import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDGW_sqeyE2eo2VRih40TsH3slCp-ejf3M',
  authDomain: 'diabetic-retinopathy-assistant.firebaseapp.com',
  projectId: 'diabetic-retinopathy-assistant',
  storageBucket: 'diabetic-retinopathy-assistant.firebasestorage.app',
  messagingSenderId: '715771927096',
  appId: '1:715771927096:web:48e31685dff6643510e4cd',
  measurementId: 'G-T3NNDZ0VNL',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(firebaseApp) : null;
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
