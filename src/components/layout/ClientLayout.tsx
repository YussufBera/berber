"use client";

import { useState, useEffect } from "react";
import SmoothScroll from "./SmoothScroll";
import IntroAnimation from "../features/IntroAnimation";
import LanguageSelector from "../features/LanguageSelector";
import { LanguageProvider, useLanguage } from "../features/LanguageContext";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <LanguageProvider>
            <AnimatePresence mode="wait">
                {/* 1. If it's Admin, just render children (LanguageSelector will hide itself or we can hide it here) */}
                {isAdmin ? (
                    <motion.div key="admin-content">
                        {children}
                        <LanguageSelector onSelect={() => { }} />
                    </motion.div>
                ) : (
                    /* 2. If it's Public Site, show Language Selector Logic */
                    <>
                        <MainContent>
                            {children}
                        </MainContent>
                    </>
                )}
            </AnimatePresence>
        </LanguageProvider>
    );
}

// Inner component to consume Context
function MainContent({ children }: { children: React.ReactNode }) {
    const { language } = useLanguage();
    // Start with intro shown
    const [showIntro, setShowIntro] = useState(true);

    return (
        <>
            <AnimatePresence mode="wait">
                {showIntro && (
                    <motion.div key="intro">
                        <IntroAnimation onComplete={() => setShowIntro(false)} />
                    </motion.div>
                )}

                {!showIntro && !language && (
                    <motion.div key="lang-select">
                        <LanguageSelector onSelect={() => { }} />
                    </motion.div>
                )}

                {!showIntro && language && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
