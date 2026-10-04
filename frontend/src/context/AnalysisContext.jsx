import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { saveAnalysis, subscribeToUserAnalyses } from '../services/analysisStore';
import { classifyImage, generateGradCAM } from '../services/api';

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const { currentUser } = useAuth();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [classificationResult, setClassificationResult] = useState(null);
  const [gradCamResults, setGradCamResults] = useState([]);
  const [gradCamCombined, setGradCamCombined] = useState('');
  const [gradCamStatus, setGradCamStatus] = useState('idle');
  const [gradCamError, setGradCamError] = useState('');
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
    setGradCamResults([]);
    setGradCamCombined('');
    setGradCamStatus('classifying');
    setGradCamError('');
    setReportAvailable(false);

    const result = await classifyImage(file);
    setClassificationResult(result);
    setReportAvailable(true);

    setGradCamStatus('generating');
    let visualization;
    try {
      visualization = await generateGradCAM(file);
    } catch (error) {
      setGradCamStatus('error');
      setGradCamError(error.message || 'Unable to generate the Grad-CAM visualization.');
      throw error;
    }
    const panelDefinitions = [
      ['input', 'Input Fundus', 'Original retinal fundus image provided for analysis.', 'input_fundus'],
      ['gradcam', 'True YOLO26 Grad-CAM', 'Regions contributing to the model prediction.', 'gradcam'],
      ['attention', 'Retinal Attention Map', 'CLAHE and local-contrast retinal attention visualization.', 'attention'],
      ['feature', 'YOLO26 Feature Visualization', 'Visualization of internal model feature representations.', 'feature_visualization'],
    ];
    setGradCamResults(
      panelDefinitions.map(([key, title, description, resultKey]) => ({
        key,
        title,
        description,
        image: visualization.results[resultKey],
      })),
    );
    setGradCamCombined(visualization.results.combined);
    setGradCamStatus('ready');

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
    setGradCamResults([]);
    setGradCamCombined('');
    setGradCamStatus('idle');
    setGradCamError('');
  }, [imagePreview]);

  const value = useMemo(
    () => ({
      uploadedImage,
      imageName,
      imagePreview,
      classificationResult,
      gradCamResults,
      gradCamCombined,
      gradCamStatus,
      gradCamError,
      reportAvailable,
      analysisHistory,
      historyError,
      setImageFile,
      clearImage,
      setClassificationResult,
      setGradCamResults,
      setReportAvailable,
    }),
    [uploadedImage, imageName, imagePreview, classificationResult, gradCamResults, gradCamCombined, gradCamStatus, gradCamError, reportAvailable, analysisHistory, historyError, setImageFile, clearImage],
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
