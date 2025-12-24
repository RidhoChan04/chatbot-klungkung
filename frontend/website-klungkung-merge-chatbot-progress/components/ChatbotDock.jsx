"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Maximize2 } from "lucide-react";
import Link from "next/link";

export default function ChatbotDock() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const frameRef = useRef(null);
  const backFlagKey = "chatbot:return-close";

  useEffect(() => {
    const handlePageShow = () => {
      try {
        if (sessionStorage.getItem(backFlagKey)) {
          sessionStorage.removeItem(backFlagKey);
          setOpen(false);
        }
      } catch {}
    };
    window.addEventListener("pageshow", handlePageShow);
    handlePageShow();
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
      const t = setTimeout(() => {
        const doc = frameRef.current?.contentWindow?.document;
        doc?.getElementById("userInput")?.focus();
      }, 150);
      const frame = frameRef.current;
      if (frame) {
        try {
          const href = frame.contentWindow?.location?.href || "";
          if (!href.includes("/chatbot/index.html")) {
            frame.src = "/chatbot/index.html?widget=1";
          }
        } catch {
          frame.src = "/chatbot/index.html?widget=1";
        }
      }
      return () => {
        document.body.style.overflow = "";
        clearTimeout(t);
      };
    }
    document.body.style.overflow = "";
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-end sm:justify-end pointer-events-none">
        <div
          className={[
            "absolute inset-0 bg-black/30 transition-opacity duration-300 ease-out motion-reduce:transition-none",
            open ? "opacity-100 pointer-events-auto" : "opacity-0"
          ].join(" ")}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <div
          className={[
            "relative z-[70] w-[calc(100vw-24px)] sm:w-[400px] h-[calc(100vh-140px)] sm:h-[600px] max-h-[calc(100vh-120px)] rounded-2xl bg-white shadow-[0_24px_60px_rgba(2,6,23,0.35)] overflow-hidden mb-4 sm:mb-0 sm:mr-4 transition-all duration-300 ease-out motion-reduce:transition-none",
            open ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          ].join(" ")}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <Link
                href="/chatbot/index.html"
                className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition"
                onClick={() => {
                  try {
                    sessionStorage.setItem(backFlagKey, "1");
                  } catch {}
                }}
              >
                <Maximize2 className="h-4 w-4" />
              </Link>
              <div className="text-sm font-semibold">Chatbot Klungkung</div>
            </div>
            <button
              ref={closeRef}
              onClick={() => setOpen(false)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <iframe
            ref={frameRef}
            title="Chatbot Klungkung"
            src="/chatbot/index.html?widget=1"
            className="w-full h-[calc(100%-48px)]"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="group h-12 w-12 rounded-full bg-white border border-slate-200 text-[#003366] shadow-[0_12px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition flex items-center justify-center relative"
        aria-label="Open chat"
      >
        <MessageCircle className="h-5 w-5 text-[#003366]" />
        <span className="absolute -left-1 -top-1 text-[10px] font-bold bg-[#003366] text-white px-1.5 py-0.5 rounded-full shadow group-hover:scale-105 transition">
          Chat
        </span>
      </button>
    </div>
  );
}
