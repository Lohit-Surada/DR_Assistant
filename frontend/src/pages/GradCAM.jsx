import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import GradCAMViewer from '../components/GradCAMViewer';
import { useAnalysis } from '../context/AnalysisContext';

export default function GradCAM() {
  const { gradCamResults } = useAnalysis();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="section-label">Analysis</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Grad-CAM Visualization</h1>
        </div>
        <Link
          to="/home"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Dashboard
        </Link>
      </div>

      <GradCAMViewer panels={gradCamResults} />
    </div>
  );
}
