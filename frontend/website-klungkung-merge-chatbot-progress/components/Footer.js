import { Instagram, Globe, Phone, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* UI: sticky bottom brand bar */}
      <div className="bg-[#3aa3b7] text-white">
        <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 font-semibold">
            <Youtube className="h-5 w-5" />
            <span>Prime Comm Public Relations</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2"><Instagram className="h-4 w-4" /> @primecommpr</span>
            <span className="inline-flex items-center gap-2"><Globe className="h-4 w-4" /> www.PrimeCommPR.co.id</span>
            <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> 02122795612</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
