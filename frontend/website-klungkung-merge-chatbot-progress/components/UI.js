import Link from "next/link";

export function Card({ title, description, icon, href, children }) {
  /* UI: shared card layout */
  const inner = (
    <div className="rounded-2xl bg-white/80 border border-slate-200 shadow-sm p-5 hover:shadow transition">
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            {icon}
          </div>
        ) : null}
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900">{title}</h3>
          {description ? <p className="text-sm text-slate-600 mt-1">{description}</p> : null}
        </div>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );

  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

export function Pill({ children }) {
  /* UI: pill chip */
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

export function SectionTitle({ title, subtitle }) {
  /* UI: section header */
  return (
    <div className="mb-5">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm">{title}</h2>
      {subtitle ? <p className="text-white/90 mt-1">{subtitle}</p> : null}
    </div>
  );
}
