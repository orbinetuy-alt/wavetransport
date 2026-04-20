import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ToursSection } from "@/components/landing/ToursSection";
import { WhyWaveSection } from "@/components/landing/WhyWaveSection";
import { ContactoSection } from "@/components/landing/ContactoSection";
import { Footer } from "@/components/landing/Footer";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    const role = await getCurrentUserRole();
    if (role === "ADMIN") redirect("/admin");
    if (role === "DRIVER") redirect("/driver");
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <ToursSection />
      <WhyWaveSection />
      <ContactoSection />
      <Footer />
    </main>
  );
}

