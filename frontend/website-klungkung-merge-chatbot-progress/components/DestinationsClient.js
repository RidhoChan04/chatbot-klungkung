"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/components/Language";
import { DEST_CATEGORIES, DESTINATIONS } from "@/data/destinations";
import { Pill } from "@/components/UI";

/* Navigation tabs for destination sections */
const tabs = [
  { key: "peta", href: "/destinasi/peta" },
  { key: "wisata", href: "/destinasi?cat=wisata" },
  { key: "budaya", href: "/destinasi?cat=budaya" },
  { key: "kuliner", href: "/destinasi?cat=kuliner" },
  { key: "suvenir", href: "/destinasi?cat=suvenir" },
];

const categoryImageByKey = Object.fromEntries(
  DEST_CATEGORIES.filter((category) => category.image).map((category) => [category.key, category.image])
);
const fallbackImage = categoryImageByKey.wisata || Object.values(categoryImageByKey)[0] || "";

/* Normalize label by language */
function normalizeLabel(lang, key) {
  const found = DEST_CATEGORIES.find(c => c.key === key);
  return found ? (lang === "id" ? found.nameId : found.nameEn) : key;
}

export default function DestinationsClient() {
  const { lang, t } = useLang();
  /* Router state */
  const router = useRouter();
  const searchParams = useSearchParams();
  /* State: current category */
  const [cat, setCat] = useState(searchParams.get("cat") || "");

  useEffect(() => {
    /* Sync category with URL */
    setCat(searchParams.get("cat") || "");
  }, [searchParams]);

  /* Derived list by category */
  const filtered = useMemo(
    () => DESTINATIONS.filter(d => d.category === cat),
    [cat]
  );

  function handleTabClick(key, href) {
    /* Event: navigate to map or category */
    if (key === "peta") {
      router.push(href);
      return;
    }
    setCat(key);
    router.push(href);
  }

  /* Card menu entries for initial screen */
  const categoryCards = DEST_CATEGORIES.map((category) => ({
    key: category.key,
    href: category.href,
    image: category.image,
  }));

  /* Localization helpers */
  function getItemName(item) {
    return lang === "id" ? item.name : (item.nameEn || item.name);
  }

  function getItemShort(item) {
    return lang === "id" ? item.short : (item.shortEn || item.short);
  }

  function getItemPrice(item) {
    return lang === "id" ? item.price : (item.priceEn || item.price);
  }

  function getItemHours(item) {
    return lang === "id" ? item.hours : (item.hoursEn || item.hours);
  }

  return (
    <section className="relative min-h-screen w-screen px-6 sm:px-10 pt-12 pb-0">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center blur-sm opacity-30"
        style={{ backgroundImage: `url(${categoryImageByKey[cat] || fallbackImage})` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/85 via-white/70 to-white/75" />

      <div className="text-slate-800/80 text-sm tracking-[0.3em] uppercase">
        |{lang === "id" ? "Destinasi" : "Destinations"}|{cat ? normalizeLabel(lang, cat) : (lang === "id" ? "Menu" : "Menu")}|
      </div>

      {cat ? (
        <>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                /* Event: switch category */
                onClick={() => handleTabClick(tab.key, tab.href)}
                className={[
                  "px-5 py-2 rounded-full font-semibold border transition-all duration-500 ease-out",
                  tab.key === cat
                    ? "bg-slate-900 text-white border-slate-900 opacity-100"
                    : "bg-white border-slate-200 text-slate-700 opacity-70 hover:opacity-100 hover:bg-white/80"
                ].join(" ")}
              >
                {normalizeLabel(lang, tab.key)}
              </button>
            ))}
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => {
              const itemImage = item.media || categoryImageByKey[item.category] || fallbackImage;
              const itemFallback = categoryImageByKey[item.category] || fallbackImage;
              return (
                <div key={item.id} className="rounded-3xl bg-white/80 border border-white/60 shadow-[0_18px_45px_rgba(2,6,23,0.18)] overflow-hidden">
                  <div className="relative h-44">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${itemImage}), url(${itemFallback})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-900">
                      {normalizeLabel(lang, item.category)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-extrabold text-slate-900">{getItemName(item)}</h3>
                    <p className="text-sm text-slate-600 mt-1">{getItemShort(item)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Pill>{getItemPrice(item)}</Pill>
                      <Pill>{getItemHours(item)}</Pill>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link
                        /* UX: details CTA */
                        className="flex-1 text-center rounded-xl bg-slate-900 text-white px-4 py-3 font-bold"
                        href={`/destinasi/${item.id}`}
                      >
                        {lang === "id" ? "Detail" : "Details"}
                      </Link>
                      <a
                        /* UX: map direction CTA */
                        className="flex-1 text-center rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-900"
                        href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.common.direction}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center text-slate-700">
            <p className="font-semibold">{lang === "id" ? "Pilih kategori untuk mulai menjelajah." : "Choose a category to start exploring."}</p>
            <p className="text-sm text-slate-600 mt-1">{lang === "id" ? "Tip: gunakan Peta Interaktif untuk arah tercepat." : "Tip: use Interactive Map for quick directions."}</p>
          </div>
        </>
      ) : (
        <>
          <div className="mt-8 text-center text-slate-700">
            <p className="font-semibold">{lang === "id" ? "Pilih menu destinasi terlebih dahulu." : "Select a destination menu first."}</p>
            <p className="text-sm text-slate-600 mt-1">{lang === "id" ? "Contoh: Peta Interaktif atau kategori wisata." : "Example: Interactive Map or a category."}</p>
          </div>
          <div className="mt-10 flex flex-col gap-8">
            <div className="flex flex-wrap justify-center gap-6">
              {categoryCards.slice(0, 3).map((card) => (
                <Link
                  key={card.key}
                  href={card.href}
                  className="group w-full max-w-[240px] rounded-[28px] bg-white/80 border border-white/70 shadow-[0_18px_45px_rgba(2,6,23,0.18)] overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_25px_55px_rgba(2,6,23,0.25)]"
                >
                  <div className="relative aspect-square bg-white/60">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.05]"
                      style={{ backgroundImage: `url(${card.image || fallbackImage}), url(${fallbackImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </div>
                  <div className="p-4 text-center bg-white/70">
                    <div className="inline-flex min-w-[150px] justify-center px-4 py-2 rounded-full bg-gradient-to-b from-slate-200 to-slate-300 text-slate-800 font-semibold shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)]">
                      {normalizeLabel(lang, card.key)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {categoryCards.slice(3).map((card) => (
                <Link
                  key={card.key}
                  href={card.href}
                  className="group w-full max-w-[240px] rounded-[28px] bg-white/80 border border-white/70 shadow-[0_18px_45px_rgba(2,6,23,0.18)] overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_25px_55px_rgba(2,6,23,0.25)]"
                >
                  <div className="relative aspect-square bg-white/60">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.05]"
                      style={{ backgroundImage: `url(${card.image || fallbackImage}), url(${fallbackImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </div>
                  <div className="p-4 text-center bg-white/70">
                    <div className="inline-flex min-w-[150px] justify-center px-4 py-2 rounded-full bg-gradient-to-b from-slate-200 to-slate-300 text-slate-800 font-semibold shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)]">
                      {normalizeLabel(lang, card.key)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
