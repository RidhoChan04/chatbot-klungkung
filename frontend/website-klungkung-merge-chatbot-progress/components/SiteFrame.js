"use client";

import { usePathname } from "next/navigation";

export default function SiteFrame({ children }) {
  /* State: current path for background */
  const pathname = usePathname();

  /* Background per route (tourism vibe) */
  const bgByPath = [
    { match: (p) => p === "/", url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=60" },
    { match: (p) => p.startsWith("/destinasi") && !p.includes("/peta"), url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2400&q=60" }, // waterfall/forest vibe
    { match: (p) => p.includes("/peta"), url: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=2400&q=60" },
    { match: (p) => p.startsWith("/akomodasi"), url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2400&q=60" },
    { match: (p) => p.startsWith("/layanan"), url: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=2400&q=60" },
    { match: (p) => p.startsWith("/event"), url: "https://images.unsplash.com/photo-1521335751419-603f61523713?auto=format&fit=crop&w=2400&q=60" },
    { match: (p) => p.startsWith("/features"), url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=2400&q=60" },
  ];
  /* Pick background by route */
  const bg = (bgByPath.find(x => x.match(pathname)) || bgByPath[0]).url;

  return (
    <div className="bg-grain">
      <div className="site-canvas">
        {/* UI: backdrop layer */}
        <div className="page-bg hero-pan" style={{ backgroundImage: `url(${bg})` }} />
        <div className="page-overlay" />
        <div className="relative z-10 min-h-[calc(100vh-5rem)] w-screen pt-20 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
