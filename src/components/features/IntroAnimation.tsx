"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors } from "lucide-react";

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        // Total duration of the cut animation (2s) + small buffer
        const timer = setTimeout(() => {
            setFinished(true);
            setTimeout(onComplete, 800); // Wait for exit fade out
        }, 2200);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!finished && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
                >
                    {/* Text Positioned Higher */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-20 text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-[0.2em] text-white">
                            NELIO
                        </h1>
                        <h2 className="text-lg md:text-2xl tracking-[0.5em] text-neon-blue mt-2">
                            FRISEUR
                        </h2>
                    </motion.div>

                    {/* Loading Line Container */}
                    <div className="relative w-full max-w-4xl h-1 px-10">
                        {/* The Base Line (White/Visible initially) */}
                        <div className="absolute inset-x-10 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />

                        {/* The Cut Mask (Black rectangle expanding to hide the line) */}
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="absolute left-0 top-0 h-4 -mt-2 bg-black z-10" // Height 4 covers the line, -mt-2 centers it roughly
                        />

                        {/* The Scissors (Moving leading edge) */}
                        <motion.div
                            initial={{ left: "0%" }}
                            animate={{ left: "100%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="absolute top-1/2 -translate-y-1/2 z-20 text-neon-blue"
                        >
                            <Scissors size={32} className="-rotate-90" /> {/* Rotated to look like cutting forward if needed, or adjust angle */}
                        </motion.div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
