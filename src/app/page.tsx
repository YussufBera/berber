"use client";

import Hero from "@/components/features/Hero";
import BackgroundVideo from "@/components/layout/BackgroundVideo";
import Navbar from "@/components/layout/Navbar";
import InfoSection from "@/components/features/InfoSection";
import GallerySection from "@/components/features/GallerySection";
import CutTransition from "@/components/features/CutTransition";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startBookingTransition = () => {
    setIsTransitioning(true);
  };

  const handleCutClosed = () => {
    router.push('/book');
  };

  const handleCutComplete = () => {
    // Optional cleanup if needed
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden font-sans">

      {/* Background Video - Persistent across all states */}
      <BackgroundVideo />

      <CutTransition
        isActive={isTransitioning}
        onClosed={handleCutClosed}
        onComplete={handleCutComplete}
      />

      <Navbar onBookClick={startBookingTransition} />
      <div id="hero-section">
        <Hero onBookClick={startBookingTransition} />
      </div>

      <div id="info-section">
        <InfoSection />
      </div>

      <div id="gallery-section">
        <GallerySection />
      </div>

    </main>
  );
}
