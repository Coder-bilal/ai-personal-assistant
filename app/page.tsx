"use client";

import Header from "./components/Header";
import Hero from "./components/Hero";
import IntegrationSection from "./components/IntegrationSection";
import BentoFeatures from "./components/BentoFeatures";
import InteractiveDemo from "./components/InteractiveDemo";
import PricingSection from "./components/PricingSection";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200">
      {/* Premium background mesh lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-violet-950/20 via-transparent to-transparent blur-3xl opacity-60" />
      </div>

      {/* Header Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        
        {/* Hero Section */}
        <Hero />

        {/* Integration Connection Dashboard */}
        <IntegrationSection />

        {/* Bento Grid Features List */}
        <BentoFeatures />

        {/* Interactive AI Playground Simulator */}
        <InteractiveDemo />

        {/* Dedicated Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <CTA />

      </main>

      {/* Footer Area */}
      <Footer />
    </div>
  );
}

