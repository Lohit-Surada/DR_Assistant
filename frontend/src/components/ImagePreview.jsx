export default function ImagePreview({ src, alt, name }) {
  if (!src) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <img src={src} alt={alt} className="h-64 w-full object-cover" />
      {name && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {name}
        </div>
      )}
    </div>
  );
}
