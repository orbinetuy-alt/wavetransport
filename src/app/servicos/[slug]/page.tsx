import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { SERVICES_DATA, getServiceBySlug } from "./data";
import { ServicePageClient } from "./ServicePageClient";

export async function generateStaticParams() {
  return SERVICES_DATA.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.label} | Wave Transport`,
    description: service.tagline,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ServicePageClient service={service} />
    </main>
  );
}
