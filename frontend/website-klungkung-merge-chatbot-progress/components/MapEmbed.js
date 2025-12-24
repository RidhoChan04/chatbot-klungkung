export default function MapEmbed({ lat, lng, zoom = 14 }) {
  /* Computed map embed URL */
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white/80 shadow-sm">
      {/* UI: embedded map */}
      <iframe title="map" src={src} className="w-full h-64" loading="lazy" />
    </div>
  );
}
