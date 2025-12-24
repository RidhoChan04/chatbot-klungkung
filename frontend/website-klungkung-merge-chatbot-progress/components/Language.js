"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

/* Global language context */
const LanguageContext = createContext(null);

/* Translation dictionary */
const DICT = {
  id: {
    nav: { home: "Beranda", destinations: "Destinasi", stays: "Akomodasi", services: "Layanan", events: "Event", features: "Fitur Penting" },
    hero: { title: "When Heritage Meet Paradise", subtitle: "Jelajahi Klungkung: warisan budaya, pantai, kuliner, dan pengalaman lokal.", ctaExplore: "Jelajahi Destinasi", ctaMap: "Buka Peta" },
    common: { search: "Cari...", category: "Kategori", direction: "Rute", contact: "Kontak", open: "Jam Buka", price: "Harga", address: "Alamat" },
    features: { title: "Fitur Penting", smart: "Fitur Pintar", emergency: "Kontak Darurat", stats: "Statistik BPS (Dummy)", download: "Unduhan" },
    itinerary: { title: "Itinerary Builder", pick: "Pilih kategori", generate: "Generate Itinerary", result: "Hasil itinerary (contoh 1 hari)" },
    currency: { title: "Currency Converter", from: "Dari", to: "Ke", convert: "Convert" },
  },
  en: {
    nav: { home: "Home", destinations: "Destinations", stays: "Accommodations", services: "Services", events: "Events", features: "Key Features" },
    hero: { title: "When Heritage Meet Paradise", subtitle: "Explore Klungkung: culture, beaches, food, and local experiences.", ctaExplore: "Explore Destinations", ctaMap: "Open Map" },
    common: { search: "Search...", category: "Category", direction: "Direction", contact: "Contact", open: "Open Hours", price: "Price", address: "Address" },
    features: { title: "Key Features", smart: "Smart Features", emergency: "Emergency Contacts", stats: "BPS Statistics (Dummy)", download: "Downloads" },
    itinerary: { title: "Itinerary Builder", pick: "Choose category", generate: "Generate Itinerary", result: "Itinerary result (sample 1-day)" },
    currency: { title: "Currency Converter", from: "From", to: "To", convert: "Convert" },
  }
};

export function LanguageProvider({ children }) {
  /* State: active language */
  const [lang, setLang] = useState("en");

  const value = useMemo(() => ({
    lang,
    setLang,
    t: DICT[lang],
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
