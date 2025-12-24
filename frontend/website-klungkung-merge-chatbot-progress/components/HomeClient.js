"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Music, MessageCircle } from "lucide-react";
import { useLang } from "@/components/Language";
import DestinationScrubber from "@/components/DestinationScrubber";

/* Slide duration + fade timing */
const DURATION_MS = 10000;
const FADE_MS = 1000;

/* Hero video playlist */
const slides = [
  { src: "/videos/01-kelingking.mp4", labelId: "Pantai Kelingking", labelEn: "Kelingking Beach", bg: "#0b1b2b" },
  { src: "/videos/02-crystal-bay.mp4", labelId: "Pantai Crystal Bay", labelEn: "Crystal Bay Beach", bg: "#0b2230" },
  { src: "/videos/03-atuh.mp4", labelId: "Pantai Atuh", labelEn: "Atuh Beach", bg: "#111f2a" },
  { src: "/videos/04-diamond.mp4", labelId: "Pantai Diamond", labelEn: "Diamond Beach", bg: "#0b1a24" },
  { src: "/videos/05-nusa-lembongan.mp4", labelId: "Pantai Nusa Lembongan", labelEn: "Nusa Lembongan Beach", bg: "#0b1c2b" },
  { src: "/videos/06-goa-lawah.mp4", labelId: "Pura Goa Lawah", labelEn: "Goa Lawah Temple", bg: "#121b22" },
  { src: "/videos/07-penataran-agung-ped.mp4", labelId: "Pura Penataran Agung Ped", labelEn: "Penataran Agung Ped Temple", bg: "#121a24" },
  { src: "/videos/08-peguyangan.mp4", labelId: "Air Terjun Peguyangan", labelEn: "Peguyangan Waterfall", bg: "#0f1e2a" },
  { src: "/videos/09-bukit-teletubbies.mp4", labelId: "Bukit Teletubbies", labelEn: "Teletubbies Hill", bg: "#14212b" },
  { src: "/videos/10-kertha-gosa.mp4", labelId: "Kerta Gosa", labelEn: "Kerta Gosa", bg: "#0f1b27" },
];

const preloadVideo = (src, strategy = "metadata") => {
  if (typeof document === "undefined") return;
  const vid = document.createElement("video");
  vid.src = src;
  vid.preload = strategy;
  vid.muted = true;
  vid.playsInline = true;
  vid.load();
};

