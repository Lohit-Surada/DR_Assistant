import { onValue, push, query, ref, orderByChild, set } from 'firebase/database';
import { realtimeDb } from './firebase';

export function subscribeToUserAnalyses(userId, onChange, onError) {
  const analysesQuery = query(ref(realtimeDb, `analyses/${String(userId)}`), orderByChild('createdAt'));

  return onValue(analysesQuery, (snapshot) => {
    const analyses = Object.entries(snapshot.val() || {})
      .map(([id, data]) => ({ id, ...data }))
      .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
    onChange(analyses);
  }, onError);
}

export function saveAnalysis({ userId, userEmail, image }) {
  const analysisRef = push(ref(realtimeDb, `analyses/${String(userId)}`));
  return set(analysisRef, {
    userId: String(userId),
    userEmail,
    image,
    uploadedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });
}
