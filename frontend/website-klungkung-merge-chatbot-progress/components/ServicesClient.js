"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/components/Language";
import { SectionTitle, Pill } from "@/components/UI";
import { SERVICE_CATEGORIES, SERVICES, CAMERA_RENT_CATALOG } from "@/data/services";

/* Utility: normalize phone for WhatsApp */
function normalizePhone(phone) {
  return phone.replace(/[^\d]/g, "");
}

export default function ServicesClient() {
  const { lang, t } = useLang();
  /* State: active category filter */
  const [cat, setCat] = useState("");
  /* State: search query */
  const [query, setQuery] = useState("");
  /* State: toggle camera catalog */
  const [openCamera, setOpenCamera] = useState(false);

  /* Localized category labels */
  const cats = SERVICE_CATEGORIES.map(c => ({
    key: c.key,
    label: lang === "id" ? c.nameId : c.nameEn
  }));
  const catLabelMap = Object.fromEntries(cats.map(c => [c.key, c.label]));
  const catItems = [
    { key: "", label: lang === "id" ? "Semua" : "All" },
    ...cats
  ];

  /* Derived list by category + search */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter(s => {
      const okC = !cat || s.category === cat;
      const name = lang === "id" ? s.name : (s.nameEn || s.name);
      const short = lang === "id" ? s.short : (s.shortEn || s.short);
      const okQ = !q || name.toLowerCase().includes(q) || short.toLowerCase().includes(q);
      return okC && okQ;
    });
  }, [cat, query, lang]);


  return (
    <section className="min-h-screen w-screen px-6 sm:px-10 pt-12 pb-0">
      <SectionTitle
        title={lang === "id" ? "Layanan" : "Services"}
        subtitle={lang === "id" ? "Aneka sewa, guide, spa, dokumentasi (dummy)." : "Rentals, guides, spa, documentation (dummy)."}
      />

      <div className="rounded-2xl bg-white/70 border border-white/60 shadow-[0_18px_45px_rgba(2,6,23,0.18)] p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          /* Event: search query */
          className="w-full sm:w-80 rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
          placeholder={t.common.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 items-center">
          {catItems.map((c) => (
            <button
              key={c.key || "all"}
              /* Event: set category */
              onClick={() => setCat(c.key)}
              className={[
                "px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold transition-all duration-500 ease-out",
                cat === c.key
                  ? "bg-slate-900 text-white opacity-100"
                  : "bg-white text-slate-700 opacity-70 hover:opacity-100 hover:bg-white/80"
              ].join(" ")}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="rounded-3xl bg-white/80 border border-white/60 shadow-[0_18px_45px_rgba(2,6,23,0.18)] overflow-hidden">
            <div className="relative h-40">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-900">
                {catLabelMap[s.category] || s.category}
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-900">{lang === "id" ? s.name : (s.nameEn || s.name)}</h3>
                  <p className="text-sm text-slate-600 mt-1">{lang === "id" ? s.short : (s.shortEn || s.short)}</p>
                </div>
                <Pill>{catLabelMap[s.category] || s.category}</Pill>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                <div><span className="font-semibold">{lang === "id" ? "Harga" : "Price"}:</span> {lang === "id" ? s.price : (s.priceEn || s.price)}</div>
                <div className="mt-1"><span className="font-semibold">{lang === "id" ? "Kontak" : "Contact"}:</span> {s.contact}</div>
              </div>
              <div className="mt-4 flex gap-2">
                <a className="flex-1 text-center rounded-xl bg-slate-900 text-white px-4 py-3 font-bold" href={`tel:${s.contact.replace(/\s/g,"")}`}>
                  {lang === "id" ? "Telepon" : "Call"}
                </a>
              {s.id === "camera-rent" ? (
                <button
                  /* Event: toggle camera catalog */
                  onClick={() => setOpenCamera(v => !v)}
                  className="flex-1 rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-900"
                >
                  {lang === "id" ? "Lihat Katalog" : "View Catalog"}
                </button>
              ) : (
                <a
                  /* UX: WhatsApp CTA */
                  className="flex-1 text-center rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-900"
                  href={`https://wa.me/${normalizePhone(s.contact)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              )}
            </div>

            {s.items ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <div className="font-bold text-slate-900">{lang === "id" ? "Produk" : "Items"}</div>
                <ul className="mt-2 space-y-1">
                  {(lang === "id" ? s.items : (s.itemsEn || s.items)).map((item, i) => (
                    <li key={i} className="flex items-center justify-between gap-3">
                      <span>{item}</span>
                      <Pill>{lang === "id" ? "Siap" : "Ready"}</Pill>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {s.package ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <div className="font-bold text-slate-900">{lang === "id" ? "Paket" : "Package"}</div>
                <p className="mt-1">{lang === "id" ? s.package : (s.packageEn || s.package)}</p>
              </div>
            ) : null}

            {s.languages ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <div className="font-bold text-slate-900">{lang === "id" ? "Bahasa" : "Languages"}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.languages.map((langKey) => (
                    <Pill key={langKey}>{langKey}</Pill>
                  ))}
                </div>
              </div>
            ) : null}

            {s.portfolio ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <div className="font-bold text-slate-900">{lang === "id" ? "Portofolio" : "Portfolio"}</div>
                <ul className="mt-2 space-y-1">
                  {(lang === "id" ? s.portfolio : (s.portfolioEn || s.portfolio)).map((item, i) => (
                    <li key={i} className="flex items-center justify-between gap-3">
                      <span>{item}</span>
                      <Pill>{lang === "id" ? "Contoh" : "Sample"}</Pill>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {s.id === "camera-rent" ? (
              <div
                className={[
                  "mt-4 overflow-hidden transition-all duration-300 ease-out",
                  openCamera ? "max-h-[360px] opacity-100" : "max-h-0 opacity-0"
                ].join(" ")}
              >
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="font-bold text-slate-900">{lang === "id" ? "Katalog Camera Rent" : "Camera Rent Catalog"}</div>
                  <ul className="mt-2 text-sm text-slate-700 space-y-1">
                    {CAMERA_RENT_CATALOG.map((x, i) => (
                      <li key={i} className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{x.name}</span>
                        <Pill>{x.price}</Pill>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
