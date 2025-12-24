"use client";

import { useState } from "react";
import { useLang } from "@/components/Language";
import { DEST_CATEGORIES } from "@/data/destinations";

/* Reusable info card layout */
function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-white/85 border border-slate-200 shadow-sm p-4">
      <div className="flex justify-center">
        <div className="px-5 py-1 rounded-full bg-slate-900 text-white font-semibold">{title}</div>
      </div>
      <div className="mt-3 text-sm text-slate-700">{children}</div>
    </div>
  );
}

export default function DestinationDetailClient({ item }) {
  /* State/props: language + destination item */
  const { lang } = useLang();
  /* Computed URLs for actions */
  const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;
  const mapSrc = `https://www.google.com/maps?q=${item.lat},${item.lng}&z=14&output=embed`;
  const contactPhone = "6281200000000";
  const waUrl = `https://wa.me/${contactPhone}`;
  /* State: expand/collapse long description */
  const [expanded, setExpanded] = useState(false);
  /* Localized fields */
  const descriptionText = lang === "id" ? item.description : (item.descriptionEn || item.description);
  /* Logic: short preview for description */
  const shortDesc = descriptionText.length > 180 ? `${descriptionText.slice(0, 180)}...` : descriptionText;
  /* Localized category label */
  const categoryLabel = (DEST_CATEGORIES.find(c => c.key === item.category) || {})[lang === "id" ? "nameId" : "nameEn"];
  /* Localized detail values */
  const itemName = lang === "id" ? item.name : (item.nameEn || item.name);
  const itemHours = lang === "id" ? item.hours : (item.hoursEn || item.hours);
  const itemPrice = lang === "id" ? item.price : (item.priceEn || item.price);
  /* Fallback hero image by category */
  const fallbackByCategory = {
    wisata: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=70",
    budaya: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1800&q=70",
    kuliner: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1800&q=70",
    suvenir: "https://images.unsplash.com/photo-1520975958225-17c75f6f1f63?auto=format&fit=crop&w=1800&q=70",
  };
  /* Media selection: prefer item media, fallback by category */
  const heroImage = item.media && item.media.startsWith("http")
    ? item.media
    : (fallbackByCategory[item.category] || fallbackByCategory.wisata);

  return (
    <section className="relative min-h-screen w-screen px-6 sm:px-10 pt-12 pb-0">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center blur-sm opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/85 via-white/75 to-white/80" />

      <div className="text-slate-800/80 text-sm tracking-[0.3em] uppercase">
        |{lang === "id" ? "Destinasi" : "Destinations"}|{categoryLabel || item.category}|
      </div>

      <h1 className="mt-4 text-center text-4xl font-extrabold text-slate-900">{itemName}</h1>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* UI: media gallery */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden border border-white/60 bg-white/80 shadow-[0_22px_55px_rgba(2,6,23,0.20)]">
            <div className="relative h-72 sm:h-80 bg-slate-200">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-slate-900">
                {lang === "id" ? "Highlight" : "Highlight"}
              </div>
            </div>
            <div className="p-4 grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-cover bg-center border border-white/50"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/85 border border-slate-200 shadow-sm p-5">
            <p className="text-slate-700 leading-relaxed">{expanded ? descriptionText : shortDesc}</p>
            <button
              /* Event: toggle description */
              className="mt-4 text-slate-900 font-semibold underline"
              onClick={() => setExpanded(v => !v)}
            >
              {expanded ? (lang === "id" ? "Tutup" : "Show Less") : (lang === "id" ? "Baca Selengkapnya" : "Read More")}
            </button>
          </div>
        </div>

        {/* UI: info blocks */}
        <div className="space-y-4">
          <InfoCard title={lang === "id" ? "Alamat" : "Address"}>
            {item.address}
          </InfoCard>

          <InfoCard title={lang === "id" ? "Jam Buka" : "Open Hours"}>
            <div className="text-center font-semibold">{itemHours || (lang === "id" ? "Setiap hari 07.00 - 18.00" : "Daily 07:00 - 18:00")}</div>
          </InfoCard>

          <div className="rounded-2xl bg-white/85 border border-slate-200 shadow-sm p-4">
            <div className="flex justify-center">
              <div className="px-5 py-1 rounded-full bg-slate-900 text-white font-semibold">{lang === "id" ? "Harga Tiket" : "Ticket"}</div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-extrabold">IDR</span>
              <span className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-extrabold text-slate-900">
                {itemPrice || (lang === "id" ? "20.000" : "20,000")}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <a href={directionUrl} target="_blank" rel="noreferrer" className="flex-1 text-center rounded-xl bg-slate-900 text-white px-4 py-3 font-extrabold">
                {lang === "id" ? "Rute" : "Direction"}
              </a>
              <a href="tel:+6281200000000" className="flex-1 text-center rounded-xl bg-white border border-slate-200 px-4 py-3 font-extrabold text-slate-900">
                {lang === "id" ? "Hubungi" : "Call"}
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white/85 border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex justify-center py-2">
              <div className="px-5 py-1 rounded-full bg-slate-900 text-white font-semibold">{lang === "id" ? "Peta" : "Map"}</div>
            </div>
            <iframe title="mini-map" src={mapSrc} className="w-full h-56" loading="lazy" />
          </div>

          <InfoCard title={lang === "id" ? "Hubungi Kami" : "Contact"}>
            <div className="flex items-center justify-center gap-4">
              <a href={waUrl} target="_blank" rel="noreferrer" className="h-11 w-11 rounded-full bg-emerald-600/15 border border-emerald-600/30 flex items-center justify-center font-bold text-emerald-700">
                WA
              </a>
              <a href="https://facebook.com/klungkungtourism" target="_blank" rel="noreferrer" className="h-11 w-11 rounded-full bg-blue-600/15 border border-blue-600/30 flex items-center justify-center font-bold text-blue-700">
                FB
              </a>
              <a href="https://instagram.com/klungkungtourism" target="_blank" rel="noreferrer" className="h-11 w-11 rounded-full bg-pink-600/15 border border-pink-600/30 flex items-center justify-center font-bold text-pink-700">
                IG
              </a>
            </div>
          </InfoCard>
        </div>
      </div>
    </section>
  );
}
