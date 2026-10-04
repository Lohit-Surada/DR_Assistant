import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { firestore } from './firebase';

const analysesCollection = collection(firestore, 'analyses');

export function subscribeToUserAnalyses(userId, onChange, onError) {
  const analysesQuery = query(analysesCollection, where('userId', '==', String(userId)));

  return onSnapshot(
    analysesQuery,
    (snapshot) => {
      const analyses = snapshot.docs
        .map((document) => {
          const data = document.data();
          return {
            id: document.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.uploadedAt,
          };
        })
        .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));

      onChange(analyses);
    },
    onError,
  );
}

export function saveAnalysis({ userId, userEmail, image }) {
  return addDoc(analysesCollection, {
    userId: String(userId),
    userEmail,
    image,
    uploadedAt: new Date().toISOString(),
    createdAt: serverTimestamp(),
  });
}
