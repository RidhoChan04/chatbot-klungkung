"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/components/Language";
import { SectionTitle, Pill } from "@/components/UI";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* Dummy stats for chart */
const dummyStats = [
  { month: "Jan", domestik: 1200, manca: 320 },
  { month: "Feb", domestik: 1500, manca: 410 },
  { month: "Mar", domestik: 1700, manca: 380 },
  { month: "Apr", domestik: 2100, manca: 520 },
  { month: "May", domestik: 1900, manca: 470 },
  { month: "Jun", domestik: 2400, manca: 610 },
];

export default function FeaturesClient() {
  const { lang, t } = useLang();

  /* Currency converter (static rate) */
  const RATE = 0.000065; // ~ IDR to USD dummy
  /* State: currency input values */
  const [idr, setIdr] = useState(100000);
  const [usd, setUsd] = useState(() => +(100000 * RATE).toFixed(2));

  /* Event: convert IDR to USD */
  function convertFromIdr(v) {
    const n = Number(v || 0);
    setIdr(n);
    setUsd(+((n * RATE).toFixed(2)));
  }
  /* Event: convert USD to IDR */
  function convertFromUsd(v) {
    const n = Number(v || 0);
    setUsd(n);
    setIdr(Math.round(n / RATE));
  }

  /* Itinerary builder */
  const [itCat, setItCat] = useState("wisata");
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [tourMode, setTourMode] = useState(false);
  /* Localized labels for category buttons */
  const itineraryLabels = {
    wisata: { id: "Wisata", en: "Destinations" },
    budaya: { id: "Budaya", en: "Cultural" },
    kuliner: { id: "Kuliner", en: "Culinary" },
    suvenir: { id: "Suvenir", en: "Souvenirs" },
  };
  /* Derived itinerary by category */
  const itinerary = useMemo(() => {
    const common = [
      { time: "09:00", act: lang === "id" ? "Mulai dari pusat kota Semarapura" : "Start from Semarapura city center" },
      { time: "12:00", act: lang === "id" ? "Makan siang di rekomendasi kuliner lokal" : "Lunch at a local culinary spot" },
      { time: "15:30", act: lang === "id" ? "Belanja suvenir / pasar seni" : "Souvenir shopping / art market" },
      { time: "18:00", act: lang === "id" ? "Sunset & foto-foto" : "Sunset & photos" },
    ];
    if (itCat === "budaya") {
      return [
        { time: "09:30", act: lang === "id" ? "Kerta Gosa (dummy)" : "Kerta Gosa (sample)" },
        { time: "11:00", act: lang === "id" ? "Pura Goa Lawah (dummy)" : "Goa Lawah Temple (sample)" },
        ...common,
      ];
    }
    if (itCat === "kuliner") {
      return [
        { time: "09:00", act: lang === "id" ? "Sarapan di warung lokal" : "Breakfast at a local warung" },
        { time: "11:00", act: lang === "id" ? "Kopi Penida (dummy)" : "Kopi Penida (sample)" },
        { time: "13:00", act: lang === "id" ? "Warung Lawar Klungkung (dummy)" : "Klungkung Lawar Warung (sample)" },
        ...common,
      ];
    }
    return [
      { time: "09:30", act: lang === "id" ? "Pantai Kusamba (dummy)" : "Kusamba Beach (sample)" },
      { time: "11:30", act: lang === "id" ? "Nusa Penida Viewpoint (dummy)" : "Kelingking Beach Viewpoint (sample)" },
      ...common,
    ];
  }, [itCat, lang]);

  return (
    <section className="min-h-screen w-screen px-6 sm:px-10 pt-12 pb-0">
      <SectionTitle title={t.features.title} subtitle={lang === "id" ? "Ringkasan fitur penting (dummy) sesuai referensi." : "Key features summary (dummy) per reference."} />

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Smart Features */}
        <div className="rounded-2xl bg-white/80 border border-slate-200 shadow-sm p-5">
          <h3 className="font-extrabold text-slate-900">{t.features.smart}</h3>
          <ul className="mt-3 text-sm text-slate-700 space-y-2 list-disc pl-5">
            <li>{lang === "id" ? "Dukungan multi-bahasa (ID/EN)" : "Multi-language support (ID/EN)"}</li>
            <li>{lang === "id" ? "Konversi mata uang (dummy)" : "Currency converter (dummy)"}</li>
            <li>{lang === "id" ? "AI Travel Assistant (simulasi)" : "AI Travel Assistant (simulation)"}</li>
            <li>{lang === "id" ? "Itinerary personal (dummy)" : "Personalized itinerary (dummy)"}</li>
            <li>{lang === "id" ? "Rekomendasi pintar (simulasi)" : "Smart recommendations (simulation)"}</li>
            <li>{lang === "id" ? "Panduan tur virtual (simulasi)" : "Virtual tour guide (simulation)"}</li>
          </ul>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-bold text-slate-900">{lang === "id" ? "AI Travel Assistant" : "AI Travel Assistant"}</div>
            <div className="mt-3 flex flex-col gap-3">
              <input
                /* Event: update assistant query */
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                placeholder={lang === "id" ? "Tanya rekomendasi wisata..." : "Ask for travel recommendations..."}
                value={assistantQuery}
                onChange={(e) => setAssistantQuery(e.target.value)}
              />
              <button
                /* Event: generate assistant reply */
                onClick={() => {
                  if (!assistantQuery) {
                    setAssistantReply("");
                    return;
                  }
                  setAssistantReply(
                    lang === "id"
                      ? `Saran rute: ${assistantQuery} -> Pantai Kusamba, Kerta Gosa, Kuliner malam.`
                      : `Suggested route: ${assistantQuery} -> Kusamba Beach, Kerta Gosa, Evening culinary spots.`
                  );
                }}
                className="rounded-xl bg-slate-900 text-white px-4 py-2 font-semibold"
              >
                {lang === "id" ? "Tanya Sekarang" : "Ask Now"}
              </button>
            </div>
            {assistantReply ? <p className="mt-3 text-sm text-slate-700">{assistantReply}</p> : null}
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-bold text-slate-900">{t.currency.title}</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">IDR</label>
                <input
                  /* Event: IDR input */
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                  type="number"
                  value={idr}
                  onChange={(e) => convertFromIdr(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">USD</label>
                <input
                  /* Event: USD input */
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                  type="number"
                  value={usd}
                  onChange={(e) => convertFromUsd(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {lang === "id" ? "Rate statis (dummy) untuk prototipe." : "Static rate (dummy) for prototype."}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-bold text-slate-900">{t.itinerary.title}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["wisata","budaya","kuliner","suvenir"].map(k => (
                <button
                  key={k}
                  /* Event: set itinerary category */
                  onClick={() => setItCat(k)}
                  className={[
                    "px-3 py-2 rounded-xl border text-sm font-semibold",
                    itCat === k ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-700"
                  ].join(" ")}
                >
                  {lang === "id" ? itineraryLabels[k].id : itineraryLabels[k].en}
                </button>
              ))}
            </div>
            <div className="mt-3 text-sm text-slate-700">
              <div className="font-semibold">{t.itinerary.result}:</div>
              <ul className="mt-2 space-y-1">
                {itinerary.map((x, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <Pill>{x.time}</Pill>
                    <span className="flex-1">{x.act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-bold text-slate-900">{lang === "id" ? "AI Virtual Tour Guide" : "AI Virtual Tour Guide"}</div>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "id" ? "Simulasi panduan audio singkat." : "Short guided audio simulation."}
            </p>
            <button
              /* Event: toggle virtual tour simulation */
              onClick={() => setTourMode(v => !v)}
              className="mt-3 rounded-xl bg-slate-900 text-white px-4 py-2 font-semibold"
            >
              {tourMode ? (lang === "id" ? "Hentikan Tur" : "Stop Tour") : (lang === "id" ? "Mulai Tur" : "Start Tour")}
            </button>
            {tourMode ? (
              <p className="mt-3 text-sm text-slate-700">
                {lang === "id" ? "Sekarang Anda berada di Kerta Gosa, pusat sejarah Klungkung. Lanjutkan ke Pasar Seni." : "You are now at Kerta Gosa, the heritage heart of Klungkung. Continue to the Art Market."}
              </p>
            ) : null}
          </div>
        </div>

        {/* Emergency */}
        <div className="rounded-2xl bg-white/80 border border-slate-200 shadow-sm p-5">
          <h3 className="font-extrabold text-slate-900">{t.features.emergency}</h3>
          <p className="text-sm text-slate-600 mt-2">
            {lang === "id" ? "Tombol cepat (dummy)." : "Quick buttons (dummy)."}
          </p>

          <div className="mt-4 space-y-2">
            <a className="block text-center rounded-xl bg-slate-900 text-white px-4 py-3 font-bold" href="tel:110">
              {lang === "id" ? "Polisi (110)" : "Police (110)"}
            </a>
            <a className="block text-center rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-900" href="tel:112">
              {lang === "id" ? "UGD (112)" : "Emergency (112)"}
            </a>
            <a className="block text-center rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-900" href="tel:113">
              {lang === "id" ? "Pemadam (113)" : "Fire Dept (113)"}
            </a>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            {lang === "id" ? "Catatan: nomor bisa kamu sesuaikan dengan layanan resmi di daerahmu." : "Note: update the numbers to match your local official services."}
          </p>
        </div>

        {/* Stats */}
        <div className="rounded-2xl bg-white/80 border border-slate-200 shadow-sm p-5">
          <h3 className="font-extrabold text-slate-900">{t.features.stats}</h3>
          <p className="text-sm text-slate-600 mt-2">
            {lang === "id" ? "Grafik dummy (Recharts) untuk prototipe." : "Dummy chart (Recharts) for prototype."}
          </p>

          <div className="mt-4 h-64 rounded-xl border border-slate-200 bg-white p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyStats}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="domestik" />
                <Line type="monotone" dataKey="manca" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>{lang === "id" ? "domestik" : "domestic"}</Pill>
            <Pill>{lang === "id" ? "manca" : "foreign"}</Pill>
          </div>
        </div>

        {/* Download */}
        <div className="rounded-2xl bg-white/80 border border-slate-200 shadow-sm p-5">
          <h3 className="font-extrabold text-slate-900">{t.features.download}</h3>
          <p className="text-sm text-slate-600 mt-2">
            {lang === "id" ? "Link download dummy untuk prototipe." : "Dummy download links for prototype."}
          </p>

          <div className="mt-4 space-y-2">
            <a className="block text-center rounded-xl bg-slate-900 text-white px-4 py-3 font-bold" href="/downloads/map-direction.pdf">
              {lang === "id" ? "Rute Peta (PDF)" : "Map Direction (PDF)"}
            </a>
            <a className="block text-center rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-900" href="/downloads/info-wisata.pdf">
              {lang === "id" ? "Info Wisata (PDF)" : "Tourism Info (PDF)"}
            </a>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            {lang === "id"
              ? <>Taruh file PDF asli di folder <code className="px-1 bg-slate-100 rounded">public/downloads</code>.</>
              : <>Place the original PDFs in <code className="px-1 bg-slate-100 rounded">public/downloads</code>.</>
            }
          </p>
        </div>
      </div>
    </section>
  );
}
