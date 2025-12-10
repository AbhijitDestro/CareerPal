import { Background } from "@/components/layout/Background";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CTA } from "@/components/sections/CTA";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { Testimonials } from "@/components/sections/Testimonials";
import { About } from "@/components/sections/About";

export default function Home() {
  return (
    <main className="min-h-screen text-foreground selection:bg-primary/20 relative">
      <Background />
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}