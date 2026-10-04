import { useEffect } from 'react';
import { VITE_LESION_DETECTION_URL } from '../services/api';

export default function LesionDetection() {
  useEffect(() => {
    window.location.assign(VITE_LESION_DETECTION_URL);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <p className="text-sm text-slate-600">Opening the lesion detection workspace...</p>
    </main>
  );
}
