import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import GradCAMViewer from '../components/GradCAMViewer';
import { useAnalysis } from '../context/AnalysisContext';

export default function GradCAM() {
  const { uploadedImage, gradCamResults, gradCamCombined, gradCamStatus, gradCamError } = useAnalysis();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="section-label">Analysis</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Grad-CAM Visualization</h1>
          <p className="mt-2 text-sm text-slate-600">Model explainability and retinal feature visualization</p>
        </div>
        <Link
          to="/home"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Dashboard
        </Link>
      </div>

      {!uploadedImage && (
        <div className="medical-card p-6 text-sm text-slate-600">
          Upload a fundus image from the dashboard before opening this visualization.
        </div>
      )}

      {gradCamStatus === 'classifying' && (
        <div className="medical-card mb-5 p-6 text-sm text-slate-600">Analyzing retinal image...</div>
      )}
      {gradCamStatus === 'generating' && (
        <div className="medical-card mb-5 p-6 text-sm text-slate-600">Generating Grad-CAM visualization...</div>
      )}
      {gradCamStatus === 'error' && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {gradCamError}
        </div>
      )}

      <GradCAMViewer panels={gradCamResults} combined={gradCamCombined} />
      {gradCamResults.length > 0 && (
        <p className="mt-6 text-sm leading-6 text-slate-500">
          These AI-generated visualizations are intended for research and educational purposes only and should not be considered a medical diagnosis.
        </p>
      )}
    </div>
  );
}
