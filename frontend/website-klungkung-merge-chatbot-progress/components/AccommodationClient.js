"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/Language";
import { SectionTitle, Pill } from "@/components/UI";
import { ACCOMMODATION, ACCOMMODATION_CATEGORIES, ACCOMMODATION_GROUPS } from "@/data/accommodations";
import MapEmbed from "@/components/MapEmbed";

/* Utility: normalize phone for WhatsApp */
function normalizePhone(phone) {
  return phone.replace(/[^\d]/g, "");
}

/* Category matching logic for filters */
function matchCategory(item, cat) {
  if (!cat || cat === "all") return true;
  if (cat === "penginapan") return item.type === "stay";
  if (cat === "transportasi") return item.type === "transport";
  return item.category === cat;
}

export default function AccommodationClient() {
  const { lang, t } = useLang();
  /* State: active category */
  const [category, setCategory] = useState("all");
  /* State: selected item */
  const [selected, setSelected] = useState(null);
  /* Fallback image to avoid empty cards */
  const fallbackImage = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=70";

  /* Filtered items by category */
  const filtered = useMemo(
    () => ACCOMMODATION.filter(item => matchCategory(item, category)),
    [category]
  );

  /* Derived selection for detail panel */
  const list = filtered.length ? filtered : ACCOMMODATION;
  const active = selected ? list.find(item => item.id === selected.id) : null;
  /* Localization helpers */
  const getName = (item) => (lang === "id" ? item.name : (item.nameEn || item.name));
  const getDesc = (item) => (lang === "id" ? item.desc : (item.descEn || item.desc));
  const getPrice = (item) => (lang === "id" ? item.price : (item.priceEn || item.price));
  const hasPrice = (item) => Boolean(item.price || item.priceEn);
  const hasContact = (item) => Boolean(item.contact);
  const getAccess = (item) => item.access;
  const getNote = (item) => (lang === "id" ? item.note : (item.noteEn || item.note));
  const getWhatsapp = (item) => normalizePhone(item.contact || "");
  const buildBackgroundImage = (primary) => {
    const safePrimary = primary ? encodeURI(primary) : fallbackImage;
    const safeFallback = encodeURI(fallbackImage);
    return `url("${safePrimary}"), url("${safeFallback}")`;
  };

  function renderDetailCard(item, className = "") {
    if (!item) return null;
    return (
      <div className={["rounded-3xl bg-white/80 border border-white/60 shadow-[0_20px_45px_rgba(2,6,23,0.18)] overflow-hidden", className].join(" ")}>
        <div className="relative h-44">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: buildBackgroundImage(item.image) }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-slate-900">
            {lang === "id" ? "Detail Pilihan" : "Selected Detail"}
          </div>
        </div>
        <div className="p-5">
          <div className="text-sm text-slate-700 space-y-2">
            <div className="font-bold text-slate-900">{getName(item)}</div>
            <div>{getDesc(item)}</div>
            <div><span className="font-semibold">{lang === "id" ? "Lokasi" : "Location"}:</span> {item.location}</div>
            {hasPrice(item) ? (
              <div><span className="font-semibold">{lang === "id" ? "Harga" : "Price"}:</span> {getPrice(item)}</div>
            ) : null}
            {hasContact(item) ? (
              <div><span className="font-semibold">{lang === "id" ? "Kontak" : "Contact"}:</span> {item.contact}</div>
            ) : null}
            {getAccess(item) ? (
              <div><span className="font-semibold">{lang === "id" ? "Akses" : "Access"}:</span> {getAccess(item)}</div>
            ) : null}
            {getNote(item) ? (
              <div><span className="font-semibold">{lang === "id" ? "Catatan" : "Notes"}:</span> {getNote(item)}</div>
            ) : null}
            <div className="mt-3 flex gap-2">
              <a
                /* UX: direction CTA */
                className="flex-1 text-center rounded-xl bg-slate-900 text-white px-4 py-3 font-bold"
                href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                {t.common.direction}
              </a>
              {getWhatsapp(item) ? (
                <a
                  /* UX: WhatsApp CTA */
                  className="flex-1 text-center rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-900"
                  href={`https://wa.me/${getWhatsapp(item)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!selected) return;
    if (!list.some(item => item.id === selected.id)) {
      setSelected(null);
    }
  }, [list, selected]);


  return (
    <section className="min-h-screen w-screen px-6 sm:px-10 pt-12 pb-0">
      <SectionTitle
        title={lang === "id" ? "Akomodasi" : "Accommodations"}
        subtitle={lang === "id" ? "Penginapan dan transportasi sesuai kategori." : "Stays and transport by category."}
      />

      <div className="rounded-2xl bg-white/70 border border-white/60 shadow-[0_18px_45px_rgba(2,6,23,0.18)] p-4">
        <div className="flex flex-wrap gap-2">
          {ACCOMMODATION_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              /* Event: set category */
              onClick={() => setCategory(cat.key)}
              className={[
                "px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-500 ease-out",
                category === cat.key
                  ? "bg-slate-900 text-white border-slate-900 opacity-100"
                  : "bg-white border-slate-200 text-slate-700 opacity-70 hover:opacity-100 hover:bg-white/80"
              ].join(" ")}
            >
              {lang === "id" ? cat.titleId : cat.titleEn}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {list.map(item => {
            const cardImage = item.image || fallbackImage;
            const isActive = active?.id === item.id;
            return (
              <div key={item.id}>
                <button
                  /* Event: select item for details */
                  onClick={() => setSelected((prev) => (prev?.id === item.id ? null : item))}
                  className={[
                    "w-full text-left rounded-2xl border overflow-hidden transition group bg-white",
                    isActive
                      ? "border-slate-900 shadow-[0_18px_45px_rgba(2,6,23,0.32)]"
                      : "border-slate-200 hover:shadow-[0_18px_45px_rgba(2,6,23,0.18)]"
                  ].join(" ")}
                >
                  <div className="relative h-36">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.06]"
                      style={{ backgroundImage: buildBackgroundImage(cardImage) }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-900">
                      {item.type === "stay" ? (lang === "id" ? "Penginapan" : "Stay") : (lang === "id" ? "Transportasi" : "Transport")}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-slate-900">{getName(item)}</div>
                    <p className="text-sm text-slate-600 mt-1">{getDesc(item)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {hasPrice(item) ? <Pill>{getPrice(item)}</Pill> : null}
                      <Pill>{item.location}</Pill>
                    </div>
                  </div>
                </button>
                <div
                  className={[
                    "sm:hidden overflow-hidden transition-all duration-300 ease-out",
                    isActive
                      ? "max-h-[520px] opacity-100 mt-4 translate-y-0 scale-100"
                      : "max-h-0 opacity-0 mt-0 -translate-y-2 scale-95 pointer-events-none"
                  ].join(" ")}
                >
                  <div className="rounded-2xl bg-white/80 border border-white/60 shadow-[0_14px_30px_rgba(2,6,23,0.15)] p-4">
                    <div className="text-xs font-semibold text-slate-600 mb-2">
                      {lang === "id" ? "Detail Pilihan" : "Selected Detail"}
                    </div>
                    <div className="text-sm text-slate-700 space-y-2">
                      <div><span className="font-semibold">{lang === "id" ? "Lokasi" : "Location"}:</span> {item.location}</div>
                      {hasPrice(item) ? (
                        <div><span className="font-semibold">{lang === "id" ? "Harga" : "Price"}:</span> {getPrice(item)}</div>
                      ) : null}
                      {hasContact(item) ? (
                        <div><span className="font-semibold">{lang === "id" ? "Kontak" : "Contact"}:</span> {item.contact}</div>
                      ) : null}
                      {getAccess(item) ? (
                        <div><span className="font-semibold">{lang === "id" ? "Akses" : "Access"}:</span> {getAccess(item)}</div>
                      ) : null}
                      {getNote(item) ? (
                        <div><span className="font-semibold">{lang === "id" ? "Catatan" : "Notes"}:</span> {getNote(item)}</div>
                      ) : null}
                      <div className="mt-3 flex gap-2">
                        <a
                          className="flex-1 text-center rounded-xl bg-slate-900 text-white px-4 py-3 font-bold"
                          href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.common.direction}
                        </a>
                        {getWhatsapp(item) ? (
                          <a
                            className="flex-1 text-center rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-900"
                            href={`https://wa.me/${getWhatsapp(item)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            WhatsApp
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <MapEmbed lat={item.lat} lng={item.lng} zoom={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={[
            "space-y-4 hidden lg:block transition-all duration-300 ease-out",
            active
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          ].join(" ")}
        >
          {renderDetailCard(active)}
          {active ? <MapEmbed lat={active.lat} lng={active.lng} zoom={13} /> : null}
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-white/70 border border-white/60 shadow-[0_20px_45px_rgba(2,6,23,0.18)] p-5">
        <h3 className="font-extrabold text-slate-900">{lang === "id" ? "Kategori (Referensi)" : "Category Reference"}</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-4">
          {ACCOMMODATION_GROUPS.map(group => (
            <div key={group.key} className="rounded-2xl bg-white border border-slate-200 p-4">
              <div className="font-bold">{lang === "id" ? group.titleId : group.titleEn}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.items.map(item => <Pill key={item.key}>{lang === "id" ? item.titleId : item.titleEn}</Pill>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
