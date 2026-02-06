"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Scissors, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";

// Components
import Navbar from "@/components/layout/Navbar";
import BackgroundVideo from "@/components/layout/BackgroundVideo";
import CutTransition from "@/components/features/CutTransition";
import ServicesShowcase from "@/components/features/ServicesShowcase";
import TeamShowcase from "@/components/features/TeamShowcase";
import GallerySection from "@/components/features/GallerySection";
import InfoSection from "@/components/features/InfoSection";
import { useLanguage } from "@/components/features/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Transitions
  const startBookingTransition = () => setIsTransitioning(true);
  const handleCutClosed = () => router.push('/book');

  // Parallax / Scroll Hooks
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-neon-blue selection:text-black overflow-x-hidden">

      {/* Persistent Background (shows through in Hero) */}
      <BackgroundVideo />

      {/* Navbar */}
      <Navbar onBookClick={startBookingTransition} />

      {/* Transition Overlay */}
      <CutTransition
        isActive={isTransitioning}
        onClosed={handleCutClosed}
        onComplete={() => { }} // Dummy handler to satisfy type
      />

      {/* --- HERO SECTION --- */}
      <section id="hero-section" ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: yHero, opacity: opacityHero }}
          className="relative z-10 text-center px-4"
        >
          <div className="mb-4 flex items-center justify-center gap-3 md:gap-6">
            <motion.div
              initial={{ width: 0 }} animate={{ width: "3rem" }} transition={{ duration: 1, delay: 0.5 }}
              className="h-[1px] bg-white/50 hidden md:block"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="text-neon-blue"
            >
              <Scissors size={24} />
            </motion.div>
            <motion.div
              initial={{ width: 0 }} animate={{ width: "3rem" }} transition={{ duration: 1, delay: 0.5 }}
              className="h-[1px] bg-white/50 hidden md:block"
            />
          </div>

          <motion.h1
            initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-7xl md:text-[10rem] font-bold leading-none tracking-tighter text-white mix-blend-overlay"
          >
            MAKAS
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-3xl font-light text-gray-200 mt-2 tracking-wide"
          >
            {t('hero.premium')} <span className="text-neon-blue font-semibold">{t('hero.grooming')}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={startBookingTransition}
              className="px-8 py-4 bg-white text-black font-bold tracking-widest hover:bg-neon-blue hover:text-white transition-all duration-300 rounded-full"
            >
              {t('book.button')}
            </button>

            <button
              onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold tracking-widest hover:bg-white/10 transition-all duration-300 rounded-full"
            >
              {t('hero.about_us')}
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center gap-2 text-gray-500 text-xs tracking-widest uppercase">
            <span>{t('hero.scroll')}</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ArrowDown size={16} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* --- THE STORY (About) --- */}
      <section id="about-section" className="relative py-32 bg-[#050505] z-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <Scissors className="w-12 h-12 text-neon-purple mx-auto opacity-80" />
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              "{t('story.title')} <br />
              <span className="text-gray-500">{t('story.subtitle')}</span>"
            </h2>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              {t('story.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- SERVICES SHOWCASE --- */}
      <div id="services-section">
        <ServicesShowcase />
      </div>

      {/* --- TEAM SHOWCASE --- */}
      <div id="team-section">
        <TeamShowcase />
      </div>

      {/* --- GALLERY SECTION --- */}
      <div id="gallery-section" className="bg-[#050505]">
        <GallerySection />
      </div>

      {/* --- INFO / FOOTER SECTION --- */}
      <div id="info-section" className="bg-[#080808]">
        <InfoSection />
      </div>

      {/* SIMPLE FOOTER */}
      <footer className="py-8 text-center text-gray-600 text-xs uppercase tracking-widest bg-black border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} Makas Friseur. All Rights Reserved.</p>
      </footer>

    </main>
  );
}
