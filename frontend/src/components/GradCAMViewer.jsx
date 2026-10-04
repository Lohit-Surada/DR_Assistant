export default function GradCAMViewer({ panels }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {panels.map((panel) => (
        <div key={panel.key} className="medical-card overflow-hidden p-3 sm:p-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img src={panel.image} alt={panel.title} className="h-56 w-full object-cover" />
          </div>
          <div className="px-1 pb-2 pt-4">
            <h3 className="text-lg font-semibold text-slate-900">{panel.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{panel.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
