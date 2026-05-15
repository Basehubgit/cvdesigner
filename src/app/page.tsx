import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import TemplatesShowcase from "@/components/landing/TemplatesShowcase";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <TemplatesShowcase />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
