import { useRef } from 'react';
import { FileImage, ImagePlus, UploadCloud, X } from 'lucide-react';

export default function UploadSection({
  imagePreview,
  imageName,
  error,
  onImageSelect,
  onRemove,
  onValidationError,
  isAnalyzing,
}) {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const isAllowedType =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp' ||
      file.type === 'image/jpg' ||
      /\.(jpg|jpeg|png)$/i.test(file.name);

    if (!isAllowedType) {
      onValidationError('Please upload a JPG, JPEG, PNG, or WEBP retinal image.');
      event.target.value = '';
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      onValidationError('Image size must be less than 12 MB.');
      event.target.value = '';
      return;
    }

    onImageSelect(file);
    event.target.value = '';
  };

  return (
    <section id="upload-section" className="medical-card p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="section-label">Image Input</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Upload Fundus Image</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Supported formats: JPG, JPEG, PNG, WEBP. Maximum file size: 12 MB.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
            {isAnalyzing ? 'Analyzing...' : 'Select Image'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Upload retinal fundus image"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {imagePreview ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[280px_1fr] lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img
              src={imagePreview}
              alt="Uploaded retinal fundus preview"
              className="h-52 w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-700">
                <FileImage className="h-4 w-4 text-sky-600" aria-hidden="true" />
                <span className="font-medium">{imageName}</span>
              </div>
              <p className="text-sm text-slate-500">
                {isAnalyzing ? 'Running the trained CNN model...' : 'Image classified successfully'}
              </p>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-sky-50/60 px-6 py-10 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm ring-1 ring-sky-100">
            <ImagePlus className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="text-base font-medium text-slate-800">No image uploaded yet</p>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Upload a retinal fundus image to unlock AI classification, lesion detection, and explainability tools.
          </p>
        </div>
      )}
    </section>
  );
}
