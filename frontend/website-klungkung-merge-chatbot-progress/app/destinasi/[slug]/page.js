import { notFound } from "next/navigation";
import DestinationDetailClient from "@/components/DestinationDetailClient";
import { DESTINATIONS } from "@/data/destinations";

export function generateStaticParams() {
  /* Static params for SSG */
  return DESTINATIONS.map(d => ({ slug: d.id }));
}

export default function Page({ params }) {
  /* Lookup destination by slug */
  const item = DESTINATIONS.find(d => d.id === params.slug);
  /* UX: 404 on unknown slug */
  if (!item) return notFound();
  return <DestinationDetailClient item={item} />;
}
