"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/Language";
import { DESTINATIONS } from "@/data/destinations";

/* Filter tabs for map content */
const TABS = [
  { key: "poi", labelId: "Titik Menarik", labelEn: "Point of Interest" },
  { key: "wisata", labelId: "Wisata", labelEn: "Destinations" },
  { key: "budaya", labelId: "Wisata Budaya", labelEn: "Cultural" },
  { key: "kuliner", labelId: "Kuliner", labelEn: "Culinary" },
  { key: "suvenir", labelId: "Suvenir", labelEn: "Souvenir" },
];

/* Destination category navigation */
const NAV_TABS = [
  { key: "peta", labelId: "Peta Interaktif", labelEn: "Interactive Map", href: "/destinasi/peta" },
  { key: "wisata", labelId: "Wisata", labelEn: "Destinations", href: "/destinasi?cat=wisata" },
  { key: "budaya", labelId: "Wisata Budaya", labelEn: "Cultural", href: "/destinasi?cat=budaya" },
  { key: "kuliner", labelId: "Kuliner", labelEn: "Culinary", href: "/destinasi?cat=kuliner" },
  { key: "suvenir", labelId: "Suvenir", labelEn: "Souvenir", href: "/destinasi?cat=suvenir" },
];

/* Marker color by category */
const CATEGORY_COLORS = {
  wisata: "bg-emerald-500",
  budaya: "bg-amber-500",
  kuliner: "bg-rose-500",
  suvenir: "bg-indigo-500",
};

/* Reusable pill tab UI */
function PillTab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "min-w-[150px] px-5 py-2 rounded-full font-semibold shadow transition-all duration-500 ease-out",
        active
          ? "bg-gradient-to-b from-slate-800 to-slate-950 text-white opacity-100"
          : "bg-gradient-to-b from-white to-slate-200 text-slate-800 opacity-70 hover:opacity-100 hover:brightness-95"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function MapClient() {
  const { lang, t } = useLang();
  /* State: active filter tab */
  const [tab, setTab] = useState("poi");
  /* State: selected place detail */
  const [selected, setSelected] = useState(DESTINATIONS[0]);

  /* Derived list based on active filter */
  const list = useMemo(() => (tab === "poi" ? DESTINATIONS : DESTINATIONS.filter(d => d.category === tab)), [tab]);

  useEffect(() => {
    /* FIX: keep selected item consistent with current filter */
    if (!selected || !list.some((item) => item.id === selected.id)) {
      setSelected(list[0] || null);
    }
  }, [list, selected]);


  /* Computed URLs for map actions */
  const directionUrl = selected ? `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}` : "#";
  const mapSrc = selected ? `https://www.google.com/maps?q=${selected.lat},${selected.lng}&z=13&output=embed` : "";
  const panoUrl = selected ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${selected.lat},${selected.lng}` : "#";

  /* Localized fields */
  const itemName = selected ? (lang === "id" ? selected.name : (selected.nameEn || selected.name)) : "";
  const itemShort = selected ? (lang === "id" ? selected.short : (selected.shortEn || selected.short)) : "";
  const itemHours = selected ? (lang === "id" ? selected.hours : (selected.hoursEn || selected.hours)) : "";
  const itemPrice = selected ? (lang === "id" ? selected.price : (selected.priceEn || selected.price)) : "";

  return (
    <section className="min-h-screen w-screen px-6 sm:px-10 pt-12 pb-0">
      <div className="text-white/90 text-sm tracking-[0.3em] uppercase drop-shadow">
        |{lang === "id" ? "Destinasi" : "Destinations"}|{lang === "id" ? "Peta Interaktif" : "Interactive Map"}|
      </div>

      <h1 className="mt-4 text-center text-3xl font-extrabold text-white drop-shadow">
        {lang === "id" ? "Peta Interaktif" : "Interactive Map"}
      </h1>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {NAV_TABS.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className={[
              "px-5 py-2 rounded-full font-semibold shadow transition",
              t.key === "peta"
                ? "bg-gradient-to-b from-white to-slate-200 text-slate-900"
                : "bg-gradient-to-b from-slate-800 to-slate-950 text-white hover:brightness-110"
            ].join(" ")}
          >
            {lang === "id" ? t.labelId : t.labelEn}
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="w-full max-w-[860px] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(2,6,23,0.22)] border border-slate-200 bg-white">
          <iframe title="map" src={mapSrc} className="w-full h-[360px]" loading="lazy" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-white/90 drop-shadow">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> {lang === "id" ? "Wisata" : "Destinations"}</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> {lang === "id" ? "Budaya" : "Cultural"}</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> {lang === "id" ? "Kuliner" : "Culinary"}</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> {lang === "id" ? "Suvenir" : "Souvenir"}</span>
      </div>

      {/* marker list to simulate clicks */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/80 border border-slate-200 shadow-sm p-5">
          <div className="flex flex-wrap gap-3 justify-start mb-4">
            {TABS.map((t) => (
              <PillTab key={t.key} active={tab===t.key} onClick={() => setTab(t.key)}>
                {lang==="id" ? t.labelId : t.labelEn}
              </PillTab>
            ))}
          </div>
          <div className="font-extrabold text-slate-900">{lang==="id" ? "Daftar Lokasi" : "Places"}</div>
          <div className="mt-3 space-y-2 max-h-[260px] overflow-auto pr-1">
            {list.map(d => (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className={[
                  "w-full text-left rounded-xl border px-4 py-3 transition",
                  selected?.id === d.id ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 hover:bg-white/70"
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${CATEGORY_COLORS[d.category] || "bg-slate-400"}`} />
                  <span className="font-bold">{lang === "id" ? d.name : (d.nameEn || d.name)}</span>
                </div>
                <div className={"text-xs " + (selected?.id === d.id ? "text-white/80" : "text-slate-600")}>{d.address}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 border border-slate-200 shadow-sm p-5">
          <div className="font-extrabold text-slate-900">{lang==="id" ? "Info Lokasi" : "Place Info"}</div>
          {selected ? (
            <>
              <div className="mt-3">
                <div className="text-lg font-extrabold text-slate-900">{itemName}</div>
                <div className="text-sm text-slate-600 mt-1">{itemShort}</div>
              </div>
              <div className="mt-4 text-sm text-slate-700 space-y-1">
                <div><span className="font-semibold">{t.common.address}:</span> {selected.address}</div>
                <div><span className="font-semibold">{t.common.open}:</span> {itemHours}</div>
                <div><span className="font-semibold">{t.common.price}:</span> {itemPrice}</div>
              </div>
              <div className="mt-5 flex gap-2">
                <a href={directionUrl} target="_blank" rel="noreferrer" className="flex-1 text-center rounded-xl bg-slate-900 text-white px-4 py-3 font-extrabold">
                  {t.common.direction}
                </a>
                <a href={panoUrl} target="_blank" rel="noreferrer" className="flex-1 text-center rounded-xl bg-white border border-slate-200 px-4 py-3 font-extrabold text-slate-900">
                  {lang === "id" ? "Tur Virtual" : "Virtual Tour"}
                </a>
              </div>
            </>
          ) : (
            <p className="mt-3 text-slate-600">{lang==="id" ? "Pilih lokasi dari daftar." : "Pick a place from the list."}</p>
          )}
        </div>
      </div>
    </section>
  );
}
