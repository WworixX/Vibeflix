import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { TrendingPreview } from "@/components/landing/TrendingPreview";
import { CatalogPreview } from "@/components/landing/CatalogPreview";
import { PricingTeaser } from "@/components/landing/PricingTeaser";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrendingPreview />
        <CatalogPreview />
        <PricingTeaser />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
