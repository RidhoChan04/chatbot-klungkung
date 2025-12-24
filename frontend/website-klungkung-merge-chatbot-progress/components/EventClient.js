"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/components/Language";
import { SectionTitle, Pill } from "@/components/UI";
import { EVENTS } from "@/data/events";
import MapEmbed from "@/components/MapEmbed";

/* Format date for event display */
function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export default function EventClient() {
  const { lang, t } = useLang();
  /* State: selected event detail */
  const [selected, setSelected] = useState(EVENTS[0]);
  /* Localized update feed */
  const updates = lang === "id" ? [
    { id: "update-1", title: "Jadwal Festival Budaya diperbarui", date: "2025-12-15", eventId: "festival-budaya" },
    { id: "update-2", title: "Penida Surf tambah sesi pagi", date: "2026-01-10", eventId: "penida-surf" },
    { id: "update-3", title: "Kuliner Night buka area baru", date: "2026-02-05", eventId: "kuliner-night" },
  ] : [
    { id: "update-1", title: "Culture Festival schedule updated", date: "2025-12-15", eventId: "festival-budaya" },
    { id: "update-2", title: "Penida Surf added a morning session", date: "2026-01-10", eventId: "penida-surf" },
    { id: "update-3", title: "Culinary Night opened a new area", date: "2026-02-05", eventId: "kuliner-night" },
  ];

  /* Group events by month */
  const byMonth = useMemo(() => {
    const groups = {};
    EVENTS.forEach(e => {
      const key = e.date.slice(0,7);
      groups[key] = groups[key] || [];
      groups[key].push(e);
    });
    return Object.entries(groups).sort(([a],[b]) => a.localeCompare(b));
  }, []);

  /* Localization helpers */
  const getTitle = (event) => (lang === "id" ? event.title : (event.titleEn || event.title));
  const getDescription = (event) => (lang === "id" ? event.description : (event.descriptionEn || event.description));
  const getPrice = (event) => (lang === "id" ? event.price : (event.priceEn || event.price));
  const getLocation = (event) => (lang === "id" ? event.location : (event.locationEn || event.location));

  return (
    <section className="min-h-screen w-screen px-6 sm:px-10 pt-12 pb-0">
      <SectionTitle
        title="Event"
        subtitle={lang === "id" ? "Kalender event dan info terkini (dummy)." : "Event calendar and latest info (dummy)."}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white/70 border border-white/60 shadow-[0_20px_45px_rgba(2,6,23,0.18)] p-5">
            <h3 className="font-extrabold text-slate-900">{lang === "id" ? "Kalender Event" : "Event Calendar"}</h3>
            <div className="mt-4 space-y-4">
              {byMonth.map(([month, arr]) => (
                <div key={month} className="rounded-2xl bg-white border border-slate-200 p-4">
                  <div className="font-bold text-slate-900">{month}</div>
                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    {arr.map(e => (
                      <button
                        key={e.id}
                        /* Event: select detail */
                        onClick={() => setSelected(e)}
                        className={[
                          "text-left rounded-2xl border overflow-hidden transition group",
                          selected?.id === e.id ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 hover:shadow-[0_18px_45px_rgba(2,6,23,0.18)]"
                        ].join(" ")}
                      >
                        <div className="relative h-28">
                          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.05]" style={{ backgroundImage: `url(${e.poster})` }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                        </div>
                        <div className="p-4">
                          <div className="font-bold">{getTitle(e)}</div>
                          <div className={"text-sm " + (selected?.id === e.id ? "text-white/80" : "text-slate-600")}>
                            {formatDate(e.date)} - {e.time}
                          </div>
                          <div className="mt-2"><Pill>{getPrice(e)}</Pill></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white/70 border border-white/60 shadow-[0_20px_45px_rgba(2,6,23,0.18)] p-5">
            <h3 className="font-extrabold text-slate-900">{lang === "id" ? "Info Terkini" : "Latest Info"}</h3>
            <div className="mt-4 space-y-3">
              {updates.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    /* Event: jump to detail panel */
                    const target = EVENTS.find((ev) => ev.id === item.eventId);
                    if (target) setSelected(target);
                    const el = document.getElementById("event-detail");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="w-full text-left rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:shadow-[0_18px_45px_rgba(2,6,23,0.12)] transition"
                >
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-600 mt-1">{formatDate(item.date)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div id="event-detail" className="rounded-3xl bg-white/80 border border-white/60 shadow-[0_20px_45px_rgba(2,6,23,0.18)] overflow-hidden">
            <div className="relative h-52">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${selected?.poster})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-900">
                {lang === "id" ? "Poster Event" : "Event Poster"}
              </div>
            </div>
            <div className="p-5">
              {selected ? (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900">{getTitle(selected)}</h3>
                    <Pill>Event</Pill>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{getDescription(selected)}</p>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="col-span-2 rounded-2xl overflow-hidden border border-slate-200">
                      <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${selected.photo})` }} />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
                      <div className="font-semibold">{lang === "id" ? "Highlight" : "Highlight"}</div>
                      <div className="mt-1">{getLocation(selected)}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-slate-700 space-y-1">
                    <div><span className="font-semibold">{lang === "id" ? "Tanggal" : "Date"}:</span> {formatDate(selected.date)}</div>
                    <div><span className="font-semibold">{lang === "id" ? "Waktu" : "Time"}:</span> {selected.time}</div>
                    <div><span className="font-semibold">{lang === "id" ? "Harga" : "Price"}:</span> {getPrice(selected)}</div>
                    <div><span className="font-semibold">{lang === "id" ? "Lokasi" : "Location"}:</span> {getLocation(selected)}</div>
                    <div><span className="font-semibold">{lang === "id" ? "Kontak" : "Contact"}:</span> {selected.contact}</div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <a
                      /* UX: direction CTA */
                      className="flex-1 text-center rounded-xl bg-slate-900 text-white px-4 py-3 font-bold"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.common.direction}
                    </a>
                    <a className="flex-1 text-center rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-900" href={`tel:${selected.contact}`}>
                      {lang === "id" ? "Telepon" : "Call"}
                    </a>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {selected ? <MapEmbed lat={selected.lat} lng={selected.lng} zoom={13} /> : null}
        </div>
      </div>
    </section>
  );
}
