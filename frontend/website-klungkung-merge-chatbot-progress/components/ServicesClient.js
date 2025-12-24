"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/components/Language";
import { SectionTitle, Pill } from "@/components/UI";
import { SERVICE_CATEGORIES, SERVICES } from "@/data/services";

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
  const fallbackImage = "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=70";

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
      const desc = lang === "id" ? s.desc : (s.descEn || s.desc);
      const okQ = !q || name.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
      return okC && okQ;
    });
  }, [cat, query, lang]);

  const getName = (item) => (lang === "id" ? item.name : (item.nameEn || item.name));
  const getDesc = (item) => (lang === "id" ? item.desc : (item.descEn || item.desc));
  const getType = (item) => (lang === "id" ? item.type : (item.typeEn || item.type));
  const getAvailability = (item) => (lang === "id" ? item.availability : (item.availabilityEn || item.availability));
  const getNote = (item) => (lang === "id" ? item.note : (item.noteEn || item.note));
  const getSuitableFor = (item) => (lang === "id" ? item.suitableFor : (item.suitableForEn || item.suitableFor));
  const getLanguages = (item) => (lang === "id" ? item.languages : (item.languagesEn || item.languages));
  const getLocations = (item) => (lang === "id" ? item.locations : (item.locationsEn || item.locations));
  const getOutput = (item) => (lang === "id" ? item.output : (item.outputEn || item.output));
  const getContact = (item) => item.contact;


  return (
    <section className="min-h-screen w-screen px-6 sm:px-10 pt-12 pb-0">
      <SectionTitle
        title={lang === "id" ? "Layanan" : "Services"}
        subtitle={lang === "id" ? "Layanan wisata dan UMKM lokal di Klungkung." : "Tourism services and local SMEs in Klungkung."}
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
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.image || fallbackImage})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-900">
                {catLabelMap[s.category] || s.category}
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-900">{getName(s)}</h3>
                  <p className="text-sm text-slate-600 mt-1">{getDesc(s)}</p>
                </div>
                <Pill>{catLabelMap[s.category] || s.category}</Pill>
              </div>
              {getType(s) ? (
                <div className="mt-3 text-sm text-slate-700">
                  <span className="font-semibold">{lang === "id" ? "Jenis" : "Type"}:</span> {getType(s)}
                </div>
              ) : null}

              {getAvailability(s) ? (
                <div className="mt-3 text-sm text-slate-700">
                  <span className="font-semibold">{lang === "id" ? "Ketersediaan" : "Availability"}:</span> {getAvailability(s)}
                </div>
              ) : null}

              {getContact(s) ? (
                <div className="mt-3 text-sm text-slate-700">
                  <span className="font-semibold">{lang === "id" ? "Kontak" : "Contact"}:</span> {getContact(s)}
                </div>
              ) : null}

              {getNote(s) ? (
                <div className="mt-3 text-sm text-slate-700">
                  <span className="font-semibold">{lang === "id" ? "Catatan" : "Notes"}:</span> {getNote(s)}
                </div>
              ) : null}

              {getSuitableFor(s) ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  <div className="font-bold text-slate-900">{lang === "id" ? "Cocok Untuk" : "Suitable For"}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getSuitableFor(s).map((item) => (
                      <Pill key={item}>{item}</Pill>
                    ))}
                  </div>
                </div>
              ) : null}

              {getLanguages(s) ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  <div className="font-bold text-slate-900">{lang === "id" ? "Bahasa" : "Languages"}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getLanguages(s).map((langKey) => (
                      <Pill key={langKey}>{langKey}</Pill>
                    ))}
                  </div>
                </div>
              ) : null}

              {getLocations(s) ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  <div className="font-bold text-slate-900">{lang === "id" ? "Lokasi Umum" : "Common Locations"}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getLocations(s).map((item) => (
                      <Pill key={item}>{item}</Pill>
                    ))}
                  </div>
                </div>
              ) : null}

              {getOutput(s) ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  <div className="font-bold text-slate-900">{lang === "id" ? "Output" : "Deliverables"}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getOutput(s).map((item) => (
                      <Pill key={item}>{item}</Pill>
                    ))}
                  </div>
                </div>
              ) : null}

              {getContact(s) ? (
                <div className="mt-4 flex gap-2">
                  <a
                    className="flex-1 text-center rounded-xl bg-slate-900 text-white px-4 py-3 font-bold"
                    href={`tel:${getContact(s).replace(/\s/g, "")}`}
                  >
                    {lang === "id" ? "Telepon" : "Call"}
                  </a>
                  <a
                    className="flex-1 text-center rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-900"
                    href={`https://wa.me/${normalizePhone(getContact(s))}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
