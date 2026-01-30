"use client";

import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext";

import { usePathname } from "next/navigation";

export default function LanguageSelector({ onSelect }: { onSelect: () => void }) {
    const { setLanguage } = useLanguage();
    const pathname = usePathname();

    // Do not show on admin pages
    if (pathname?.startsWith('/admin')) return null;

    const handleSelect = (lang: 'de' | 'en' | 'tr') => {
        setLanguage(lang);
        onSelect();
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-black">

            {/* Deutsch */}
            <motion.div
                className="flex-1 border-r border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden"
                onClick={() => handleSelect('de')}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <span className="text-4xl md:text-6xl font-bold text-gray-500 group-hover:text-neon-blue transition-colors">DE</span>
                <span className="absolute bottom-10 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-neon-blue">DEUTSCH</span>
            </motion.div>

            {/* English */}
            <motion.div
                className="flex-1 border-r border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden"
                onClick={() => handleSelect('en')}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <span className="text-4xl md:text-6xl font-bold text-gray-500 group-hover:text-white transition-colors">EN</span>
                <span className="absolute bottom-10 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-white">ENGLISH</span>
            </motion.div>

            {/* Türkçe */}
            <motion.div
                className="flex-1 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden"
                onClick={() => handleSelect('tr')}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <span className="text-4xl md:text-6xl font-bold text-gray-500 group-hover:text-neon-purple transition-colors">TR</span>
                <span className="absolute bottom-10 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-neon-purple">TÜRKÇE</span>
            </motion.div>

        </div>
    );
}
