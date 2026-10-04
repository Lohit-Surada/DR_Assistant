import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { saveAnalysis, subscribeToUserAnalyses } from '../services/analysisStore';
import { classifyImage } from '../services/api';

const defaultGradCamResults = [
  {
    key: 'input',
    title: 'Input Fundus',
    description: 'Original retinal fundus image provided for analysis.',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'gradcam',
    title: 'True Grad-CAM',
    description: 'Highlights image regions that contributed to the selected model prediction.',
    image:
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'attention',
    title: 'Retinal Attention Map',
    description: 'Visual representation of regions emphasized by the retinal image processing pipeline.',
    image:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'feature',
    title: 'YOLO26 Feature Visualization',
    description: 'Visualization of internal model feature representations.',
    image:
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=900&q=80',
  },
];

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const { currentUser } = useAuth();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [classificationResult, setClassificationResult] = useState(null);
  const [gradCamResults, setGradCamResults] = useState(defaultGradCamResults);
  const [reportAvailable, setReportAvailable] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    if (!currentUser?.id && !currentUser?.email) {
      setAnalysisHistory([]);
      return undefined;
    }

    setHistoryError('');
    return subscribeToUserAnalyses(
      currentUser.id || currentUser.email,
      setAnalysisHistory,
      () => setHistoryError('Unable to sync analysis history right now.'),
    );
  }, [currentUser]);

  const setImageFile = useCallback(async (file) => {
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(file);
    setImageName(file.name);
    setImagePreview(previewUrl);
    setClassificationResult(null);
    setGradCamResults(defaultGradCamResults);
    setReportAvailable(false);

    const result = await classifyImage(file);
    setClassificationResult(result);
    setReportAvailable(true);

    if (currentUser?.id || currentUser?.email) {
      saveAnalysis({
        userId: currentUser.id || currentUser.email,
        userEmail: currentUser.email,
        image: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      }).catch(() => setHistoryError('Unable to save this analysis right now.'));
    }
  }, [currentUser, imagePreview]);

  const clearImage = useCallback(() => {
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setUploadedImage(null);
    setImageName('');
    setImagePreview('');
    setReportAvailable(false);
  }, [imagePreview]);

  const value = useMemo(
    () => ({
      uploadedImage,
      imageName,
      imagePreview,
      classificationResult,
      gradCamResults,
      reportAvailable,
      analysisHistory,
      historyError,
      setImageFile,
      clearImage,
      setClassificationResult,
      setGradCamResults,
      setReportAvailable,
    }),
    [uploadedImage, imageName, imagePreview, classificationResult, gradCamResults, reportAvailable, analysisHistory, historyError, setImageFile, clearImage],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error('useAnalysis must be used inside an AnalysisProvider');
  }

  return context;
}
