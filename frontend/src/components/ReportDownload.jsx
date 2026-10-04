import { Download } from 'lucide-react';

export default function ReportDownload({ onDownload, isLoading = false, isReady = false }) {
  return (
    <div className="medical-card p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="section-label">Medical Report</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Download Medical Report</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Generate and download a report containing the analysis results and visualizations.
          </p>
        </div>

        <button
          type="button"
          onClick={onDownload}
          disabled={!isReady || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {isLoading ? 'Generating Report...' : 'Download Report'}
        </button>
      </div>

      <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
        AI-generated results are intended for research and educational purposes only and should not be used as a substitute for professional medical diagnosis.
      </p>
    </div>
  );
}
