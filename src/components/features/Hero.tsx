"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Scissors } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function Hero({ onBookClick }: { onBookClick?: () => void }) {
    const { t } = useLanguage();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background - Removed to let global video show through */}
            {/* <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-80" />
            </div> */}

            <motion.div
                style={{ y: yText, opacity: opacityText }}
                className="relative z-20 text-center px-4"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-9xl font-bold tracking-tighter mb-6"
                >
                    <span className="block text-white glow-text">MAKAS</span>
                    {/* Dynamic sub-part if needed, or just keeping brand name static is fine too. Let's translate the catchy parts. */}
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mt-2 text-4xl md:text-6xl">
                        FRISEUR
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light tracking-wide mt-4"
                >
                    {t('hero.subtitle')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="mt-12"
                >
                    <button
                        onClick={onBookClick}
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-neon-blue px-8 py-4 font-bold text-black transition-all hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 focus:ring-offset-gray-900 z-30"
                    >
                        <span className="mr-2">{t('book.button')}</span>
                        <Scissors className="group-hover:rotate-45 transition-transform" />
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
}