export default function HomeClient() {
  const { t, lang } = useLang();
  /* State: current slide + fade-in gate */
  const [idx, setIdx] = useState(0);
  const [isCurrentReady, setIsCurrentReady] = useState(true);

  /* Refs for timers and DOM access */
  const idxRef = useRef(0);
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const bgRef = useRef(null);
  const currentVideoRef = useRef(null);

  /* Parallax state container */
  const parallaxRef = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    raf: 0,
    enabled: false
  });

  const current = slides[idx];

  const goTo = (nextIdx) => {
    /* Event: switch slide with fade-in only */
    if (nextIdx === idxRef.current) return;
    setIdx(nextIdx);
    idxRef.current = nextIdx;
    setIsCurrentReady(false);
  };

  useEffect(() => {
    /* Sync ref with state */
    idxRef.current = idx;
  }, [idx]);

  useEffect(() => {
    /* Preload current + next only to avoid large bursts */
    const nextIdx = (idxRef.current + 1) % slides.length;
    preloadVideo(slides[idxRef.current].src, "auto");
    let idleId;
    if ("requestIdleCallback" in window) {
      idleId = requestIdleCallback(() => preloadVideo(slides[nextIdx].src, "metadata"));
    } else {
      idleId = setTimeout(() => preloadVideo(slides[nextIdx].src, "metadata"), 200);
    }
    return () => {
      if ("cancelIdleCallback" in window) {
        cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
    };
  }, [idx]);

  useEffect(() => {
    /* Auto-advance timer */
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();

    const tick = (now) => {
      /* Progress calculation */
      const elapsed = now - start;
      const p = Math.min(elapsed / DURATION_MS, 1);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    timerRef.current = setTimeout(() => {
      /* Event: auto-advance */
      goTo((idxRef.current + 1) % slides.length);
    }, DURATION_MS);

    return () => {
      /* Cleanup: timers */
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [idx]);

  useEffect(() => {
    /* Ensure current video plays */
    currentVideoRef.current?.play().catch(() => {});
  }, [idx]);

  useEffect(() => {
    /* Mouse parallax for desktop only */
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const minWidth = window.matchMedia("(min-width: 768px)");
    const state = parallaxRef.current;

    function updateEnabled() {
      /* Guard reduced-motion users */
      state.enabled = minWidth.matches && !prefersReduce.matches;
    }

    updateEnabled();
    const handleMouse = (event) => {
      /* Event: map mouse to parallax target */
      if (!state.enabled) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      state.tx = x * 16;
      state.ty = y * 12;
    };

    const animate = () => {
      /* Smooth lerp for parallax */
      const { enabled } = state;
      state.x += (state.tx - state.x) * 0.08;
      state.y += (state.ty - state.y) * 0.08;
      if (bgRef.current) {
        const scale = enabled ? 1.06 : 1.0;
        bgRef.current.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${scale})`;
      }
      state.raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouse);
    state.raf = requestAnimationFrame(animate);
    const onChange = () => updateEnabled();
    prefersReduce.addEventListener("change", onChange);
    minWidth.addEventListener("change", onChange);

    return () => {
      /* Cleanup: listeners + RAF */
      window.removeEventListener("mousemove", handleMouse);
      prefersReduce.removeEventListener("change", onChange);
      minWidth.removeEventListener("change", onChange);
      cancelAnimationFrame(state.raf);
    };
  }, []);

  /* Scrubber labels by language */
  const scrubberLabels = slides.map((slide) => (lang === "id" ? slide.labelId : slide.labelEn));

  return (
    <section className="relative min-h-[calc(100vh-5rem)] min-h-[calc(100svh-5rem)] w-full overflow-hidden -mt-20 pt-20">
      {/* Background color to mask load flashes */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: current.bg }}
      />
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <video
          key={`cur-${current.src}`}
          ref={currentVideoRef}
          /* Current video layer */
          className={[
            "absolute inset-0 h-full w-full object-cover transition-opacity z-0",
            isCurrentReady ? "opacity-100" : "opacity-0"
          ].join(" ")}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          src={current.src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => {
            if (!isCurrentReady) setIsCurrentReady(true);
          }}
          /* Event: move to next slide when ended */
          onEnded={() => goTo((idxRef.current + 1) % slides.length)}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-slate-900/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/45 via-transparent to-transparent" />

      <div className="absolute left-4 sm:left-10 top-20 sm:top-24 text-white/80 text-xs sm:text-sm tracking-[0.35em] uppercase">
        |{lang === "id" ? "Halaman Utama" : "Welcome Page"}|
      </div>

      <div className="relative z-10 min-h-[calc(100vh-5rem)] min-h-[calc(100svh-5rem)] flex items-center justify-center px-5 sm:px-6 pb-24">
        <div className="max-w-5xl text-center">
          {/* Hero headline + CTA */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-white/90 text-xs sm:text-sm tracking-[0.25em] uppercase">
            Klungkung Tourism
          </div>
          <h1 className="text-reveal mt-6 text-white font-extrabold leading-none drop-shadow-[0_18px_60px_rgba(2,6,23,0.6)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl whitespace-pre-line">
            When Heritage{"\n"}Meet Paradise
          </h1>
          <p className="mt-6 text-white/85 text-base sm:text-lg md:text-xl">
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/destinasi" className="rounded-full bg-white px-6 py-3 font-extrabold text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.35)] hover:shadow-[0_25px_60px_rgba(15,23,42,0.45)] transition">
              {t.hero.ctaExplore}
            </Link>
            <Link href="/destinasi/peta" className="rounded-full bg-black/35 text-white border border-white/30 px-6 py-3 font-extrabold hover:bg-black/45 transition">
              {t.hero.ctaMap}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-24 sm:bottom-28 w-[min(96vw,1000px)] z-20 [@media(max-height:760px)]:static [@media(max-height:760px)]:translate-x-0 [@media(max-height:760px)]:mx-auto [@media(max-height:760px)]:mt-6 [@media(max-height:760px)]:mb-4">
        {/* UX: destination scrubber */}
        <DestinationScrubber
          destinations={scrubberLabels}
          activeIndex={idx}
          onChange={(next) => goTo(next)}
        />
      </div>

      <div className="absolute left-0 right-0 bottom-2 [@media(max-height:760px)]:static [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:mb-6">
        {/* UX: social quick actions */}
        <div className="mx-4 sm:mx-10 rounded-2xl bg-black/40 backdrop-blur border border-white/10 py-3 sm:py-4 flex items-center justify-center gap-4 sm:gap-6">
          <a className="h-11 w-11 rounded-full bg-white flex items-center justify-center" href="https://wa.me/6281200000000" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <MessageCircle className="h-5 w-5 text-emerald-600" />
          </a>
          <a className="h-11 w-11 rounded-full bg-white flex items-center justify-center" href="https://facebook.com/klungkungtourism" target="_blank" rel="noreferrer" aria-label="Facebook">
            <Facebook className="h-5 w-5 text-blue-600" />
          </a>
          <a className="h-11 w-11 rounded-full bg-white flex items-center justify-center" href="https://tiktok.com/@klungkungtourism" target="_blank" rel="noreferrer" aria-label="Music">
            <Music className="h-5 w-5 text-slate-800" />
          </a>
          <a className="h-11 w-11 rounded-full bg-white flex items-center justify-center" href="https://instagram.com/klungkungtourism" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram className="h-5 w-5 text-pink-600" />
          </a>
        </div>
      </div>
    </section>
  );
}
