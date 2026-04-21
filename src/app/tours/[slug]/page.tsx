import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { TOURS_DATA, getTourBySlug } from "./data";
import { TourPageClient } from "./TourPageClient";

export async function generateStaticParams() {
  return TOURS_DATA.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return {};
  return {
    title: `${tour.label} | Wave Transport`,
    description: tour.tagline,
  };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) notFound();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <TourPageClient tour={tour} />
    </main>
  );
}
