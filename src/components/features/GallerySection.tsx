"use client";

import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext";

export default function GallerySection() {
    const { t } = useLanguage();

    const images = [
        { src: "/gallery/real-interior.png", alt: t('gallery.interior'), span: "col-span-1 md:col-span-2 row-span-2" },
        { src: "/gallery/real-tools.png", alt: t('gallery.tools'), span: "col-span-1 row-span-1" },
        { src: "/gallery/real-lounge.png", alt: t('gallery.lounge'), span: "col-span-1 row-span-1" },
    ];

    return (
        <section className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tighter glow-text">
                    {t('nav.gallery')}
                </h2>
                <div className="h-1 w-24 bg-neon-purple rounded-full mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                {images.map((img, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 1, scale: 1 }} // Force visible initial state for debugging
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative rounded-3xl overflow-hidden border border-white/10 group ${img.span} bg-gray-800 min-h-[300px]`}
                    >
                        {/* Fallback debugging: using standard img tag */}
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <span className="text-white font-medium tracking-wide">{img.alt}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
