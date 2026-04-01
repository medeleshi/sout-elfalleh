import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ValueProps } from "@/components/landing/ValueProps";
import { UserTypes } from "@/components/landing/UserTypes";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Trust } from "@/components/landing/Trust";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div id="about"><ValueProps /></div>
        <div id="farmers"><UserTypes /></div>
        <div id="how-it-works"><HowItWorks /></div>
        <div id="stats"><Trust /></div>
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
