export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-slate-600" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
