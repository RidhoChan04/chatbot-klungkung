"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/Language";

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  /* State: current path */
  const pathname = usePathname();
  /* Refs: nav container + items for pill measurement */
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const itemRefs = useRef([]);
  /* State: sliding pill position */
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });
  /* State: hover only */
  const [isHovered, setIsHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Localized menu labels */
  const items = [
    { href: "/", label: t.nav.home },
    { href: "/destinasi", label: t.nav.destinations },
    { href: "/akomodasi", label: t.nav.stays },
    { href: "/layanan", label: t.nav.services },
    { href: "/event", label: t.nav.events },
  ];

  /* Active index based on current path */
  const activeIndex = items.findIndex((item) =>
    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
  );

  useEffect(() => {
    /* Scroll positioning logic for sliding pill */
    function updatePill() {
      const current = itemRefs.current[activeIndex];
      const nav = navRef.current;
      if (!current || !nav) return;
      const navRect = nav.getBoundingClientRect();
      const rect = current.getBoundingClientRect();
      const x = rect.left - navRect.left;
      setPill({ x, w: rect.width, ready: true });
    }

    updatePill();
    const onResize = () => updatePill();
    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) {
      document.fonts.ready.then(updatePill).catch(() => {});
    }
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, lang]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleOutside = (event) => {
      const target = event.target;
      if (!headerRef.current || headerRef.current.contains(target)) return;
      setMobileOpen(false);
      setIsHovered(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [mobileOpen]);

  /* Derived visual state */
  const solid = isHovered || mobileOpen;

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-40">
      <div
        className={[
          "px-6 py-4 transition-all duration-300 ease-out relative",
          solid
            ? "bg-white/90 text-slate-900 shadow-[0_10px_30px_rgba(2,6,23,0.2)] backdrop-blur-md"
            : "bg-transparent text-white drop-shadow"
        ].join(" ")}
        /* UX: reveal solid navbar on hover */
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!solid ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-transparent" />
        ) : null}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center">
              <span className="font-extrabold text-slate-900">DK</span>
            </div>
            <div className="leading-tight">
              <div className={solid ? "text-slate-900 font-semibold tracking-wide" : "text-white font-semibold tracking-wide"}>Discover</div>
              <div className={solid ? "text-slate-900 font-extrabold -mt-1" : "text-white font-extrabold -mt-1"}>Klungkung</div>
            </div>
          </Link>

          {/* Nav */}
          <nav ref={navRef} className="relative hidden md:flex items-center gap-2">
            <span
              className={[
                "absolute top-1/2 -translate-y-1/2 h-9 rounded-full shadow-[0_10px_25px_rgba(15,23,42,0.35)] transition-transform duration-300 ease-out",
                solid ? "bg-white/90" : "bg-white/75",
                pill.ready ? "opacity-100" : "opacity-0"
              ].join(" ")}
              style={{ transform: `translateX(${pill.x}px) translateY(-50%)`, width: pill.w }}
            />
            {items.map((item, i) => {
              const active = i === activeIndex;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  /* Ref: measure active item */
                  ref={(el) => { itemRefs.current[i] = el; }}
                  className={[
                    "relative z-10 px-4 py-2 rounded-full text-sm font-semibold transition",
                    "hover:-translate-y-0.5",
                    active ? "text-slate-900 font-bold" : (solid ? "text-slate-900/80" : "text-white/90")
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Language + mobile */}
          <div className="flex items-center gap-2">
            <div className={[
              "hidden sm:flex items-center gap-2 rounded-full px-3 py-2",
              solid ? "bg-white/80 border border-slate-200 text-slate-900" : "bg-black/35 border border-white/15 text-white"
            ].join(" ")}>
              <span className="inline-flex h-5 w-5 rounded-full overflow-hidden">
                {/* Simple flag-ish dot */}
                <span className="w-1/2 bg-red-500" />
                <span className="w-1/2 bg-white" />
              </span>
              <button
                /* Event: switch to Indonesian */
                onClick={() => setLang("id")}
                className={lang==="id" ? "font-bold" : "opacity-80 hover:opacity-100"}
              >
                IDN
              </button>
              <span className="opacity-50">/</span>
              <button
                /* Event: switch to English */
                onClick={() => setLang("en")}
                className={lang==="en" ? "font-bold" : "opacity-80 hover:opacity-100"}
              >
                EN
              </button>
            </div>

            <Link
              href="/features"
              className={[
                "hidden sm:inline-flex rounded-full px-4 py-2 text-sm font-semibold transition",
                solid ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-white/15 border border-white/15 text-white hover:bg-white/20"
              ].join(" ")}
            >
              {t.nav.features}
            </Link>

            <button
              onClick={() => setMobileOpen((prev) => {
                const next = !prev;
                if (!next) {
                  setIsHovered(false);
                }
                return next;
              })}
              className={[
                "sm:hidden inline-flex items-center justify-center rounded-xl px-3 py-2 border",
                solid ? "bg-white/90 border-slate-200 text-slate-900" : "bg-white/10 border-white/20 text-white"
              ].join(" ")}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              <span className="text-lg leading-none">≡</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={[
            "sm:hidden mt-3 rounded-2xl border px-4 py-4 overflow-hidden transition-all duration-300 ease-out",
            solid ? "bg-white/95 border-slate-200 text-slate-900" : "bg-white/10 border-white/20 text-white",
            mobileOpen ? "max-h-[520px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
          ].join(" ")}
        >
          <div className="grid gap-2 text-sm font-semibold">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 hover:bg-white/20"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/features"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-white/20"
            >
              {t.nav.features}
            </Link>
            <div className="mt-2 flex items-center gap-3 text-xs font-semibold">
              <button
                onClick={() => setLang("id")}
                className={lang === "id" ? "opacity-100" : "opacity-70"}
              >
                Indonesia
              </button>
              <span className="opacity-50">/</span>
              <button
                onClick={() => setLang("en")}
                className={lang === "en" ? "opacity-100" : "opacity-70"}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
