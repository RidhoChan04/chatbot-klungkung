"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/Language";
import { Pill } from "@/components/UI";
import { EVENTS } from "@/data/events";

export default function EventClient() {
  const { lang } = useLang();
  const [selected, setSelected] = useState(EVENTS[0] || null);
  const [category, setCategory] = useState("event");
  const [view, setView] = useState("grid");
  const fallbackPoster = "https://images.unsplash.com/photo-1521335751419-603f61523713?auto=format&fit=crop&w=1200&q=70";

  const getTitle = (event) => (lang === "id" ? event.title : (event.titleEn || event.title));
  const getDescription = (event) => (lang === "id" ? event.description : (event.descriptionEn || event.description));
  const getType = (event) => (lang === "id" ? event.type : (event.typeEn || event.type));
  const getDate = (event) => event?.date;
  const getSchedule = (event) => (lang === "id" ? event.schedule : (event.scheduleEn || event.schedule));
  const getAccess = (event) => (lang === "id" ? event.access : (event.accessEn || event.access));
  const getNote = (event) => (lang === "id" ? event.note : (event.noteEn || event.note));
  const getLocations = (event) => (lang === "id" ? event.locations : (event.locationsEn || event.locations));
  const getSources = (event) => (lang === "id" ? event.sources : (event.sourcesEn || event.sources));
  const getCategoryKey = (event) => {
    if (event?.id === "event_kalender_klungkung") return "kalender";
    if (event?.id === "event_info_terkini_pariwisata") return "info";
    return "event";
  };

  const filteredEvents = useMemo(() => {
    return EVENTS.filter((event) => (category === "event" ? getCategoryKey(event) === "event" : getCategoryKey(event) === category));
  }, [category]);

  const categoryCounts = useMemo(() => {
    const counts = { event: 0, kalender: 0, info: 0 };
    EVENTS.forEach((event) => {
      const key = getCategoryKey(event);
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, []);

  const isGrid = view === "grid";
  const activeEvent = selected && filteredEvents.some((event) => event.id === selected.id)
    ? selected
    : (filteredEvents[0] || null);
  const activePoster = activeEvent?.poster || fallbackPoster;

  const scrollToDetail = () => {
    const el = document.getElementById("event-detail");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (!selected || !filteredEvents.some((event) => event.id === selected.id)) {
      setSelected(filteredEvents[0] || null);
    }
  }, [filteredEvents, selected]);

  return (
    <section className="relative min-h-screen w-screen px-6 sm:px-10 pt-12 pb-0 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-20 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl" />
      <div className="pointer-events-none absolute top-20 -left-16 h-80 w-80 rounded-full bg-slate-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_25px_60px_rgba(15,23,42,0.18)]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${activePoster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr,0.8fr] p-6 sm:p-8">
          <div className="text-white">
            <div className="text-xs uppercase tracking-[0.35em] text-emerald-200/80">
              {lang === "id" ? "Rekomendasi Event" : "Event Recommendations"}
            </div>
            <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              {lang === "id" ? "Temukan Event Mendatang" : "Discover Upcoming Events"}
            </h1>
            <p className="mt-3 text-sm text-white/75">
              {lang === "id" ? "Agenda resmi, budaya, dan komunitas Klungkung dalam satu tempat." : "Official, cultural, and community agendas in one place."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                {lang === "id" ? "Klungkung" : "Klungkung"}
              </span>
              <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                {lang === "id" ? "Budaya" : "Culture"}
              </span>
              <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                {lang === "id" ? "Wisata" : "Tourism"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur">
            <div className="relative h-36 overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${activePoster})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-800">
                {lang === "id" ? "Highlight" : "Featured"}
              </div>
            </div>
            <div className="mt-4 text-white">
              <div className="text-lg font-extrabold">{activeEvent ? getTitle(activeEvent) : "-"}</div>
              <div className="mt-1 text-xs text-white/70">
                {activeEvent ? (getDate(activeEvent) || getSchedule(activeEvent)) : ""}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                  {activeEvent ? getType(activeEvent) : "Event"}
                </span>
                <button
                  onClick={scrollToDetail}
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900"
                >
                  {lang === "id" ? "Lihat Detail" : "View Detail"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 rounded-full bg-slate-100/80 p-2">
        {[
          { key: "event", labelId: "Semua", labelEn: "All Types" },
          { key: "kalender", labelId: "Kalender Event", labelEn: "Event Calendar" },
          { key: "info", labelId: "Info Terkini", labelEn: "Latest Info" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setCategory(item.key)}
            className={[
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
              category === item.key
                ? "bg-slate-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                : "bg-white text-slate-600 border border-slate-200 hover:text-slate-900"
            ].join(" ")}
          >
            <span>{lang === "id" ? item.labelId : item.labelEn}</span>
            <span className={["text-xs font-semibold", category === item.key ? "text-white/80" : "text-slate-500"].join(" ")}>
              {categoryCounts[item.key] || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          <div className="rounded-3xl border border-white/60 bg-white/75 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.16)]">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
              <span>{lang === "id" ? "Tanggal Event" : "Event Date"}</span>
              <span className="text-slate-400">v</span>
            </div>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {getDate(activeEvent) || getSchedule(activeEvent) || (lang === "id" ? "Jadwal fleksibel" : "Flexible schedule")}
            </div>
          </div>


          <div className="rounded-3xl border border-white/60 bg-white/75 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.16)]">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
              <span>{lang === "id" ? "Lokasi Umum" : "Common Locations"}</span>
              <span className="text-slate-400">v</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(getLocations(activeEvent) || []).length ? (
                getLocations(activeEvent).map((item) => (
                  <Pill key={item}>{item}</Pill>
                ))
              ) : (
                <span className="text-sm text-slate-600">{lang === "id" ? "Lihat detail untuk lokasi." : "See details for locations."}</span>
              )}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-600">
              {lang === "id" ? "Menampilkan" : "Showing"} <span className="font-semibold text-slate-900">{filteredEvents.length}</span> {lang === "id" ? "event" : "events"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  view === "grid" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"
                ].join(" ")}
              >
                {lang === "id" ? "Tampilan Kartu" : "Card View"}
              </button>
              <button
                onClick={() => setView("list")}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  view === "list" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"
                ].join(" ")}
              >
                {lang === "id" ? "Tampilan Daftar" : "List View"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white/75 border border-white/60 shadow-[0_20px_45px_rgba(2,6,23,0.16)] p-5">
            <div className={["grid gap-4", isGrid ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"].join(" ")}>
              {filteredEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelected(event)}
                  className={[
                    "text-left rounded-2xl border overflow-hidden transition group",
                    selected?.id === event.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.28)]"
                      : "bg-white border-slate-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]",
                    !isGrid ? "sm:flex" : ""
                  ].join(" ")}
                >
                  <div className={["relative", isGrid ? "h-40" : "h-40 sm:h-auto sm:w-56"].join(" ")}>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.08]"
                      style={{ backgroundImage: `url(${event.poster || fallbackPoster})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-800">
                      {lang === "id" ? "Meriah" : "Festive"}
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="font-bold">{getTitle(event)}</div>
                    {getDate(event) ? (
                      <div className={"text-xs " + (selected?.id === event.id ? "text-white/70" : "text-slate-500")}>
                        {getDate(event)}
                      </div>
                    ) : null}
                    {getSchedule(event) ? (
                      <div className={"text-sm " + (selected?.id === event.id ? "text-white/80" : "text-slate-600")}>
                        {getSchedule(event)}
                      </div>
                    ) : null}
                    {!isGrid ? (
                      <p className={"mt-2 text-sm " + (selected?.id === event.id ? "text-white/80" : "text-slate-600")}>
                        {getDescription(event)}
                      </p>
                    ) : null}
                    <div className="mt-2"><Pill>{getType(event) || "Event"}</Pill></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div id="event-detail" className="rounded-3xl bg-white/80 border border-white/60 shadow-[0_20px_45px_rgba(2,6,23,0.16)] overflow-hidden">
            <div className="relative h-52">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${activeEvent?.poster || fallbackPoster})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/35 via-transparent to-emerald-500/20" />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-900">
                {lang === "id" ? "Poster Event" : "Event Poster"}
              </div>
            </div>
            <div className="p-5">
              {activeEvent ? (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900">{getTitle(activeEvent)}</h3>
                    <Pill>{getType(activeEvent) || "Event"}</Pill>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{getDescription(activeEvent)}</p>

                  <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                    {getDate(activeEvent) ? (
                      <div className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{lang === "id" ? "Tanggal" : "Date"}</div>
                        <div className="mt-1 font-semibold">{getDate(activeEvent)}</div>
                      </div>
                    ) : null}
                    {getSchedule(activeEvent) ? (
                      <div className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{lang === "id" ? "Jadwal" : "Schedule"}</div>
                        <div className="mt-1 font-semibold">{getSchedule(activeEvent)}</div>
                      </div>
                    ) : null}
                    {getAccess(activeEvent) ? (
                      <div className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{lang === "id" ? "Akses" : "Access"}</div>
                        <div className="mt-1 font-semibold">{getAccess(activeEvent)}</div>
                      </div>
                    ) : null}
                    {getNote(activeEvent) ? (
                      <div className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{lang === "id" ? "Catatan" : "Notes"}</div>
                        <div className="mt-1 font-semibold">{getNote(activeEvent)}</div>
                      </div>
                    ) : null}
                  </div>

                  {getLocations(activeEvent) ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                      <div className="font-bold text-slate-900">{lang === "id" ? "Lokasi Umum" : "Common Locations"}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {getLocations(activeEvent).map((item) => (
                          <Pill key={item}>{item}</Pill>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {getSources(activeEvent) ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                      <div className="font-bold text-slate-900">{lang === "id" ? "Sumber" : "Sources"}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {getSources(activeEvent).map((item) => (
                          <Pill key={item}>{item}</Pill>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
