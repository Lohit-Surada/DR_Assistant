import { useMemo, useState } from 'react';
import { ArrowRight, FileText, History, Sparkles, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeatureRow from '../components/FeatureRow';
import ReportDownload from '../components/ReportDownload';
import UploadRequiredModal from '../components/UploadRequiredModal';
import UploadSection from '../components/UploadSection';
import { useAnalysis } from '../context/AnalysisContext';
import { useAuth } from '../context/AuthContext';
import { createReport } from '../services/reportApi';
import { requireImageUpload } from '../utils/requireImageUpload';

const featureCards = [
  {
    title: 'DR Classification',
    description:
      'Analyze the uploaded retinal fundus image and classify the severity of diabetic retinopathy.',
    cta: 'View Classification',
    imageSrc:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Retinal fundus image for diabetic retinopathy classification',
    path: '/analysis/classification',
  },
  {
    title: 'Lesion Detection',
    description:
      'Identify and visualize retinal lesions such as microaneurysms, haemorrhages, hard exudates and soft exudates.',
    cta: 'View Lesion Detection',
    imageSrc:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Retinal lesion detection visualization',
    path: '/analysis/lesions',
  },
  {
    title: 'Grad-CAM Visualization',
    description:
      'Visualize the regions of the retinal image that contributed to the model\'s prediction using gradient-based explainability.',
    cta: 'View Grad-CAM',
    imageSrc:
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Grad-CAM retinal attention map',
    path: '/analysis/gradcam',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    uploadedImage,
    imagePreview,
    imageName,
    setImageFile,
    clearImage,
    classificationResult,
    lesionResult,
    gradCamResults,
    gradCamCombined,
    gradCamStatus,
    analysisHistory,
    historyError,
  } = useAnalysis();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFeature, setModalFeature] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const greetingName = useMemo(() => currentUser?.fullName?.split(' ')[0] || 'User', [currentUser]);

  const triggerFeatureAccess = (path, title) => {
    requireImageUpload({
      uploadedImage,
      featureName: title,
      onOpenModal: (featureName) => {
        setModalFeature(featureName);
        setModalOpen(true);
      },
      navigate,
      path,
    });
  };

  const handleUploadImage = async (file) => {
    setUploadError('');
    setIsAnalyzing(true);
    try {
      await setImageFile(file);
    } catch (error) {
      setUploadError(error.message || 'Something went wrong while processing the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const focusUploadSection = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reportReady = Boolean(uploadedImage && classificationResult && lesionResult && gradCamStatus === 'ready' && gradCamCombined && gradCamResults.length === 4);

  const handleViewReport = async () => {
    if (!reportReady) {
      setUploadError('Please complete the full retinal analysis before viewing the medical report.');
      return;
    }
    try {
      setIsDownloading(true);
      const report = await createReport({
        image: uploadedImage,
        classification: classificationResult,
        lesions: lesionResult,
        gradcam: { combined: gradCamCombined, panels: gradCamResults },
      });
      navigate(`/report/${report.analysis_id}`);
    } catch (error) {
      setUploadError(error.message || 'Unable to prepare the medical report.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="medical-card overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="section-label">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Welcome, {greetingName}</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Analyze retinal fundus images using AI-powered diabetic retinopathy detection.
              </p>
            </div>

            <button
              type="button"
              onClick={() => focusUploadSection()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <UploadCloud className="h-4 w-4" aria-hidden="true" />
              Upload Fundus Image
            </button>
          </div>
        </section>

        <div className="mt-8">
          <UploadSection
            imagePreview={imagePreview}
            imageName={imageName}
            error={uploadError}
            onImageSelect={handleUploadImage}
            onRemove={clearImage}
            onValidationError={(message) => setUploadError(message)}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {(analysisHistory.length > 0 || historyError) && (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <History className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="section-label">Live history</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">Recent uploads</h2>
              </div>
            </div>

            {historyError ? (
              <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {historyError}
              </p>
            ) : (
              <div className="mt-5 divide-y divide-slate-100">
                {analysisHistory.slice(0, 5).map((analysis) => (
                  <div key={analysis.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium text-slate-700">{analysis.image?.name || 'Retinal image'}</span>
                    <time className="text-slate-500" dateTime={analysis.createdAt}>
                      {new Date(analysis.createdAt).toLocaleString()}
                    </time>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="mt-10 space-y-6">
          {featureCards.map((feature, index) => (
            <FeatureRow
              key={feature.title}
              title={feature.title}
              description={feature.description}
              cta={feature.cta}
              imageSrc={feature.imageSrc}
              imageAlt={feature.imageAlt}
              layout={index % 2 === 0 ? 'left' : 'right'}
              disabled={!uploadedImage}
              onClick={() => triggerFeatureAccess(feature.path, feature.title)}
            />
          ))}
        </section>

        <section className="mt-10">
          <ReportDownload
            onView={handleViewReport}
            isLoading={isDownloading}
            isReady={reportReady}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Research workflow</p>
                <p className="text-sm text-slate-500">AI-generated outputs for education and study</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
              <FileText className="h-4 w-4 text-sky-600" aria-hidden="true" />
              Retinal image analysis platform
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
        </section>

        <UploadRequiredModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModalFeature('');
          }}
          onUploadImage={() => {
            setModalOpen(false);
            setModalFeature('');
            focusUploadSection();
          }}
        />
      </div>
    </div>
  );
}
