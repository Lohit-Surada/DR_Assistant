import { ArrowRight, LockKeyhole, UploadCloud } from 'lucide-react';

export default function FeatureRow({
  title,
  description,
  cta,
  imageSrc,
  imageAlt,
  layout = 'left',
  disabled = false,
  onClick,
}) {
  const isTextLeft = layout === 'left';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full overflow-hidden rounded-[28px] border bg-white text-left shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(14,116,144,0.12)] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
        disabled ? 'border-slate-200 opacity-80' : 'border-slate-200'
      }`}
      aria-label={title}
    >
      <div
        className={`grid items-center gap-0 ${
          isTextLeft ? 'md:grid-cols-[1.15fr_0.85fr]' : 'md:grid-cols-[0.85fr_1.15fr]'
        }`}
      >
        {isTextLeft ? (
          <div className="p-8 sm:p-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
              {disabled ? <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" /> : <UploadCloud className="h-3.5 w-3.5" aria-hidden="true" />}
              {disabled ? 'Locked' : 'Available'}
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">{description}</p>
            <span className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition group-hover:bg-sky-700">
              {disabled ? 'Upload Image to Continue' : cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        ) : null}

        <div className="relative overflow-hidden border-t border-slate-200 md:border-l md:border-t-0">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-64 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-72 md:h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" aria-hidden="true" />
        </div>

        {!isTextLeft ? (
          <div className="p-8 sm:p-10 md:col-start-2">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
              {disabled ? <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" /> : <UploadCloud className="h-3.5 w-3.5" aria-hidden="true" />}
              {disabled ? 'Locked' : 'Available'}
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">{description}</p>
            <span className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition group-hover:bg-sky-700">
              {disabled ? 'Upload Image to Continue' : cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        ) : null}
      </div>
    </button>
  );
}
