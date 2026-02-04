"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Scissors, Menu, X } from "lucide-react";
import { useLanguage } from "../features/LanguageContext";
import AppointmentManager from "../features/AppointmentManager";

export default function Navbar({ onBookClick }: { onBookClick?: () => void }) {
    const { t, language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const scrollToSection = (id: string) => {
        if (id === "booking-section" && onBookClick) {
            onBookClick();
            setIsOpen(false);
            return;
        }

        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsOpen(false);
        }
    };

    const navLinks = [
        { name: t("nav.home"), id: "hero-section" },
        { name: t("nav.info"), id: "info-section" },
        { name: t("nav.gallery"), id: "gallery-section" },
        { name: t("nav.book"), id: "booking-section" },
    ];

    return (
        <>
            <motion.nav
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
            >
                <div className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex items-center justify-between">
                    <button
                        onClick={() => scrollToSection("hero-section")}
                        className="flex items-center gap-2 text-white font-bold text-xl tracking-tighter hover:text-neon-blue transition-colors"
                    >
                        <Scissors className="text-neon-blue" />
                        <span>MAKAS</span>
                    </button>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className="text-sm font-medium text-gray-300 hover:text-white hover:text-neon-blue transition-all uppercase tracking-wide"
                            >
                                {link.name}
                            </button>
                        ))}

                        <button
                            onClick={() => setIsManageOpen(true)}
                            className="text-sm font-medium text-neon-purple hover:text-white transition-all uppercase tracking-wide border border-neon-purple/50 px-3 py-1 rounded-full hover:bg-neon-purple hover:border-neon-purple"
                        >
                            {t('nav.manage')}
                        </button>

                        {/* Language Switcher Desktop */}
                        <div className="flex items-center gap-3 border-l border-white/20 pl-6 ml-2">
                            {(['de', 'en', 'tr', 'ku'] as const).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`text-xs font-bold transition-all ${language === lang
                                        ? "text-neon-blue"
                                        : "text-gray-500 hover:text-white"
                                        }`}
                                >
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white hover:text-neon-blue transition-colors"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8"
                >
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => scrollToSection(link.id)}
                            className="text-3xl font-bold text-white hover:text-neon-blue transition-all"
                        >
                            {link.name}
                        </button>
                    ))}

                    <button
                        onClick={() => {
                            setIsManageOpen(true);
                            setIsOpen(false);
                        }}
                        className="text-xl font-bold text-neon-purple hover:text-white transition-all mt-4"
                    >
                        {t('nav.manage')}
                    </button>

                    {/* Language Switcher Mobile */}
                    <div className="flex items-center gap-6 mt-8">
                        {(['de', 'en', 'tr', 'ku'] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => {
                                    setLanguage(lang);
                                    setIsOpen(false);
                                }}
                                className={`text-xl font-bold transition-all ${language === lang
                                    ? "text-neon-blue"
                                    : "text-gray-500 hover:text-white"
                                    }`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute bottom-10 text-gray-500 hover:text-white"
                    >
                        Close
                    </button>
                </motion.div>
            )}
            {/* App Manager Modal */}
            <AppointmentManager isOpen={isManageOpen} onClose={() => setIsManageOpen(false)} />
        </>
    );
}
