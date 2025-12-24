"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }) {
  const pathname = usePathname();
  /* State: trigger page fade-in */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /* UX: reset transition on route change */
    setReady(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    /* UI: page transition wrapper */
    <div className={["page-transition", ready ? "page-transition-enter" : ""].join(" ")}>
      {children}
    </div>
  );
}
